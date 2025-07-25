import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CouponsFormData from "./CouponsFormData";
import axiosInstance from "../../Services/axios";

const CouponDetails = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the last endpoint from the URL
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const code = pathSegments[pathSegments.length - 1]; // Get the last part of the URL

  useEffect(() => {
    if (!code) return;

    const fetchCoupon = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/users/admin/discounts/${code}`
        );
        setSelectedCoupon(response.data);
      } catch (err) {
        setError("Failed to fetch coupon data.");
        console.error("Error fetching coupon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [code]);

  return (
    <div className="mx-auto max-w-[100%]">
      {loading && <p>Loading coupon details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Show form when coupon is available */}
      {selectedCoupon && (
        <div className="p-4">
          <CouponsFormData
            mode="edit"
            formData={selectedCoupon.data}
            setFormData={setSelectedCoupon}
          />
        </div>
      )}
    </div>
  );
};

export default CouponDetails;
