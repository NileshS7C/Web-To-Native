import { useState } from "react";
import axiosInstance from "../Services/axios";

const useCreateDiscountCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const createDiscountCoupon = async (couponData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/discounts`,
        couponData
      );

      setResponse(data);
      return data;
    } catch (err) {
      console.error("Error creating discount coupon:", err);
      setError(err.response?.data?.message || "Failed to create coupon.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createDiscountCoupon, loading, error, response };
};

export default useCreateDiscountCoupon;
