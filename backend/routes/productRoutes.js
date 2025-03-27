import express, { Router } from 'express'
import {addProduct,listProduct,removeProduct,singleProduct} from '../controllers/productController.js'
import upload from '../middlewares/uploadMiddleware.js'

const router=express.Router
const productRouter = router()
// const productRouter = express.Router()

const uploadMultipleFields = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);

productRouter.post('/add',uploadMultipleFields,addProduct)
productRouter.post('/remove',removeProduct)
productRouter.post('/singleProduct',singleProduct)
productRouter.get('/listProduct',listProduct)

export default productRouter