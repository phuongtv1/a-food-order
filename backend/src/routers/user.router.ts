import { User, UserModel } from "./../models/user.model";
import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import asynceHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

const router = Router();
router.post(
  "/login",
  asynceHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      res.send(generateTokenResponse);
    } else {
      res.status(HTTP_BAD_REQUEST).send("Email or Password is not valid!");
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

router.post('/register', asynceHandler(
  async (req, res) => {
    const {name, email, password, address} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
      res.status(HTTP_BAD_REQUEST)
      .send('User is already exist, please login!')
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser:User = {
      id: '',
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  }
))
const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
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
