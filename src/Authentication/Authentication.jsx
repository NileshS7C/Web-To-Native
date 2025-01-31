import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

const Authentication = ({ children }) => {
  const [cookies] = useCookies(["refreshToken"]);
  const { accessToken } = useSelector((state) => state.auth);
  if (cookies?.refreshToken || accessToken) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

export default Authentication;
