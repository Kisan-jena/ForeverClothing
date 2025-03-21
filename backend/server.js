import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

const app=express()
const port= process.env.PORT || 3000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('working')
})

app.listen(port,()=>console.log(`server started on ${port}`))