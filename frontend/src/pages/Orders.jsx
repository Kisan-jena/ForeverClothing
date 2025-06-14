/* eslint-disable react-hooks/exhaustive-deps */
import 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext' 
import Title from '../components/Title' 
import axios from 'axios'
import { toast } from 'react-toastify'


const Orders = () => {

  const {backendUrl,token,currency}=useContext(ShopContext);

  const [orderData,setOrderData]=useState([])

  const loadOrdeData=async()=>{
    try {
      if(!token){
        return null
      }
      const response=await axios.post(backendUrl+'/api/order/userorders',{},{headers:{token}})
      console.log('response of order fetch from api')
      console.log(response.data)
      if(response.data.success){
        let allOrdersItem=[]
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status']=order.status
            item['payment']=order.payment
            item['paymentMethod']=order.paymentMethod
            item['date']=order.date
            allOrdersItem.push(item)
          })
        })
        console.log('allorder')
        console.log(allOrdersItem)
        setOrderData(allOrdersItem)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    loadOrdeData()
  },[token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl' >
        <Title text1={'MY '} text2={'ORDERS'} />
      </div>

      <div className='bg-sate-400' >
        {orderData.map((item,index)=>(
          <div key={index} className=' bg-ed-600 py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ' >
            
            <div className='flex items-start gap-6 text-sm' >
              <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
              <div>
                <p className='sm:text-base font-medium' >{item.name}</p>
                <div className=' bg-white flex items-center gap-3 mt-2 text-base text-gray-700' >
                  <p className='text-lg' >{currency} {item.price} </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className='mt-2' >Date: <span className='text-gray-700'> {new Date(item.date).toDateString()} </span></p>
                <p className='mt-2' >Payment: <span className='text-gray-700'> {item.paymentMethod} </span></p>
              </div>
            </div>

            <div className=' bg-sate-500 md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2' >
                <p className='min-w-2 h-2 rounded-full bg-green-500' ></p>
                <p className='text-s md:text-base' >{item.status}</p>
              </div>
              <button onClick={loadOrdeData} className='border px-4 py-2 text-sm font-medium rounded-sm' >Track Order</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Orders
