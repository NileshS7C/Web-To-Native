import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Authentication = ({ children }) => {
  const isAuth = useSelector((state)=>state.AuthReducer.AdminisAuth);
  if (isAuth) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default Authentication;

