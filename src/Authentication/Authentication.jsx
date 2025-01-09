import React from "react";
import { Navigate } from "react-router-dom";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
const Authentication = ({ children }) => {
  const isLoggedIn = cookies.get("refreshToken");
  if (isLoggedIn) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default Authentication;
