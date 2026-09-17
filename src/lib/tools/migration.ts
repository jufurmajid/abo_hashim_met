import { Product, Order } from '@/types';
import { IProductRepository, IOrderRepository } from '@/lib/data/interfaces';

export interface ExportData {
  version: string;
  exportedAt: string;
  products: Product[];
  orders: Order[];
}

export class MigrationUtility {
  static async exportData(
    productRepo: IProductRepository,
    orderRepo: IOrderRepository
  ): Promise<ExportData> {
    const products = await productRepo.getAllProducts();
    const orders = await orderRepo.getAllOrders();

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      products,
      orders,
    };
  }

  static generateSQLDump(data: ExportData): string {
    let sql = `-- Backup Dump generated at ${data.exportedAt}\n\n`;

    // Products table SQL
    sql += `-- Products Table\n`;
    for (const p of data.products) {
      sql += `INSERT INTO products (id, name, description, price, unit, category, image_url, stock, is_available, created_at, updated_at) VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.description.replace(/'/g, "''")}', ${p.price}, '${p.unit}', '${p.category}', '${p.imageUrl}', ${p.stock}, ${p.isAvailable ? 1 : 0}, '${p.createdAt}', '${p.updatedAt}');\n`;
    }

    sql += `\n-- Orders Table\n`;
    for (const o of data.orders) {
      sql += `INSERT INTO orders (id, customer_name, phone, governorate, area, address, landmark, notes, total, status, created_at, updated_at) VALUES ('${o.id}', '${o.customerName.replace(/'/g, "''")}', '${o.phone}', '${o.governorate}', '${o.area.replace(/'/g, "''")}', '${o.address.replace(/'/g, "''")}', '${o.landmark.replace(/'/g, "''")}', '${(o.notes || '').replace(/'/g, "''")}', ${o.total}, '${o.status}', '${o.createdAt}', '${o.updatedAt}');\n`;
    }

    return sql;
  }
}
