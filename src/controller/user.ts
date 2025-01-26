import { appDataSource } from "../config/database";
import { User } from "../entities/user";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";

const userDataSource = appDataSource.getRepository(User);
const jwtPrivateKey = process.env.JSON_KEY;
const otpStore = new Map();

export const registration = async (req: any, res: any) => {
  const { name, email, password, confirmPassword, role } = req.body;

  try {
    const user = await userDataSource
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();
    if (user) {
      res.status(400).json({ error: "Email is already registered." });
    } else if (password !== confirmPassword) {
      res
        .status(400)
        .json({ error: "Password and ConfirmPassword do not match." });
    } else {
      const result = await userDataSource
        .createQueryBuilder()
        .insert()
        .values({
          name,
          email,
          password,
          role,
        })
        .execute();
      jwt.sign(
        { result },
        jwtPrivateKey as string,
        { expiresIn: "1h" },
        (error, token) => {
          if (token) {
            res.status(200).json({ result, auth: token });
          } else if (error) {
            console.log("error in jwt token", error);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logIn = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const result = await userDataSource
      .createQueryBuilder("user")
      .where("user.email = :email AND user.password = :password", {
        email,
        password,
      })
      .getOne();
    if (result) {
      jwt.sign(
        { result },
        jwtPrivateKey as string,
        { expiresIn: "1h" },
        (error, token) => {
          if (token) {
            res.status(200).json({ result, auth: token });
          } else if (error) {
            console.log("error in jwt token", error);
          }
        }
      );
    } else {
      res.status(400).json({ error: "Please Enter valid Email and password" });
    }
  } catch (err) {
    res.send(400).json({ error: err });
  }
};

export const sendOtp = async (req: any, res: any) => {
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const expireAt = Date.now() + 5 * 60 * 1000;

  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_USER_EMAIL,
        pass: process.env.AUTH_USER_PASSWORD,
      },
    });

    const info = transporter.sendMail({
      from: process.env.AUTH_USER_EMAIL,
      to: email,
      subject: "send mail",
      html: `OTP is ${otpCode}`,
    });

    console.log("expireAt", expireAt);
    otpStore.set(email, { otpCode, expireAt });
    res.status(200).json(info);
  } catch (err) {
    res.send(400).json("Failed to send mail");
  }
};

export const otpVerify = (req: any, res: any) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    res.status(400).json({ error: "OTP not found or expired" });
  }
  if (Date.now() > storedOtp.expireAt) {
    otpStore.delete(email);
    res.status(400).json({ error: "OTP expired" });
  }
  if (otp === storedOtp.otpCode) {
    const token = jwt.sign({ email }, jwtPrivateKey as string, {
      expiresIn: "1h",
    });
    otpStore.delete(email);
    res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } else {
    res.status(500).json({ eror: "Invalid OTP." });
  }
};

export const resetPassword = async (req: any, res: any) => {
  const { password, confirmPassword } = req.body;
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ error: "Authorization header is missing" });
  }
  const extractedToken = token?.split(" ")[1];
  try {
    const decoded = jwt.verify(
      extractedToken as string,
      jwtPrivateKey as string
    );
    const { email }: any = decoded;
    console.log("decoded", email);
    if (password === confirmPassword) {
      const result = await userDataSource
        .createQueryBuilder()
        .update(User)
        .set({ password })
        .where("email =:email", { email: email })
        .execute();
      res.status(200).json(result);
    } else {
      res
        .status(500)
        .json({ error: "Password and ConfirmPassword is not match." });
    }
  } catch (error) {}
};
