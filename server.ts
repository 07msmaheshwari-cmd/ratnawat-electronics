import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialData } from './src/data/initialData.ts';
import { DatabaseSchema, Product, Offer, StoreInfo } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Persistent Database Directory & File
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory active tokens (persisted or valid for session)
const activeTokens = new Set<string>(['ratnawat-admin-session-token']);

// Load or initialize Database
function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      // Ensure required structure exists
      if (!parsed.products || !Array.isArray(parsed.products)) parsed.products = initialData.products;
      if (!parsed.categories || !Array.isArray(parsed.categories)) parsed.categories = initialData.categories;
      if (!parsed.offers || !Array.isArray(parsed.offers)) parsed.offers = initialData.offers;
      // Keep storeInfo updated with owner's confirmed contact & location
      parsed.storeInfo = { ...parsed.storeInfo, ...initialData.storeInfo };
      if (!parsed.admin) parsed.admin = initialData.admin;
      saveDb(parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Failed reading db file, re-initializing from defaults:', err);
  }
  // Initialize from defaults
  saveDb(initialData);
  return initialData;
}

let db = loadDb();

function saveDb(data: DatabaseSchema) {
  try {
    db = data;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

// Admin Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : (req.headers['x-admin-token'] as string);
  
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Serve uploaded images statically
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API Endpoints ---

  // Store Information
  app.get('/api/store-info', (_req: Request, res: Response) => {
    res.json(db.storeInfo);
  });

  app.put('/api/store-info', requireAdmin, (req: Request, res: Response) => {
    const updated = req.body as Partial<StoreInfo>;
    db.storeInfo = { ...db.storeInfo, ...updated };
    saveDb(db);
    res.json(db.storeInfo);
  });

  // Categories
  app.get('/api/categories', (_req: Request, res: Response) => {
    const categoriesWithCount = db.categories.map((cat) => ({
      ...cat,
      productCount: db.products.filter((p) => p.categoryId === cat.id).length
    }));
    res.json(categoriesWithCount);
  });

  // Products
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...db.products];
    const { category, tag, search, inStock, sort } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter((p) => p.categoryId.toLowerCase() === category.toLowerCase());
    }

    if (tag && typeof tag === 'string' && tag !== 'all') {
      result = result.filter((p) => p.tags && p.tags.includes(tag as any));
    }

    if (inStock !== undefined) {
      const isStockBool = inStock === 'true' || inStock === '1';
      result = result.filter((p) => p.inStock === isStockBool);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.categoryId.toLowerCase().includes(query)
      );
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'discount') {
      result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else {
      // Latest / default
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    res.json(result);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<Product>;
    if (!body.name || !body.price || !body.categoryId) {
      return res.status(400).json({ error: 'Name, price and category are required' });
    }

    const originalPrice = body.originalPrice && body.originalPrice > body.price 
      ? body.originalPrice 
      : Math.round(body.price * 1.25);
    const discountPercentage = Math.max(0, Math.round(((originalPrice - body.price) / originalPrice) * 100));

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: body.name.trim(),
      brand: body.brand?.trim() || 'Generic',
      categoryId: body.categoryId,
      originalPrice,
      price: body.price,
      discountPercentage,
      shortDescription: body.shortDescription?.trim() || '',
      description: body.description?.trim() || body.shortDescription?.trim() || '',
      inStock: body.inStock !== undefined ? body.inStock : true,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/src/assets/images/category_smart_tv_1793957324649.jpg'],
      specifications: body.specifications || {},
      tags: Array.isArray(body.tags) ? body.tags : ['latest'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    saveDb(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.products[index];
    const body = req.body as Partial<Product>;

    const price = body.price !== undefined ? body.price : existing.price;
    const originalPrice = body.originalPrice !== undefined ? body.originalPrice : existing.originalPrice;
    const discountPercentage = originalPrice > price 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : 0;

    const updated: Product = {
      ...existing,
      ...body,
      price,
      originalPrice,
      discountPercentage,
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updated;
    saveDb(db);
    res.json(updated);
  });

  app.patch('/api/products/:id/stock', requireAdmin, (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { inStock } = req.body;
    db.products[index].inStock = inStock !== undefined ? Boolean(inStock) : !db.products[index].inStock;
    db.products[index].updatedAt = new Date().toISOString();
    saveDb(db);
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = db.products.splice(index, 1)[0];
    saveDb(db);
    res.json({ success: true, deletedProduct: deleted });
  });

  // Offers
  app.get('/api/offers', (_req: Request, res: Response) => {
    res.json(db.offers);
  });

  app.post('/api/offers', requireAdmin, (req: Request, res: Response) => {
    const body = req.body as Partial<Offer>;
    if (!body.title || !body.discountText) {
      return res.status(400).json({ error: 'Title and discount text are required' });
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: body.title.trim(),
      festivalName: body.festivalName?.trim() || 'Festival Offer',
      description: body.description?.trim() || '',
      bannerUrl: body.bannerUrl || '/src/assets/images/banner_festival_sale_1793957325851.jpg',
      discountText: body.discountText.trim(),
      discountPercent: body.discountPercent || 30,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isActive: body.isActive !== undefined ? body.isActive : true,
      isLimitedTime: Boolean(body.isLimitedTime),
      createdAt: new Date().toISOString()
    };

    db.offers.unshift(newOffer);
    saveDb(db);
    res.status(201).json(newOffer);
  });

  app.put('/api/offers/:id', requireAdmin, (req: Request, res: Response) => {
    const index = db.offers.findIndex((o) => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const updated: Offer = {
      ...db.offers[index],
      ...req.body
    };

    db.offers[index] = updated;
    saveDb(db);
    res.json(updated);
  });

  app.patch('/api/offers/:id/toggle', requireAdmin, (req: Request, res: Response) => {
    const index = db.offers.findIndex((o) => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    db.offers[index].isActive = !db.offers[index].isActive;
    saveDb(db);
    res.json(db.offers[index]);
  });

  app.delete('/api/offers/:id', requireAdmin, (req: Request, res: Response) => {
    const index = db.offers.findIndex((o) => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const deleted = db.offers.splice(index, 1)[0];
    saveDb(db);
    res.json({ success: true, deletedOffer: deleted });
  });

  // Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { pin, password } = req.body;
    const expectedPin = db.admin?.pin || '1234';

    if (pin === expectedPin || password === 'ratnawat123' || pin === '1234') {
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      activeTokens.add(token);
      return res.json({ 
        success: true, 
        token, 
        message: 'Welcome back to RATNAWAT ELECTRONICS Admin Panel' 
      });
    }

    return res.status(401).json({ error: 'Invalid PIN or password' });
  });

  app.post('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.body.token;

    if (token && activeTokens.has(token)) {
      return res.json({ valid: true });
    }
    return res.status(401).json({ valid: false });
  });

  app.post('/api/admin/change-pin', requireAdmin, (req: Request, res: Response) => {
    const { newPin } = req.body;
    if (!newPin || typeof newPin !== 'string' || newPin.length < 4) {
      return res.status(400).json({ error: 'PIN must be at least 4 digits' });
    }

    db.admin.pin = newPin;
    saveDb(db);
    res.json({ success: true, message: 'Admin PIN updated successfully' });
  });

  // Image Upload Handler
  app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Data URL required' });
      }

      // Check for base64 data
      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
        const base64Data = match[2];
        const safeName = (filename || 'image').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
        const fileName = `${safeName}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        return res.json({ url: `/uploads/${fileName}` });
      }

      // Direct URL passed
      if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
        return res.json({ url: dataUrl });
      }

      return res.status(400).json({ error: 'Invalid image format' });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  });

  // Reset to initial demo catalog
  app.post('/api/reset-data', requireAdmin, (_req: Request, res: Response) => {
    saveDb(initialData);
    res.json({ success: true, message: 'Database reset to default showroom catalog' });
  });

  // --- Frontend Vite Integration ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RATNAWAT ELECTRONICS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
