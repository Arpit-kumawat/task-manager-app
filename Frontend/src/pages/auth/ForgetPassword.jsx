import React,{useState} from 'react'
import { FaTasks } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";



function ForgetPassword() {
  const navigate = useNavigate();

  // const [loginData, setLoginData] = useState({
  //     email: "",
      
  //   });
  
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setLoginData({
  //       ...loginData,
  //       [name]: value
  //     });
  //   };


  return (
    <div className='bg-gray-300 justify-center items-center h-screen flex w-full h-full'>
      <div className='bg-white p-8 rounded-lg w-96 max-w-md shadow-lg'>
        
        <div className='flex items-center justify-center mb-4'>
                    <FaTasks className='bg-[#944ee1] text-white rounded-full h-10 w-10 px-3' />
                  </div>
        <h3 className='text-xl font-bold mb-4 items-center justify-center flex'>
                Task Manager
        </h3>
        
        <h2 className='text-2xl font-bold mb-4 items-center justify-center flex'>
          Forget Password
        </h2>

        <p className='mb-4 items-center justify-center flex text-gray-600'>
          Please enter your email address to Forget your password.
        </p>

        <form className='space-y-4'>
          <div className='flex flex-col'>
            <label htmlFor="email" className='font-semibold'>Email Address</label>
            <input
              type="email"
              id="email"
              placeholder='Enter your email'
              className='p-2 rounded border-2 border-gray-200'
            />
          </div>

          <button
            type='submit'
            className='bg-[#944ee1] text-white w-full p-2 rounded'
          >
            Send your email Id Link
          </button>

          <button 
          type='button'
          onClick={() => navigate("/login")}
          className='flex items-center justify-center mt-3 text-gray-900 w-full'>
            <IoMdArrowBack className='mr-2' />
              Back to Login
          </button>
        </form>

      </div>
    </div>
  )
}

export default ForgetPassword
