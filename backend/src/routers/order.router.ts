import { HTTP_BAD_REQUEST } from './../constants/http_status';
import asynceHandler from 'express-async-handler';
import { Router } from 'express';
import { isJSDocReturnTag } from 'typescript';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid'

const router = Router();
router.use(auth);

router.post('/create',
asynceHandler(
    async (req:any, res:any) => {
        const requestOrder = req.body;

        if(requestOrder.items.length <= 0) {
            res.status(HTTP_BAD_REQUEST).send('Cart Is Empty');
            isJSDocReturnTag
        }

        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW
        })

        const newOrder = new OrderModel({
            ...requestOrder,
            user: req.user.id
        });
        await newOrder.save();
        res.send(newOrder);
    }
))

export default router;