import { CategoriesService } from '../services/categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(name: Record<string, string>, parentId: number): Promise<import("../models/category.model").Category>;
    getCategories(language: any): Promise<any>;
}
