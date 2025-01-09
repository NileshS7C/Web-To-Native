import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Authentication = ({ children }) => {
  const [cookies, setCookie] = useCookies("refreshToken");
  const isLoggedIn = cookies.refreshToken;
  if (isLoggedIn) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

export default Authentication;
