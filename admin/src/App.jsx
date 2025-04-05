/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {Routes,Route} from "react-router-dom" 

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import Orders from './pages/Orders';
import List from './pages/List';
import Login from './components/Login';

const App = () => {

  const [token,setToken]=useState("")
   

  return (
    <div className='b-amber-200 py-1 min-h-screen'>
      <ToastContainer/>
      {
        token === '' ?<Login setToken={setToken} /> :         
        <>
          <Navbar/>
          <hr />
          <div className='flex w-full' >
            <Sidebar/>
            <div className='w-[70%] mx-auto ml-[max(5vw,25px) my-8 text-gray-600 text-base]' >
              <Routes>
                <Route path='/add' element={<Add/>} />
                <Route path='/list'element={<List/>} />
                <Route path='/orders' element={<Orders/>} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
