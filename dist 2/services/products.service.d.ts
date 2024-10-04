import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartItem } from '../models/cart-item.model';
import { User } from '../models/user.model';
export declare class ProductsService {
    private productModel;
    private categoryModel;
    private readonly cartItemModel;
    private readonly userModel;
    constructor(productModel: typeof Product, categoryModel: typeof Category, cartItemModel: typeof CartItem, userModel: typeof User);
    create(name: object, description: object, price: number, categoryId: number): Promise<Product>;
    findByCategory(categoryId: number, language: string): Promise<{
        category: Category;
        products: any[];
    }>;
    findBestSellers(limit: number, language: string): Promise<any[]>;
}
