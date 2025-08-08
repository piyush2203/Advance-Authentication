/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();
  const {backendUrl, isLoggedIn, setisLoggedIn, getUserData} = useContext(AppContext);
  const [state, setstate] = useState('Sign Up')

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");


  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      //for Sign Up
      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl + "/api/auth/register", {name,email,password});

        if(data.success){
          setisLoggedIn(true);
          getUserData();
          navigate("/");
        }else{
          toast.error(data.message);
        }
      }
      //for login
      else{
        const {data} = await axios.post(backendUrl + "/api/auth/login", {email,password});

        if(data.success){
          setisLoggedIn(true);
          getUserData();
          navigate("/");
        }else{
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className='flex  items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-red-400'>
      <h1 className='font-bold text-4xl absolute top-25  '>Authentication Project</h1>
      <div className='bg-pink-700 rounded p-10 rounded-lg- shadow-lg w-full sm:w-96 text-white text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'> {state === "Sign Up" ? "Create Account" : "Login "}</h2>
        <p className='text-center text-sm mb-6 text-pink-200'> {state === "Sign Up" ? "Create Your Account" : "Login To Your Account !"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && ( 
            <div className='mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-pink-900'>
              <label htmlFor="name">Name: </label>

              <input className='name bg-transparent px-12 py-1 focus:outline-none overflow-hidden' type="text" onChange={e=>setname(e.target.value)} value={name} required placeholder='Enter Your Name' />
            </div>
        )}
         


          <div className='mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-pink-900'>
            <label htmlFor="name">Email: </label>
            <input className='name bg-transparent px-12 py-1 focus:outline-none overflow-hidden' type="email" onChange={e=>setemail(e.target.value)} value={email} required placeholder='Enter Your Email' />
          </div>


          <div className='mb-4 flex items-center justify-between gap-3 w-full px-5 py-2.5 rounded-full bg-pink-900'>
            <label htmlFor="name">Password: </label>
            <input className='name bg-transparent px-4 focus:outline-none py-1  overflow-hidden' type="password" onChange={e=>setpassword(e.target.value)} value={password} required placeholder='Enter Your Password' />
          </div>
          
          <p onClick={()=>{navigate("/reset-password")}} className='mb-4 text-slate-400 ml-2 cursor-pointer'>Forgot Password ?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-b from-pink-300 to-pink-800 font-medium'>{state}</button>
        </form>

        {state === "Sign Up" ?  (
          <p className='text-gray-400 text-center text-sm mt-4'>Already have an account ?{' '} <span onClick={()=>{setstate("Login")}} className='text-pink-100 text-center font-semibold mt-4 cursor-pointer underline'>Login Here</span></p>
        ): (
        <p className='text-gray-400 text-center text-sm mt-4'>Don't Have an Account? <span  onClick={()=>{setstate("Sign Up")}} className='text-pink-100 text-center font-semibold mt-4 cursor-pointer underline'>SignUp</span></p>

        )}
        

        
      </div>
    </div>
  )
}

export default Login
