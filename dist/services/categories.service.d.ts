import { Category } from '../models/category.model';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: typeof Category);
    create(name: Record<string, string>, parentId?: number): Promise<Category>;
    getCategories(language: string): Promise<any>;
    private getCategoriesForCategory;
}
