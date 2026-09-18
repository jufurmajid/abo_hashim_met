import { Category, Product } from '@/types';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

export const CATEGORIES: Category[] = categoriesData as Category[];
export const SAMPLE_PRODUCTS: Product[] = productsData as Product[];
