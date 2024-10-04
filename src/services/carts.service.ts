import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(CartItem) private cartItemModel: typeof CartItem,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async add(
    userId: number,
    products: { productId: number; quantity: number }[],
  ) {
    const result = [];

    for (const product of products) {
      const { productId, quantity } = product;
      let cartItem = await this.cartItemModel.findOne({
        where: { userId, productId },
      });
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await this.cartItemModel.create({
          userId,
          productId,
          quantity,
        });
      }

      result.push(cartItem);
    }

    return result;
  }

  find(userId: number) {
    return this.cartItemModel.findAll({
      where: { userId },
      include: [Product],
    });
  }

  async remove(userId: number, productId: number) {
    const cartItem = await this.cartItemModel.findOne({
      where: { userId, productId },
    });
    if (cartItem) {
      await cartItem.destroy();
    }
  }
}
