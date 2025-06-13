import 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const {navigate,backendUrl,token,cartItems,setCartitems,getCartAmount,delivery_fee,products}=useContext(ShopContext)
  const [method,setMethod]=useState('cod')

  const [formData,setFormData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:"",
  })

  const onChangeHandler=async(e)=>{
    const name=e.target.name
    const value=e.target.value

    setFormData(data=>({
      ...data,
      [name]:value   // dynamically updates that field , that why we used name atttributes in inputs field
    }))
  }

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    try {
      let orderItems=[]

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo=structuredClone(products.find(product=>product._id===items))
            if(itemInfo){
              itemInfo.size=item
              itemInfo.quantity=cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      console.log('orderItems:')
      console.log(orderItems)
      
      let orderData={
        address:formData,
        items:orderItems,
        amount:getCartAmount()+delivery_fee
      }

      console.log('orderData')
      console.log(orderData)

      switch(method){
        // api calls for cod
        case 'cod': {
          const response=await axios.post(backendUrl+'/api/order/placeorder',orderData,{headers:{token}});
          console.log('responseData')
          console.log(response.data)
          if(response.data.success){
            setCartitems({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;
        }

        case 'stripe': {
          const responseStripe=await axios.post(backendUrl+'/api/order/stripe',orderData,{headers:{token}});
          if (responseStripe.data.success){
            const {session_url}=responseStripe.data
            window.location.replace(session_url)
          }else{
            toast.error(responseStripe.data.message)
          }
          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className=' bg-slae-500 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t' >
      
      {/* Left side */}
      <div className=' bg-slae-50 flex flex-col gap-4 w-full sm:max-w-[480px] ' >
        <div className='text-xl sm:text-2xl my-3' >
          <Title text1={"DELIVERY "} text2={"INFORMATION"}/>
        </div>
        <div className=' bg-yelow-300 flex gap-3' >
          <input onChange={onChangeHandler} value={formData.firstName} name='firstName' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' type="text" required />
          <input onChange={onChangeHandler} value={formData.lastName} name='lastName' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' type="text"  required />
        </div>
        <input onChange={onChangeHandler} value={formData.email} name='email' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Email Address' type="email"  required />
        <input onChange={onChangeHandler} value={formData.street} name='street' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' type="text"  required />
        <div className=' bg-yelow-300 flex gap-3' >
          <input onChange={onChangeHandler} value={formData.city} name='city' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='City' type="text"  required />
          <input onChange={onChangeHandler} value={formData.state} name='state' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='State' type="text"  required />
        </div>
        <div className=' bg-yelow-300 flex gap-3' >
          <input onChange={onChangeHandler} value={formData.zipcode} name='zipcode' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Zip code' type="number"  required />
          <input onChange={onChangeHandler} value={formData.country} name='country' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' type="text"  required />
        </div>
        <div className=' bg-yelow-300 flex gap-3' >
          <input onChange={onChangeHandler} value={formData.phone} name='phone' className='border border-gay-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone 91+' type="number"  required />
        </div>
      </div>

      {/* right side */}
      <div className=' bg-slae-400 mt-8' >

        <div className='mt-8 min-w-80 bg-rd-400'>
          <CartTotal/>
        </div>

        <div className='mt-12' >
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* pay methods area */}
          <div className='flex gap-3 flex-col xl:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer' >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''} `} ></p>
              <img className='h-5 mx-4 ' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer' >
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === 'razorpay' ? 'bg-green-400' : ''} `} ></p>
              <img className='h-5 mx-4 ' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer' >
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
              <p className='text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8' >
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm' >PLACE ORDER</button>
          </div>
        </div>

      </div>
    </form>
  )
}

export default PlaceOrder
