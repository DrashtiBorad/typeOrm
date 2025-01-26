import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categories_name: string;
}
