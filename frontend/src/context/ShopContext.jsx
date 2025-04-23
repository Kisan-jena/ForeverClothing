/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "react-toastify";

export const ShopContext=createContext();


const ShopContextprovider=({children})=>{
    const currency="$";
    const delivery_fee=10;
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [search,setSearch]=useState('')
    const [showSearch,setShowSearch]=useState(true)
    const [cartItems,setCartitems]=useState({})
    const [products,setProducts]=useState([])
    const [token,setToken]=useState('')
    const navigate=useNavigate()

    const addToCart=async (itemId,size)=>{
        let cartData=structuredClone(cartItems)

        if (cartData[itemId]){
            if (cartData[itemId][size]){
                cartData[itemId][size]+=1
            }else{
                cartData[itemId][size]=1
            }
        }else{
            cartData[itemId]={}
            cartData[itemId][size]=1
        }
        setCartitems(cartData)
        console.log(cartData)
        

        // To store in db we have to call axios 
        if (token){
            console.log(token)
            try {
                await axios.post(backendUrl+'/api/cart/add',{itemId,size},{headers:{token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }   
        }

    }

    //^ OR by pure using backend
    // const addToCart=async (itemId,size)=>{
 
    //     if (token){
    //         console.log(token)
    //         try {
    //            const response=await axios.post(backendUrl+'/api/cart/add',{itemId,size},{headers:{token}})
    //             if (response.data.success){
    //                 setCartitems(response.data.cartData)
    //             }
    //         } catch (error) {
    //             console.log(error)
    //             toast.error(error.message)
    //         }   
    //     }

    // }

    const getCartCount=()=>{
        let totalCount=0
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalCount+=cartItems[items][item]
                    }
                }catch (error){
                    console.log(error)
                    toast.error("something happen")
                }
            }
        }
        return totalCount
    }

    const updateQuantity=async(itemId,size,quantity) => {
        const cartData=structuredClone(cartItems)
        
        cartData[itemId][size]=quantity
        setCartitems(cartData)

        if (token){
            console.log(token)
            try {
                await axios.post(backendUrl+'/api/cart/update',{itemId,size,quantity},{headers:{token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }   
        }
    }

    const getCartAmount=()=>{
        let totalAmount=0
        for (const items in cartItems){
            let itemInfo=products.find((product)=>product._id===items)
            for (const item in cartItems[items]){
                try {
                    if (cartItems[items][item]>0){
                        totalAmount=totalAmount+itemInfo.price*cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        return totalAmount
    }

    const getProductData=async()=>{
        try {
            const response=await axios.get(backendUrl+'/api/product/listProduct')
            if (response.data.success){
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message) 
            }
            
        } catch (error) {
            console.error( error);
            toast.error(error.message)     
        }
    }

    // After reloading the cart info comes from db
    const getUserCart=async(token)=>{
        try {
            const response =await axios.post(backendUrl+"/api/cart/get",{},{headers:{token}})
            if (response.data.success){
                setCartitems(response.data.cartData)
            }
        } catch (error) {
            console.error( error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductData()
    },[])

    // after reloading also the token will store
    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            console.log('token :',localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            
        }
        
        // const savedToken = localStorage.getItem('token');
        // if (!token && savedToken) {
        //     setToken(savedToken);
        // }
    },[])

    const value={
        updateQuantity,getCartCount,products,currency,
        delivery_fee,search,setSearch,showSearch,navigate,setCartitems,
        setShowSearch,cartItems,addToCart,getCartAmount,backendUrl,token,setToken
    }

    return (
        <ShopContext.Provider value={value} >
            {children}
        </ShopContext.Provider>
    )
}
export default ShopContextprovider

//^ same function using props instead of  Destructing
// const ShopContextprovider = (props) => {  
//     return (
//         <ShopContext.Provider value={{products,currency,delivery_fee}}>
//             {props.children}  
//         </ShopContext.Provider>
//     );
// };


// ^ Same function using normal function instead of arrow function
// function ShopContextProvider(props) {  
//     return (
//         <ShopContext.Provider value={{products,currency,delivery_fee}}>
//             {props.children}  
//         </ShopContext.Provider>
//     );
// }