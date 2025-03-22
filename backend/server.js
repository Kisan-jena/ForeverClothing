import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'

//App config
const app=express()
const port= process.env.PORT || 3000
connectDB()
connectCloudinary()

//miidlewares
app.use(express.json())
app.use(cors())

//API Emdpoints
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('working')
})

app.listen(port,()=>console.log(`server started on ${port}`))