import { Column, Model, Table, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Category } from './category.model';

@Table
export class Product extends Model<Product> {
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  name: object;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  description: object;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  // Adding the new fields
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dimensions: string; // Eni x Bo'yi x Balandligi

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  cubicVolume: number; // Kubasi

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  bruttoWeight: number; // Brutto og'irligi

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  nettoWeight: number; // Netto og'irligi

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  minOrderQuantity: number; // Eng kam buyurtma miqdori

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  views: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salesCount: number;

  @HasMany(() => Comment)
  comments: Comment[];

  @BelongsTo(() => Category)
  category: Category;
}


