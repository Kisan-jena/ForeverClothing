import { z } from "zod";
import userModel from "../models/userModels.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const createToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//* Routes for user Login or SignIn
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email})
        if (!user){
            return res.status(404).json({success:false,message:"User does not exist"})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if (isPasswordValid) {      
            const token = createToken(user._id)
            res.status(200).json({
                success:true,
                message: "Login successful",
                token,
            });
        } else {
            res.status(403).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error during signin", error: error.message });
    }
}

//* routes for user register or SignUp
const registerUser=async(req,res)=>{

    const {name,email,password}=req.body
    try {
        const exists=await userModel.findOne({email})
        if (exists) {
            return res.json({success:false,message:"User already exist"})
        }

        //* Validation by using validator.js 
        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false,message:"Enter valid email"})
        }
        if (password.length<8) {
            return res.status(400).json({success:false,message:"please enter a strong password"})
        }

        //^ OR Validation using ZOD , It is good then above!!!!!!!!
        // const requiredBody = z.object({
        //     name: z.string().min(3).max(100),
        //     email: z.string().min(3).max(100).email(),
        //     password: z.string().min(3).max(30),
        //   });
        
        //   const parsedDataWithSuccess = requiredBody.safeParse(req.body);
        //   console.log(parsedDataWithSuccess)
    
        //   if (!parsedDataWithSuccess.success) {
        //     return res.status(400).json({
        //       message: "Incorrect format",
        //       error:parsedDataWithSuccess.error
        //     });
        //   }

        //* HASHING USER PASSWORD
        const hashedPassword=await bcrypt.hash(password,10)

        //^ OR
        // const salt=await bcrypt.genSalt(10)
        // const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new userModel({
            name,email,password:hashedPassword
        })
        const user=await newUser.save()
        const token=createToken((user._id))
        res.status(201).json({
            success:true,
            message: "SignUp || Register successful",
            token,
          });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error during SignUp || register", error: error.message });
    }
}


//* Routes for Admin login
const loginAdmin=async(req,res)=>{
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error during process", error: error.message });
    }
}

export {loginUser,registerUser,loginAdmin}
//^ OR if u used below then go to userRouter and use //commented code 
//export default {loginUser,registerUser,loginAdmin}