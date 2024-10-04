import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Product } from './product.model';
import { User } from './user.model';

@Table
export class Comment extends Model {
  @Column
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  grade: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
