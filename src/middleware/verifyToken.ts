import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const jwtPrivateKey = process.env.JSON_KEY;

export const verifyToken = (req: any, res: any, next: any) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, jwtPrivateKey as string, (error: any, valid: any) => {
      if (error) {
        res.status(400).json({ error: error });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ error: "Enter Json WebToken" });
  }
};
