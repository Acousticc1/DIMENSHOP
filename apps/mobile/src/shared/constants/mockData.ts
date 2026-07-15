export interface ProductMock {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  category: string;
  categoryId: string;
  imageUrl: string;
  images: string[];
  has3dModel: boolean;
  modelUrl: string | null;
  stockQuantity: number;
}

export const MOCK_PRODUCTS: ProductMock[] = [
  {
    id: 'prod-1',
    title: 'Quantum Runner 3D',
    price: 189.00,
    compareAtPrice: 240.00,
    category: 'Footwear',
    categoryId: '22222222-2222-2222-2222-222222222222',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600'
    ],
    has3dModel: true,
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Safe public glb model for testing R3F viewer
    description: 'Designed for the future. The Quantum Runner features a 3D-mesh weave that adapts dynamically to your foot shape. Integrated carbon fiber stride plate propels you forward while triple-density foam absorbs high impact.',
    stockQuantity: 15,
  },
  {
    id: 'prod-2',
    title: 'Voxel Gaming Chair',
    price: 349.99,
    compareAtPrice: null,
    category: 'Furniture',
    categoryId: '11111111-1111-1111-1111-111111111111',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600',
      'https://images.unsplash.com/photo-1688362809005-e1d27bfbc2b6?q=80&w=600'
    ],
    has3dModel: true,
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Ergonomic precision meets futuristic comfort. Fully adjustable lumber support grid, breathable memory mesh, and 4D armrests. Heavy-duty aluminum frame handles long sessions easily.',
    stockQuantity: 8,
  },
  {
    id: 'prod-3',
    title: 'AeroPro Headphones',
    price: 299.00,
    compareAtPrice: 349.00,
    category: 'Electronics',
    categoryId: '33333333-3333-3333-3333-333333333333',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600'
    ],
    has3dModel: true,
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Acoustic perfection. Smart ANC (Active Noise Cancellation) blocks background hums while custom drivers provide rich bass, crisp midranges, and clear highs. Up to 40 hours of playtime.',
    stockQuantity: 25,
  },
  {
    id: 'prod-4',
    title: 'Nebula Desk Lamp',
    price: 79.50,
    compareAtPrice: 95.00,
    category: 'Home Decor',
    categoryId: '44444444-4444-4444-4444-444444444444',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600'
    ],
    has3dModel: true,
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'Smart ambient lighting system. Set custom glow colors or sync with computer music. Sleek sandblasted aluminum finish with flexible neck design.',
    stockQuantity: 12,
  },
  {
    id: 'prod-5',
    title: 'Tactical Backpack',
    price: 120.00,
    compareAtPrice: null,
    category: 'Bags & Accessories',
    categoryId: '55555555-5555-5555-5555-555555555555',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600'
    ],
    has3dModel: false,
    modelUrl: null,
    description: 'Ballistic nylon build, splashproof zippers, and modular molle loops. Padded sleeve protects up to 16 inch laptops while integrated hidden pockets store documents securely.',
    stockQuantity: 30,
  }
];

export const MOCK_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: '11111111-1111-1111-1111-111111111111', name: 'Furniture' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Footwear' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Electronics' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Home Decor' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Bags' }
];
