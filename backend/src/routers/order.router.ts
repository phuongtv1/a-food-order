import { HTTP_BAD_REQUEST } from "./../constants/http_status";
import asynceHandler from "express-async-handler";
import { Router } from "express";
import { isJSDocReturnTag } from "typescript";
import { OrderStatus } from "../constants/order_status";
import { OrderModel } from "../models/order.model";
import auth from "../middlewares/auth.mid";

const router = Router();
router.use(auth);

router.post(
  "/create",
  asynceHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart Is Empty");
      isJSDocReturnTag;
    }

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({
      ...requestOrder,
      user: req.user.id,
    });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  asynceHandler(async (req: any, res) => {
    // const order = await OrderModel.findOne({
    //     user: req.user.id,
    //     status: OrderStatus.NEW
    // })
    const order = await getNewOrderForCurrentUser(req);

    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
  })
);

router.post("/pay",
  asynceHandler(async (req: any, res) => {
    const {paymentId} = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if(!order){
        res.status(HTTP_BAD_REQUEST).send('Order Not Found');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
  })
);

router.get('/track/:id', asynceHandler(
  async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
  }
))

async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({ user: req.user.id, status: OrderStatus });
}
export default router;
