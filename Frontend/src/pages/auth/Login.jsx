import React, { useState } from 'react'
import { FaTasks } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("login", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Server error");
      console.log(error);
    }
  };

  return (
    <div className='bg-gray-300 justify-center items-center h-screen flex w-full h-full'>
      <div className='bg-white p-8 rounded-lg w-full max-w-sm shadow-lg'>
        <div className='flex items-center justify-center mb-4'>
          <FaTasks className='bg-[#944ee1] text-white rounded-full h-10 w-10 px-3' />
        </div>

        <h2 className='text-2xl font-bold mb-4 items-center justify-center flex'>
          Sign in to Task Manager
        </h2>

        <p className='mb-4 items-center justify-center flex text-gray-600'>
          Welcome!.. please enter your details
        </p>

        <form className='space-y-4' onSubmit={handleLogin}>
          <div className='flex flex-col'>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder='Enter your email'
              value={loginData.email}
              onChange={handleChange}
              className='p-2 rounded border-2 border-gray-200'
            />
          </div>

          <div className='flex flex-col'>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder='Enter your password'
              value={loginData.password}
              onChange={handleChange}
              className='p-2 rounded border-2 border-gray-200'
            />
            
          </div>

          <div className='flex items-center space-x-1 h-4'>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe" className='text-sm text-gray-600'>Remember me</label>

            <button
              type="button"
              onClick={() => navigate("/ForgotPassword")}
              className='underline text-right gap-4 ml-auto cursor-pointer'
            >
              Forget Password?
            </button>
          </div>

          <button
            type='submit'
            className='bg-[#944ee1] text-white w-full p-2 rounded'
          >
            Sign in
          </button>

          <p className='text-sm text-gray-600 text-center'>
            Don't have an account?
            <button
              type="button"
              onClick={() => navigate("/Signup")}
              className='underline text-[#790af0] cursor-pointer ml-1'
            >
              Sign up 
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

