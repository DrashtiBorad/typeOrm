import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Product } from "./products";

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userid" })
  userid: User;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productid" })
  productid: Product;
}
