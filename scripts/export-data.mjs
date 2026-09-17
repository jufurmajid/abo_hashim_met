import fs from 'fs';
import path from 'path';

const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'لحم غنم طازج (عراقي)',
    description: 'لحم خروف بلدي طازج مقطع حسب الطلب، خالي من الدهون الزائدة.',
    price: 18000,
    unit: 'كغم',
    category: 'meats',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop',
    stock: 25,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'لحم عجل بلدي',
    description: 'لحم عجل طري ممتاز مناسب للطبخ والكباب والشواء.',
    price: 16000,
    unit: 'كغم',
    category: 'meats',
    imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop',
    stock: 30,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'دجاج طازج مذبوح',
    description: 'دجاج بلدي طازج نظيف ومجهز يومياً بصحة جيدة.',
    price: 4500,
    unit: 'دجاجة (1.2 كغم)',
    category: 'meats',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop',
    stock: 50,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'حليب أبقار طبيعي طازج',
    description: 'حليب طبيعي 100% غير مبستر بدون أي ألوان أو مواد حافظة.',
    price: 2000,
    unit: 'لتر',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
    stock: 40,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'لبن خاثر بلدي',
    description: 'لبن خاثر طبيعي طازج ذو طعم غني وقوام ممتازة.',
    price: 2500,
    unit: 'علبة (1.5 كغم)',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    stock: 35,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'قشطة عربية عرب',
    description: 'قشطة بلية طازجة مصنوعة يومياً بحرفية عالية.',
    price: 6000,
    unit: 'كغم',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?q=80&w=800&auto=format&fit=crop',
    stock: 15,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'جبن عرب بلدي ممتاز',
    description: 'جبن أبيض طبيعي مصنوع من حليب الأبقار والأغنام الطازج.',
    price: 8000,
    unit: 'كغم',
    category: 'cheese',
    imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=800&auto=format&fit=crop',
    stock: 20,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'جبنة حلوم طازجة',
    description: 'جبنة حلوم قابلة للشواء والقلي بطعم ونكهة مميزة.',
    price: 9000,
    unit: 'كغم',
    category: 'cheese',
    imageUrl: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=800&auto=format&fit=crop',
    stock: 18,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'سمن بلدي خالص',
    description: 'سمن طبيعي فاخر 100% بنكهة أصلية ورائحة ممتازة.',
    price: 15000,
    unit: 'علبة (1 كغم)',
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop',
    stock: 12,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'زبدة بلدية طازجة',
    description: 'زبدة مصنوعة من حليب طبيعي خالٍ من الإضافات الاصطناعية.',
    price: 7500,
    unit: '500 غم',
    category: 'dairy',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop',
    stock: 22,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const backupData = {
  version: '1.0.0',
  exportedAt: new Date().toISOString(),
  products: SAMPLE_PRODUCTS,
  orders: [],
};

const distDir = path.join(process.cwd(), 'backups');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Export JSON
fs.writeFileSync(
  path.join(distDir, 'backup.json'),
  JSON.stringify(backupData, null, 2),
  'utf-8'
);

// Export SQL
let sql = `-- Backup Dump generated at ${backupData.exportedAt}\n\n`;
sql += `-- Products Table\n`;
for (const p of SAMPLE_PRODUCTS) {
  sql += `INSERT INTO products (id, name, description, price, unit, category, image_url, stock, is_available, created_at, updated_at) VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.description.replace(/'/g, "''")}', ${p.price}, '${p.unit}', '${p.category}', '${p.imageUrl}', ${p.stock}, ${p.isAvailable ? 1 : 0}, '${p.createdAt}', '${p.updatedAt}');\n`;
}

fs.writeFileSync(path.join(distDir, 'backup.sql'), sql, 'utf-8');

console.log('✅ Export complete! Backup files created in ./backups/ (backup.json, backup.sql)');
