import express from "express";
import { appDataSource } from "./config/database";
import { router } from "./routes";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
dotenv.config();

const port = 3003;

appDataSource
  .initialize()
  .then(() => {
    console.log("connected");
    app.listen(port, () => {
      console.log(`server starting at port ${port}`);
    });
  })
  .catch((err) => console.log("err", err));
