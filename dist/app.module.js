"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const category_model_1 = require("./models/category.model");
const product_model_1 = require("./models/product.model");
const user_model_1 = require("./models/user.model");
const cart_item_model_1 = require("./models/cart-item.model");
const order_model_1 = require("./models/order.model");
const ordersItem_model_1 = require("./models/ordersItem.model");
const comment_model_1 = require("./models/comment.model");
const categories_service_1 = require("./services/categories.service");
const products_service_1 = require("./services/products.service");
const users_service_1 = require("./services/users.service");
const carts_service_1 = require("./services/carts.service");
const order_service_1 = require("./services/order.service");
const comments_service_1 = require("./services/comments.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const categories_controller_1 = require("./controllers/categories.controller");
const products_controller_1 = require("./controllers/products.controller");
const users_controller_1 = require("./controllers/users.controller");
const carts_controller_1 = require("./controllers/carts.controller");
const order_controller_1 = require("./controllers/order.controller");
const comments_controller_1 = require("./controllers/comments.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'abubakiir7',
                password: 'abubakiir7',
                database: 'uzchin',
                models: [
                    category_model_1.Category,
                    product_model_1.Product,
                    user_model_1.User,
                    cart_item_model_1.CartItem,
                    order_model_1.Order,
                    ordersItem_model_1.OrderItem,
                    comment_model_1.Comment,
                ],
                autoLoadModels: true,
                synchronize: true,
            }),
            sequelize_1.SequelizeModule.forFeature([
                category_model_1.Category,
                product_model_1.Product,
                user_model_1.User,
                cart_item_model_1.CartItem,
                order_model_1.Order,
                ordersItem_model_1.OrderItem,
                comment_model_1.Comment,
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'your_jwt_secret',
                signOptions: { expiresIn: '60m' },
            }),
        ],
        providers: [
            categories_service_1.CategoriesService,
            products_service_1.ProductsService,
            users_service_1.UsersService,
            carts_service_1.CartsService,
            order_service_1.OrdersService,
            comments_service_1.CommentsService,
            jwt_strategy_1.JwtStrategy,
        ],
        controllers: [
            categories_controller_1.CategoriesController,
            products_controller_1.ProductsController,
            users_controller_1.UsersController,
            carts_controller_1.CartsController,
            order_controller_1.OrdersController,
            comments_controller_1.CommentsController,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map