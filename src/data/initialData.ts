import { DatabaseSchema, Category, Product, Offer, StoreInfo } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'mobiles',
    name: 'Mobiles',
    iconName: 'Smartphone',
    description: 'Latest 5G smartphones, flagship devices and feature phones'
  },
  {
    id: 'televisions',
    name: 'Televisions',
    iconName: 'Tv',
    description: '4K Ultra HD Smart TVs, OLEDs, and QLED displays'
  },
  {
    id: 'refrigerators',
    name: 'Refrigerators',
    iconName: 'Refrigerator',
    description: 'Single door, double door, and multi-door inverter refrigerators'
  },
  {
    id: 'washing-machines',
    name: 'Washing Machines',
    iconName: 'WashingMachine',
    description: 'Top load, front load, and semi-automatic washing machines'
  },
  {
    id: 'air-conditioners',
    name: 'Air Conditioners',
    iconName: 'Wind',
    description: '1 Ton to 2 Ton 3-Star & 5-Star split inverter air conditioners'
  },
  {
    id: 'speakers',
    name: 'Speakers & Audio',
    iconName: 'Speaker',
    description: 'Bluetooth party speakers, soundbars, and home theatre systems'
  },
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    iconName: 'Flame',
    description: 'Mixer grinders, induction cooktops, microwave ovens, water purifiers'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    iconName: 'Headphones',
    description: 'Earbuds, power banks, fast chargers, cables, and TV wall mounts'
  }
];

export const initialOffers: Offer[] = [
  {
    id: 'offer-diwali-2026',
    title: 'Grand Diwali Electronics Mahotsav',
    festivalName: 'Diwali Special',
    description: 'Celebrate Diwali with up to 45% discount on Smart TVs, Refrigerators & 5G Smartphones. Free gift with every purchase above ₹15,000!',
    bannerUrl: '/src/assets/images/banner_festival_sale_1793957325851.jpg',
    discountText: 'Flat 30% - 45% OFF + Zero Down Payment',
    discountPercent: 40,
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    isActive: true,
    isLimitedTime: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'offer-dussehra-saving',
    title: 'Vijayadashami Super Deals on Inverter ACs & Appliances',
    festivalName: 'Dussehra Dhamaka',
    description: 'Special seasonal price drops on 5-Star Inverter Air Conditioners & Washing Machines with 5-year comprehensive PCB warranty.',
    bannerUrl: '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg',
    discountText: 'Save up to ₹12,000 + Free Standard Installation',
    discountPercent: 35,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    isLimitedTime: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'offer-holi-wash',
    title: 'Holi Colorful Savings on Front Load Washers',
    festivalName: 'Holi Utsav',
    description: 'Upgrade your laundry with AI smart wash machines. Instant cashback of ₹3,000 on leading bank cards.',
    bannerUrl: '/src/assets/images/category_refrigerator_1793957326163.jpg',
    discountText: 'Up to 28% OFF + Free Detergent Hamper',
    discountPercent: 28,
    startDate: '2027-03-10',
    endDate: '2027-03-25',
    isActive: false,
    isLimitedTime: true,
    createdAt: new Date().toISOString()
  }
];

export const initialStoreInfo: StoreInfo = {
  name: 'RATNAWAT ELECTRONICS',
  tagline: 'Your Trusted Electronics Store',
  phone: '+91 88279 98830',
  whatsappNumber: '918827998830',
  email: 'ratnawat.electronics@gmail.com',
  address: 'RATNAWAT ELECTRONICS, Near Porwal Panchayat Bhawan, Chandwasa, Madhya Pradesh 458553',
  openingHours: 'Mon - Sun: 9:00 AM – 9:30 PM (All 7 Days Open)',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ratnawat+Electronics+Near+Porwal+Panchayat+Bhawan+Chandwasa',
  logoUrl: '',
  aboutText: 'RATNAWAT ELECTRONICS is your trusted destination for genuine consumer electronics and branded home appliances in Chandwasa and surrounding areas. Located near Porwal Panchayat Bhawan, our showroom offers 100% genuine products with manufacturer warranties, honest local pricing, zero hidden charges, and personal after-sales care.'
};

export const initialProducts: Product[] = [
  {
    id: 'prod-samsung-tv-55',
    name: 'Samsung 55-inch Crystal 4K UHD Smart TV (55DUE70B)',
    brand: 'Samsung',
    categoryId: 'televisions',
    originalPrice: 64900,
    price: 41990,
    discountPercentage: 35,
    shortDescription: '55" PurColor Display, Crystal Processor 4K, Smart Hub & Q-Symphony sound',
    description: 'Immerse your living room in crystal clear 4K resolution with vibrant lifelike colors. Powered by the Crystal 4K processor with Motion Xcelerator, HDR support, and built-in voice assistants. Authorized Samsung India warranty with free wall mounting and table installation by certified engineers.',
    inStock: true,
    images: [
      '/src/assets/images/category_smart_tv_1793957324649.jpg',
      '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg'
    ],
    specifications: {
      'Screen Size': '55 Inches (138 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Refresh Rate': '60 Hertz',
      'Sound Output': '20 Watts with Q-Symphony',
      'Smart TV OS': 'Tizen OS with Netflix, Prime, Hotstar & YouTube',
      'Connectivity': '3 HDMI Ports, 1 USB Port, Wi-Fi, Bluetooth 5.2',
      'Warranty': '1 Year Comprehensive + 1 Year Additional on Panel'
    },
    tags: ['featured', 'bestseller', 'festival_offer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-lg-refrigerator-242',
    name: 'LG 242L 3-Star Smart Inverter Double Door Frost-Free Refrigerator',
    brand: 'LG',
    categoryId: 'refrigerators',
    originalPrice: 37999,
    price: 25490,
    discountPercentage: 33,
    shortDescription: 'Smart Inverter Compressor, Multi Air Flow, Door Cooling+ & Stabilizer Free Operation',
    description: 'Keep your milk, fruits, and vegetables farm fresh for days with Door Cooling+ technology. Engineered with a silent Smart Inverter Compressor that consumes less electricity and works reliably even during village voltage fluctuations without an external stabilizer.',
    inStock: true,
    images: [
      '/src/assets/images/category_refrigerator_1793957326163.jpg'
    ],
    specifications: {
      'Capacity': '242 Litres (Suitable for families of 3 to 4 members)',
      'Energy Rating': '3 Star (Annual Consumption ~232 kWh)',
      'Cooling Technology': 'Multi Air Flow & Door Cooling+',
      'Compressor Type': 'Smart Inverter Compressor (Super Silent)',
      'Defrost System': 'Auto Defrost (Frost Free)',
      'Voltage Range': '100V - 310V (Stabilizer Free)',
      'Warranty': '1 Year on Product + 10 Years on Compressor'
    },
    tags: ['featured', 'bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-oneplus-nord-ce4',
    name: 'OnePlus Nord CE4 5G (8GB RAM, 128GB Storage, Dark Chrome)',
    brand: 'OnePlus',
    categoryId: 'mobiles',
    originalPrice: 24999,
    price: 21999,
    discountPercentage: 12,
    shortDescription: 'Snapdragon 7 Gen 3, 100W SUPERVOOC, 5500 mAh battery & Sony LYT-600 OIS camera',
    description: 'Experience blazing 5G speed with the Qualcomm Snapdragon 7 Gen 3 chipset and 120Hz Fluid AMOLED display. The massive 5500mAh battery charges from 1% to 100% in just 29 minutes with the included 100W power brick.',
    inStock: true,
    images: [
      '/src/assets/images/banner_festival_sale_1793957325851.jpg'
    ],
    specifications: {
      'Processor': 'Qualcomm Snapdragon 7 Gen 3 (4nm)',
      'RAM & Storage': '8GB LPDDR4X + 128GB UFS 3.1 (Expandable up to 1TB)',
      'Display': '6.7" 120Hz AMOLED, HDR10+, 2160Hz PWM Dimming',
      'Rear Camera': '50MP Sony LYT-600 with OIS + 8MP Ultra-wide',
      'Front Camera': '16MP Selfie Camera',
      'Battery & Charging': '5500 mAh with 100W SUPERVOOC Fast Charger included',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    tags: ['featured', 'latest'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-whirlpool-wash-7kg',
    name: 'Whirlpool 7.0 Kg 5-Star Royal Fully-Automatic Top Load Washing Machine',
    brand: 'Whirlpool',
    categoryId: 'washing-machines',
    originalPrice: 21500,
    price: 14790,
    discountPercentage: 31,
    shortDescription: 'Hard Water Wash, Spiro Wash Action, 12 Wash Programs & Zero Pressure Fill',
    description: 'Specifically engineered for Indian conditions, this 5-star washing machine adapts wash operations for hard water regions, ensuring 20% better cleaning while protecting fabric shine and colors. Features Express Wash for quick 30-minute cycles.',
    inStock: true,
    images: [
      '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg'
    ],
    specifications: {
      'Capacity': '7.0 Kg (Ideal for 3-4 member household)',
      'Energy Rating': '5 Star Best-in-class efficiency',
      'Motor Speed': '740 RPM Higher spin speed for faster drying',
      'Special Features': 'Hard Water Wash, Zero Pressure Fill, Aqua Store',
      'Wash Programs': '12 Dedicated programs (Normal, Heavy, Delicates, Express)',
      'Tub Material': 'Stainless Steel durable drum',
      'Warranty': '2 Years Comprehensive + 10 Years on Motor'
    },
    tags: ['bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-daikin-ac-15ton',
    name: 'Daikin 1.5 Ton 3-Star Inverter Split AC (Copper, PM 2.5 Filter)',
    brand: 'Daikin',
    categoryId: 'air-conditioners',
    originalPrice: 58400,
    price: 36990,
    discountPercentage: 37,
    shortDescription: 'Dew Clean Technology, Triple Display, 100% Copper Condenser, Cools at 52°C',
    description: 'Engineered by the world leader in air conditioning, Daikin Neo Inverter AC delivers rapid cooling even during peak 52°C summer heat in Rajasthan. 100% inner-grooved copper coils and PM 2.5 air purification keep your family cool and healthy.',
    inStock: true,
    images: [
      '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg'
    ],
    specifications: {
      'Capacity': '1.5 Ton (Ideal for rooms up to 150 sq ft)',
      'Energy Rating': '3 Star High Inverter Efficiency',
      'Condenser Coil': '100% Grooved Copper for superior heat transfer',
      'Air Filter': 'PM 2.5 Microparticle Filter & Titanium Apatite',
      'Cooling Capacity': '5000 Watts with Coanda Airflow',
      'Stabilizer': 'Built-in Stabilizer Free (130V to 285V)',
      'Warranty': '1 Year on Product + 5 Years on PCB + 10 Years on Compressor'
    },
    tags: ['featured', 'festival_offer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-boat-aavante-soundbar',
    name: 'boAt Aavante Bar 1800 120W 2.1 Channel Bluetooth Soundbar with Subwoofer',
    brand: 'boAt',
    categoryId: 'speakers',
    originalPrice: 19990,
    price: 6499,
    discountPercentage: 67,
    shortDescription: '120W RMS Signature Sound, Wired Subwoofer, Multiple EQ Modes & HDMI ARC',
    description: 'Transform your TV into a cinema theatre with 120 Watts of thumping bass and crystal-clear dialogue clarity. Features versatile input options including Bluetooth 5.0, HDMI (ARC), Optical, AUX, and USB.',
    inStock: true,
    images: [
      '/src/assets/images/banner_festival_sale_1793957325851.jpg'
    ],
    specifications: {
      'Power Output': '120 Watts RMS Total Peak Output',
      'Channel': '2.1 Channel with Dedicated Down-firing Subwoofer',
      'Connectivity': 'Bluetooth 5.0, HDMI (ARC), Optical, AUX, USB',
      'Audio Modes': 'Movie, Music, News & 3D Surround Sound EQ',
      'Remote Control': 'Master remote with bass and treble adjustments',
      'Warranty': '1 Year Official boAt India Replacement Warranty'
    },
    tags: ['bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-havells-mixer-750w',
    name: 'Havells Hexo 1000W Heavy Duty Mixer Grinder with 4 Stainless Steel Jars',
    brand: 'Havells',
    categoryId: 'home-appliances',
    originalPrice: 10495,
    price: 6290,
    discountPercentage: 40,
    shortDescription: '1000 Watt Pure Copper Motor, Ball Bearing System & 304 Grade Stainless Steel Jars',
    description: 'Built for tough traditional grinding like turmeric, masala paste, and idli batter with effortless 100% copper power. Features heavy-duty ergonomic handles and dual safety locks for hassle-free daily kitchen chores.',
    inStock: true,
    images: [
      '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg'
    ],
    specifications: {
      'Motor Power': '1000 Watt Heavy Duty Pure Copper Winding',
      'Jars Included': '4 Jars: 1.5L Liquidizer, 1.2L Wet Grinding, 1L Dry, 0.4L Chutney',
      'Blade Material': 'Food-Grade 304 Stainless Steel Precision Blades',
      'Speed Control': '3 Speed Rotary Dial with Pulse Function',
      'Safety': 'Overload Protector with Reset Switch',
      'Warranty': '2 Years on Product + 5 Years on Motor'
    },
    tags: ['latest'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-redmi-13c-5g',
    name: 'Redmi 13C 5G (4GB RAM, 128GB Storage, Starlight Silver)',
    brand: 'Xiaomi',
    categoryId: 'mobiles',
    originalPrice: 13999,
    price: 9499,
    discountPercentage: 32,
    shortDescription: 'MediaTek Dimensity 6100+ 5G, 50MP AI Dual Camera, 90Hz Display & 5000mAh Battery',
    description: 'The most affordable quality 5G smartphone for everyday family use. Smooth 90Hz Corning Gorilla Glass display, high-speed 5G network support on all Indian bands, and reliable all-day battery life.',
    inStock: true,
    images: [
      '/src/assets/images/banner_festival_sale_1793957325851.jpg'
    ],
    specifications: {
      'Network': 'True 5G Dual SIM Support (All Indian 5G Bands)',
      'Processor': 'MediaTek Dimensity 6100+ 6nm Octa-core',
      'RAM & Storage': '4GB RAM (Up to 8GB with Virtual RAM) + 128GB UFS Storage',
      'Display': '6.74" 90Hz HD+ with TÜV Low Blue Light Certification',
      'Battery': '5000 mAh with 18W Fast Charging support',
      'Security': 'Side Mounted Fast Fingerprint Scanner',
      'Warranty': '1 Year Brand Warranty'
    },
    tags: ['bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-bajaj-induction-cooktop',
    name: 'Bajaj Splendid 1900W Induction Cooktop with Preset Indian Cooking Menus',
    brand: 'Bajaj',
    categoryId: 'home-appliances',
    originalPrice: 4250,
    price: 2490,
    discountPercentage: 41,
    shortDescription: '1900W Fast Heating, 7 One-Touch Indian Menus, Auto Shut-off & Voltage Fluctuation Guard',
    description: 'Fast, flame-free, and energy-saving cooking ideal for milk boiling, roti, curry, and tea preparation. Features tactile push buttons built to withstand Indian kitchen oil and moisture.',
    inStock: true,
    images: [
      '/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg'
    ],
    specifications: {
      'Wattage': '1900 Watts Instant Heating',
      'Preset Menus': '7 Indian Menus (Boil Milk, Curry, Roti/Dosa, Tea, Fry, Idli, Keep Warm)',
      'Control Panel': 'Tactile Push Buttons with LED Display',
      'Safety Features': 'Auto Pan Detection & Overheat Cut-off',
      'Warranty': '1 Year Bajaj India Warranty'
    },
    tags: ['latest'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-sony-bravia-65',
    name: 'Sony Bravia 65-inch 4K Ultra HD Smart LED Google TV (KD-65X74L)',
    brand: 'Sony',
    categoryId: 'televisions',
    originalPrice: 119900,
    price: 74990,
    discountPercentage: 37,
    shortDescription: 'X1 4K Processor, Live Colour, Dolby Audio, Apple AirPlay & Google TV with Voice Remote',
    description: 'Unmatched Japanese picture quality with the legendary Sony X1 4K processor. Enhances standard definition satellite TV broadcasts into razor-sharp 4K. Features Motionflow XR 100 for blur-free cricket and action movies.',
    inStock: false,
    images: [
      '/src/assets/images/category_smart_tv_1793957324649.jpg'
    ],
    specifications: {
      'Screen Size': '65 Inches (164 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Processor': 'Sony X1 4K HDR Picture Processor',
      'Sound': '20W Open Baffle Speaker with Dolby Audio',
      'OS': 'Google TV with Play Store, Netflix, YouTube, Hotstar',
      'Voice Assistant': 'Google Assistant Built-in with Voice Remote',
      'Warranty': '1 Year Comprehensive Warranty by Sony India'
    },
    tags: ['featured'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-samsung-curd-fridge-253',
    name: 'Samsung 253L 3-Star Curd Maestro Inverter Frost-Free Refrigerator',
    brand: 'Samsung',
    categoryId: 'refrigerators',
    originalPrice: 35990,
    price: 24990,
    discountPercentage: 31,
    shortDescription: 'Curd Maestro makes fresh curd automatically, Digital Inverter with 20yr warranty',
    description: 'The world\'s first refrigerator that makes fresh, hygienic dahi (curd) in all seasons with exact consistency in 5 to 6 hours. Tough toughened glass shelves that hold up to 175 kg heavy utensils.',
    inStock: true,
    images: [
      '/src/assets/images/category_refrigerator_1793957326163.jpg'
    ],
    specifications: {
      'Capacity': '253 Litres Double Door',
      'Special Feature': 'Curd Maestro (Automatic Dahi Maker Kit)',
      'Energy Rating': '3 Star Digital Inverter Efficiency',
      'Deodorizer': 'Built-in Deodorizing Filter prevents odor transfer',
      'Shelves': 'Toughened Glass (Holds up to 175 kg)',
      'Compressor Warranty': '20 Years Digital Inverter Compressor Warranty',
      'Product Warranty': '1 Year Comprehensive'
    },
    tags: ['latest'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-boat-earbuds-141',
    name: 'boAt Airdopes 141 ANC Bluetooth Wireless Earbuds with 42H Playback',
    brand: 'boAt',
    categoryId: 'accessories',
    originalPrice: 5990,
    price: 1399,
    discountPercentage: 77,
    shortDescription: 'Active Noise Cancellation (up to 32dB), ENx Quad Mics, ASAP Charge & Beast Mode',
    description: 'Block out outside village noise with 32dB active noise cancellation. 4 microphones with ENx technology ensure crystal clear phone calls even while driving on motorcycles or in crowded bazaars.',
    inStock: true,
    images: [
      '/src/assets/images/banner_festival_sale_1793957325851.jpg'
    ],
    specifications: {
      'ANC': 'Up to 32dB Active Noise Cancellation',
      'Playtime': 'Up to 42 Hours total with compact charging case',
      'Fast Charge': 'ASAP Charge (10 mins charge = 150 mins playtime)',
      'Microphones': 'Quad Mics with ENx Voice Isolation',
      'Low Latency': '50ms BEAST Mode for real-time mobile gaming',
      'Water Resistance': 'IPX5 Sweat and Water Resistance',
      'Warranty': '1 Year Official boAt Warranty'
    },
    tags: ['bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialData: DatabaseSchema = {
  storeInfo: initialStoreInfo,
  categories: initialCategories,
  products: initialProducts,
  offers: initialOffers,
  admin: {
    pin: '1234'
  }
};
