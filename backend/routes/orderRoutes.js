import express from "express"

import {verifyStripe,placeOrder,updateStatus,userOrders,allOrders,placeOrderRazorpay,placeOrderStripe} from '../controllers/orderController.js'
import adminAuth from "../middlewares/adminAuth.js"
import authUser from "../middlewares/auth.js"

const orderRouter=express.Router()

orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

orderRouter.post('/placeorder',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

orderRouter.post('/userorders',authUser,userOrders)

// Veriy stripe
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter