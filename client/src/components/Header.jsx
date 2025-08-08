/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContext);

  return (
    <div className='flex items-center w-full h-full justify-center
    '>
        <div className='flex flex-col items-center text-4xl'>
            <h6 className='text-[15px] mb-2 font-bold text-gray-500'>DEVELOPED BY</h6>
            <h1 className='font-bold text-blue-900'>PIYUSH GUPTA</h1>
            <h4>Hi, {userData ? userData.name : "Developer"} Explore the Authentication Process 😉</h4>
        </div>
    </div>
  )
}

export default Header
