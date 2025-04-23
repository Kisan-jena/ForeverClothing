/* eslint-disable react-hooks/exhaustive-deps */
import 'react'
import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios' 
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  
  const [currentState,setCurrrentState]=useState('Login')
  const navigate = useNavigate();
  const {token,setToken,backendUrl}=useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    try {
      if (currentState==='Sign Up') {
        const response=await axios.post(backendUrl+'/api/user/register',{name,email,password})
        console.log(response)
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
          toast.success(response.message)
        } else{
          toast.error(response.data.message)
        }
      } else {
        const response=await axios.post(backendUrl+'/api/user/login',{email,password})
        console.log(response)
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
          toast.success(response.data.message)
        } else{
          toast.error(response.data.message)
        }
      }
    } catch (error){
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Shows "User does not exist" or "Invalid credentials"
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={ onSubmitHandler} className='bg-sate-500 flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' >
      <div className='inline-flex items-center gap-2 mb-2 mt-10' >
        <p className='prata-regular text-3xl' >{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {
        currentState==='Login'?'':<input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 border border-gray-800' placeholder='Name' required />
      }
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 border border-gray-800' placeholder='Email' required />
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 border border-gray-800' placeholder='Password'required />
      <div className='w-full flex justify-between mt-[-8px]'>
        <p className='cursor-pointer' >Forget Password</p>
        {
          currentState==='Login' ? 
          <p onClick={()=>setCurrrentState('Sign Up')} className='cursor-pointer'>create Acount</p> : 
          <p onClick={()=>setCurrrentState('Login')} className='cursor-pointer' >login here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4' >{currentState==='Login'?'Sign In':'Sign Up'}</button>
    </form>
  )
}

export default Login
