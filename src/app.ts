import express from "express";
import { appDataSource } from "./config/database";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const port = 3003;
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server started successfully." });
});

appDataSource
  .initialize()
  .then(() => {
    console.log("connected");
    app.listen(port, () => {
      console.log(`server starting at port ${port}`);
    });
  })
  .catch((err) => console.log("err", err));
