import express from 'express'
import {loginUser,registerUser,loginAdmin} from  '../controllers/userController.js'
// oR
//import userController from '../controllers/userController.js'


const Router=express.Router;
const userRouter=Router(); // Or const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',loginAdmin)

//OR 
// userRouter.post('/register',userController.registerUser)
// userRouter.post('/login',userController.loginUser)
// userRouter.post('/admin',userController.loginAdmin)

export default userRouter
