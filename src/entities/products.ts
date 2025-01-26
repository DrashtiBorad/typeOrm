import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm";
import { Categories } from "./categories";
import "reflect-metadata";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  is_featured_product: boolean;

  @Column()
  is_top_categories: boolean;

  @ManyToOne(
    (type) => Categories,
    (our_productType_categoriesId) =>
      our_productType_categoriesId.categories_name
  )
  @JoinColumn({ name: "our_productType_categoriesId" })
  our_productType_categoriesId: Categories;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
