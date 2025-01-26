import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Product } from "./products";

@Entity()
export class ProductCart {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  quantity: number;

  @ManyToOne((type) => User, (user) => user.id)
  @JoinColumn({ name: "userid" })
  userid: User;

  @ManyToOne((type) => Product, (product) => product.id)
  @JoinColumn({ name: "productid" })
  productid: Product;
}
