
import { IApiResponse } from '../types';

interface BarcodeProduct {
  code: string;
  product_name: string;
  brands: string;
  quantity: string;
  nutriments: {
    energy_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
  };
  image_url?: string;
  categories?: string;
}

export class BarcodeService {
  private baseUrl = 'https://world.openfoodfacts.org/api/v0';

  async searchByBarcode(barcode: string): Promise<IApiResponse<BarcodeProduct>> {
    try {
      const response = await fetch(`${this.baseUrl}/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        return {
          success: true,
          data: {
            code: data.product.code,
            product_name: data.product.product_name || 'Unknown Product',
            brands: data.product.brands || '',
            quantity: data.product.quantity || '',
            nutriments: data.product.nutriments || {},
            image_url: data.product.image_url,
            categories: data.product.categories
          }
        };
      } else {
        return {
          success: false,
          error: 'Product not found'
        };
      }
    } catch (error) {
      console.error('Barcode search error:', error);
      return {
        success: false,
        error: 'Failed to search product by barcode'
      };
    }
  }

  async searchProducts(query: string): Promise<IApiResponse<{ products: BarcodeProduct[] }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`
      );
      const data = await response.json();

      if (data.products) {
        return {
          success: true,
          data: {
            products: data.products.map((product: any) => ({
              code: product.code,
              product_name: product.product_name || 'Unknown Product',
              brands: product.brands || '',
              quantity: product.quantity || '',
              nutriments: product.nutriments || {},
              image_url: product.image_url,
              categories: product.categories
            }))
          }
        };
      } else {
        return {
          success: false,
          error: 'No products found'
        };
      }
    } catch (error) {
      console.error('Product search error:', error);
      return {
        success: false,
        error: 'Failed to search products'
      };
    }
  }
}

export const barcodeService = new BarcodeService();
