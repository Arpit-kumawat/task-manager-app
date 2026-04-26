import React from 'react'
import { FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function ResetPassword() {
  const navigate = useNavigate();
  return (
    <div className='bg-gray-300 justify-center items-center h-screen flex w-full h-full'>
        <div className='bg-white p-8 rounded-lg w-96 max-w-md shadow-lg'>
            <div className='flex items-center justify-center mb-4'>
                                <FaTasks className='bg-blue-700 text-white rounded-full h-10 w-10 px-3' />
                              </div>
                
            
            <h2 className='text-2xl font-bold mb-4 justify-center flex'>Reset your Password</h2>
            <p className='text-gray-600 mb-3 text-center'>Please enter your new password below to reset your account</p>
            <form className='space-y-4 w-full' >
                <label htmlFor="password" className='font-semibold'>New password</label>
                <input type="password" id='password' placeholder="Enter new password" className='p-2 rounded border-2 border-gray-200 w-full' />

                <label htmlFor="confirm-password" className='font-semibold'>Confirm password</label>
                <input type="password" id='confirm-password' placeholder="Confirm new password" className='p-2 rounded border-2 border-gray-200 w-full' />

                <button type="submit" className='bg-blue-600 text-white w-full p-2 rounded'>Reset Password</button>
                <button 
                    type="button"
                    onClick={() => navigate("/login")}
                    className='text-sm text-blue-600 mt-2'
                  >
                    Back to Login
                </button>
            </form>
        </div>
    </div>
  )
}
