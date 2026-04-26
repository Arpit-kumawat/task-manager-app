import { useState } from "react";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import InvalidPage from "./pages/auth/InvalidPage";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/layout/Dashboard";
import Home from "./components/layout/Home";
import User from "./components/layout/User";
import Task from "./components/layout/Task";
import Countries from "./components/layout/Countries";
import States from "./components/layout/States";
import City from "./components/layout/City";
import Settings from "./components/layout/Settings";

import Profile from "./components/folder/Profile";

import NewUsers from "./components/folder/NewUsers";
import NewTasks from "./components/folder/NewTasks";

import ProtectedRoute from "./components/folder/ProtectedRoute";
import FrontPage from "./pages/FrontPage";

function App() {
  return (
    <>
      {/* <Login /> */}
      {/* <ForgetPassword /> */}
      {/* <ResetPassword /> */}
      {/* <InvalidPage /> */}
      {/* <Signup /> */}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgotPassword" element={<ForgetPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/InvalidPage" element={<InvalidPage />} />

        <Route element={ProtectedRoute}></Route>

        {/* Dashboard Layout Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="task"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />
          <Route
            path="countries"
            element={
              <ProtectedRoute>
                <Countries />
              </ProtectedRoute>
            }
          />
          <Route
            path="states"
            element={
              <ProtectedRoute>
                <States />
              </ProtectedRoute>
            }
          />
          <Route path="city" element={<City />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

        {/* new routes for new user and task */}
          {/* <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="newUsers"
            element={
              <ProtectedRoute>
                <NewUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="newUsers/:id"
            element={
              <ProtectedRoute>
                <NewUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="newTasks"
            element={
              <ProtectedRoute>
                <NewTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="newTasks/:id"
            element={
              <ProtectedRoute>
                <NewTasks />
              </ProtectedRoute>
            }
          />
        </Route>


        <Route path="/">
          {/* <Route path="NewUsers" element={<NewUsers />} /> */}
          {/* <Route path="NewTasks" element={<NewTasks />} /> */}
          // <Route path="Profile" element={<Profile />} />
          {/* <Route path="/NewTasks/:id" element={<NewTasks />} /> */}
          {/* <Route path="/NewUsers/:id" element={<NewUsers />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
