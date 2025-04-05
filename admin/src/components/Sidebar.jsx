import React from 'react'
import { NavLink} from 'react-router-dom'
import assets from '../assets/assets'

const navitems=[
  { name: "add", path: "/add", icon:assets.add_icon },
  { name: "List item", path: "/list", icon:assets.order_icon },
  { name: "Orders", path: "/orders", icon:assets.order_icon }
]

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-1' >
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]' >
        {navitems.map((item,index)=>(
          //^ isActive yaha k jagah css se bhi kar sakta hai for that use only className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
          <NavLink key={index} to={item.path} className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-gray-200' : ''}`}>
            <img className='w-5 h-5' src={item.icon} alt="" />
            <p className='hidden md:block' >{item.name}</p>
          </NavLink>
        ))}

      </div>
    </div>
  )
}

export default Sidebar
