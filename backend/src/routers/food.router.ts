import { FoodModel } from "./../models/food.model";
import { Router } from "express";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { sample_foods, sample_tags, sample_users } from "../data";
import asynceHandler from "express-async-handler";

const router = Router();

router.use(express.json());
router.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

router.get(
  "/seed",
  asynceHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await FoodModel.create(sample_foods);
    res.send("Seed is Done!");
  })
);

router.get("/", async (req, res) => {
  const foods = await FoodModel.find();
  res.send(sample_foods);
});

router.get(
  "/search/:searchTerm",
  asynceHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asynceHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };
    tags.unshift(all);
    res.send(tags);
  })
);

router.get("/tag/:tagName",
  asynceHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get("/:foodId", asynceHandler( 
  async (req, res) => {
  const food = await FoodModel.findById(req.params.foodId)
  res.send(food);
}));

export default router;
