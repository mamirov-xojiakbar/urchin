import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Category } from './models/category.model';
import { Product } from './models/product.model';
import { User } from './models/user.model';
import { CartItem } from './models/cart-item.model';
import { Order } from './models/order.model'; 
import { OrderItem } from './models/ordersItem.model'; 
import { Comment } from './models/comment.model';

import { CategoriesService } from './services/categories.service';
import { ProductsService } from './services/products.service';
import { UsersService } from './services/users.service';
import { CartsService } from './services/carts.service';
import { OrdersService } from './services/order.service';
import { CommentsService } from './services/comments.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { CategoriesController } from './controllers/categories.controller';
import { ProductsController } from './controllers/products.controller';
import { UsersController } from './controllers/users.controller';
import { CartsController } from './controllers/carts.controller';
import { OrdersController } from './controllers/order.controller';
import { CommentsController } from './controllers/comments.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'abubakiir7',
      password: 'abubakiir7',
      database: 'uzchin',
      models: [
        Category,
        Product,
        User,
        CartItem,
        Order, // Add Order model to models array
        OrderItem, // Add OrderItem model to models array
        Comment,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([
      Category,
      Product,
      User,
      CartItem,
      Order,
      OrderItem,
      Comment,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    CategoriesService,
    ProductsService,
    UsersService,
    CartsService,
    OrdersService,
    CommentsService,
    JwtStrategy,
  ],
  controllers: [
    CategoriesController,
    ProductsController,
    UsersController,
    CartsController,
    OrdersController,
    CommentsController,
  ],
})
export class AppModule {}
