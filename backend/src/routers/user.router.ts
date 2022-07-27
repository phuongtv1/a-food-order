import { UserModel } from "./../models/user.model";
import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
const router = Router();
import asynceHandler from "express-async-handler";

router.post(
  "/login",
  asynceHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      res.send(generateTokenResponse);
    } else {
      const BAD_REQUEST = 400;
      res.status(BAD_REQUEST).send("Email or Password is not valid!");
    }
  })
);

router.get(
  "/seed",
  asynceHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("User is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("User is Done!");
  })
);

const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "SomeRandomText",
    {
      expiresIn: "30d",
    }
  );
  user.token = token;
  return user;
};

export default router;
