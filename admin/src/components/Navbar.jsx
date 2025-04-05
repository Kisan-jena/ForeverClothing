import React from 'react'
import assets from '../assets/assets'
import { toast } from 'react-toastify';

const Navbar = ({setToken}) => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken('');
    toast.success("Logged out successfully!");
  }

  return (
    <div className='flex items-center py-2 px-[4%] justify-between b-amber-100 ' >
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={handleLogout} className='bg-gray-600 text-white px-5 py-3 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar
