import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import backendUrl from '../../../admin/src/config'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const {navigate,token,setCartitems}=useContext(ShopContext)
    const [searchParams,setSearchParams]=useSearchParams()
    
    const success=searchParams.get('success')
    const orderId=searchParams.get('orderId')
      const verifyPayment=async()=>{
        try {
            if (!token){
                toast.error("Authentication required")
                navigate('/login')
                return null
            }
            
            console.log("Verification parameters:", { success, orderId, token: !!token })
            
            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId },
                { headers: { token } }
            )
            
            console.log('Verification response:', response.data)

            if (response.data.success){
                toast.success("Payment successful!")
                setCartitems({})
                navigate('/orders')
            } else {
                toast.info("Payment was canceled")
                navigate('/cart')
            }

        } catch (error) {
            console.log("Verification error:", error)
            
            // More detailed error information
            if (error.response) {
                console.log("Response error data:", error.response.data)
                console.log("Response error status:", error.response.status)
                toast.error(error.response.data.message || "Verification failed")
            } else {
                toast.error(error.message || "Network error")
            }
            
            navigate('/cart')
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[token])

  return (
    <div>
    </div>
  )
}

export default Verify
