import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'
// Function for add product
const addProduct = async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller}=req.body
        const image1=  req.files?.image1?.[0] || "" //^ In this the empty string will store
        const image2=  req.files.image2 && req.files.image2[0] //^ In this it will show undefined
        const image3=  req.files.image3 ? req.files.image3[0] : ""; //^ In this the empty string will store
        const image4=  req.files.image4 && req.files.image4[0] 
        
        //^ Or
        // const image1 = req.files?.image1?.[0]?.path || "";
        // const image2 = req.files?.image2?.[0]?.path || "";
        // const image3 = req.files?.image3?.[0]?.path || "";
        // const image4 = req.files?.image4?.[0]?.path || "";
        // const images1 = [image1, image2, image3, image4].filter(img => img);
        // const images2 = [image1, image2, image3, image4].filter(Boolean);

        const images=[image1,image2,image3,image4].filter((item)=>item !==undefined && item!=="")

        let imageURl = await Promise.all( // Promise.all([...]) waits for all these promises to resolve before proceeding ,This ensures that imageURl holds the array of resolved upload results.
              images.map(async(item)=>{
                let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
              })
        )
        
        // ^ OR , but below is slow 
        // let imageURl = [];
        // for (let item of images) {
        //     let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        //     imageURl.push(result);
        // }

        //^ for passing the data in req.body we are using form-data instead of json due to image files, so form-data have either two text or files so we have to convert string to int and boolean
        const productData={
            name,
            description,
            price:Number(price),
            category,
            subCategory,
            sizes:JSON.parse(sizes),//^ JSON.parse() converts the JSON string back to its original data type,i.e to number,boolean,array,object,null
            bestseller:bestseller==='true'?true:false,
            image:imageURl,
            date:Date.now()
        }

        console.log(productData)

        const product= new productModel(productData)
        await product.save()

        res.status(201).json({ success: true, message: "Product added successfully", product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false,message: "Error during add product", error: error.message });
    }
}

// Function for List all product

const listProduct=async(req,res)=>{
    
}

// Function for remove product

const removeProduct=async(req,res)=>{
    
}

// Function for single product info

const singleProduct=async(req,res)=>{
    
}

export {addProduct,listProduct,removeProduct,singleProduct}