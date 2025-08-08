import React from 'react';
import {useNavigate} from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className='flex justify-between absolute top-0 items-center p-5 w-full '>
      <h1 className='font-bold text-4xl '>Authentication Project</h1>
      <button onClick={()=>navigate("/login")} className='px-4 py-2 bg-blue-950 text-white rounded cursor-pointer'>Login</button>
    </div>
  )
}

export default Navbar
