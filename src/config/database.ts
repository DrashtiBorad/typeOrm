import { DataSource } from "typeorm";
import env from "dotenv";
env.config();

export const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  entities: ["src/entities/*.ts"],
  synchronize: true,
  logging: true,
});
