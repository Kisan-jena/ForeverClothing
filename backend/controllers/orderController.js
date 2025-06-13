import { appendFileSync } from "fs"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModels.js"
import Stripe from 'stripe'

// global variables
const currency='usd'
const deliveryCharges=10

// Gatewat initialize
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder=async(req,res)=>{
    try {
        const {userId,items,amount,address}=req.body
        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod:'COD',
            payment:false,
            date:Date.now()
        }

        const newOrder=new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true,Message:"order placed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const placeOrderStripe=async(req,res)=>{
    try {

        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;

        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod:'Stripe',
            payment:false,
            date:Date.now()
        }

        const newOrder=new orderModel(orderData)
        await newOrder.save()

        
        const line_items=items.map((item)=>({
            price_data:{
                currency:currency,
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:'Delivery Charges'
                },
                unit_amount:deliveryCharges*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        })
        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//^ Verify stripe payment (RIGHT WAY IS USING WEB HOOKS) 
const verifyStripe = async(req,res)=>{
    const {orderId,success,userId}=req.body
    console.log("Verify stripe payment request:", { orderId, success, userId })
    
    try {
        // Import mongoose for proper ObjectId conversion
        const mongoose = await import('mongoose')
        
        if (success==='true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }else{
            // Try both methods to delete the order
            console.log("Attempting to delete order:", orderId)
            
            // Method 1: Using findByIdAndDelete
            const result1 = await orderModel.findByIdAndDelete(orderId)
            console.log("findByIdAndDelete result:", result1)
            
            // Method 2: Using deleteOne with direct MongoDB query
            const result2 = await orderModel.deleteOne({_id: orderId})
            console.log("deleteOne result:", result2)
            
            res.json({success:false})
        }

    } catch (error) {
        console.log("Error in verifyStripe:", error)
        res.json({success:false,message:error.message})
    }
}

const placeOrderRazorpay=async(req,res)=>{
    
}

const allOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const userOrders=async(req,res)=>{
    try {
        const {userId}=req.body
        const orders=await orderModel.find({userId})
        console.log('backendorder')
        console.log(orders)
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const updateStatus=async(req,res)=>{
    try {
        const{orderId,status}=req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:'status updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyStripe,placeOrder,updateStatus,userOrders,allOrders,placeOrderRazorpay,placeOrderStripe}