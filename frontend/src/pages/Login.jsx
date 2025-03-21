import 'react'
import { useState } from 'react'

const Login = () => {
  
  const [currentState,setCurrrentState]=useState('Login')
  const onSubmitHandler=async(event)=>{
    event.preventDefault();
  }

  return (
    <form onSubmit={ onSubmitHandler} className='bg-sate-500 flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' >
      <div className='inline-flex items-center gap-2 mb-2 mt-10' >
        <p className='prata-regular text-3xl' >{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState==='Login'?'':<input type="text" className='w-full px-3 border border-gray-800' placeholder='Name' required />}
      <input type="email" className='w-full px-3 border border-gray-800' placeholder='Email' required />
      <input type="password" className='w-full px-3 border border-gray-800' placeholder='Password'required />
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
