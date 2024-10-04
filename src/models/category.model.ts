import {
  Column,
  Model,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Product } from './product.model';

@Table
export class Category extends Model {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: Record<string, string>;

  @ForeignKey(() => Category)
  @Column
  parentId: number;

  @BelongsTo(() => Category, { foreignKey: 'parentId', targetKey: 'id' })
  parent: Category;

  @HasMany(() => Category, { foreignKey: 'parentId', sourceKey: 'id' })
  subcategories: Category[];

  @HasMany(() => Product)
  products: Product[];
}
