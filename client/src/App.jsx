import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import EmailVerify from './Pages/EmailVerify'
import ResetPassword from './Pages/ResetPassword'

// import { ToastContainer } from 'react-toastify';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  return (
    <div className='h-screen w-full bg-slate-400'>
      <ToastContainer />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/email-verify' element={<EmailVerify/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
        </Routes>
      
    </div>
  )
}

export default App
