import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { CartItem } from './cart-item.model';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column
  password: string;

  @Column
  language: string;

  @Column({
    defaultValue: 'user',
  })
  role: string;

  @HasMany(() => CartItem)
  cartItems: CartItem[];
}
