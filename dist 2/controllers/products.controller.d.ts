import { ProductsService } from '../services/products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: {
        name: object;
        description: object;
        price: number;
        categoryId: number;
    }): Promise<import("../models/product.model").Product>;
    findByCategory(id: number, lang: string): Promise<{
        category: import("../models/category.model").Category;
        products: any[];
    }>;
    findBestSellers(limit: string, lang: string): Promise<any[]>;
}
