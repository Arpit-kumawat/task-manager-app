import React, { Children } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({children}) {
  const isLoggedIn = localStorage.getItem("login");
  if(isLoggedIn === "true"){
    return children;
  }

  return <Navigate to="/login" />;
}

