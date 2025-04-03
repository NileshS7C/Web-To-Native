import React, { useEffect, useRef, useState } from "react";
import {
  AccordianIcon,
  calenderIcon,
  TimeIcon,
  searchIcon,
} from "../../Assests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddPlayers from "./AddPlayers";
import useCreateDiscountCoupon from "../../Hooks/useCreateDiscountCoupon";
import { fromJSON } from "postcss";
import axiosInstance from "../../Services/axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CouponsFormData = ({ mode = "view", formData, setFormData }) => {
  const [amountType, setAmountType] = useState("fixed amount");
  const [openAmountType, setOpenAmountType] = useState(false);
  const [eligibility, setEligibility] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [addedPlayers, setAddedPlayers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(); // Default time
  const [endTime, setEndTime] = useState(); // Default time
  const { createDiscountCoupon, loading, error, response } =
    useCreateDiscountCoupon();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Initialize the coupon data state with the proper structure
  const [couponData, setCouponData] = useState({
    code: "",
    assignedTo: "",
    discountType: "FIXED",
    value: "",
    maxDiscount: "",
    entityId: null,
    isGlobalCustomer: true,
    assignedCustomers: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  // Update state when formData is received
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setCouponData({
        code: formData.code || "",
        assignedTo: formData.assignedTo || "",
        discountType: formData.discountType || "FIXED",
        value: formData.value || "",
        maxDiscount: formData.maxDiscount || "",
        entityId: formData.entityId ?? null,
        isGlobalCustomer: formData.isGlobalCustomer ?? true,
        assignedCustomers: formData.assignedCustomersDetails || [],
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString().split("T")[0]
          : "",
        startTime: formData.startDate
          ? new Date(formData.startDate).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString().split("T")[0]
          : "",
        endTime: formData.endDate
          ? new Date(formData.endDate).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
      });
      if (
        formData.assignedCustomersDetails &&
        formData.assignedCustomersDetails.length > 0
      ) {
        setEligibility("SPECIFIC CUSTOMERS");
      }
    }
  }, [formData]);

  const handleSelectAmountType = (value) => {
    setAmountType(value);
    // Convert to proper format for the API
    const apiDiscountType = value === "fixed amount" ? "FIXED" : "PERCENTAGE";
    setCouponData({ ...couponData, discountType: apiDiscountType });
    setOpenAmountType(false);
  };

  const handleEligibilityChange = (value) => {
    setEligibility(value);

    setCouponData((prev) => {
      if (value === "COURT" || value === "CUSTOMER") {
        return {
          ...prev,
          assignedTo: value,
          isGlobalCustomer: true,
          assignedCustomers: [],
        };
      } else if (value === "SPECIFIC CUSTOMERS") {
        return {
          ...prev,
          assignedTo: "CUSTOMER",
          isGlobalCustomer: false,
        };
      }
      return prev;
    });
  };

  const handleSaveCoupon = async () => {
    try {
      // Format dates properly (yyyy-MM-dd HH:mm format)
      const formattedStartDate = `${String(startDate.getDate()).padStart(
        2,
        "0"
      )}/${String(startDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${startDate.getFullYear()} ${startTime}`;
      const formattedEndDate = `${String(endDate.getDate()).padStart(
        2,
        "0"
      )}/${String(endDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${endDate.getFullYear()} ${endTime}`;

      // Ensure assignedCustomers are strings
      const assignedCustomers =
        eligibility === "SPECIFIC CUSTOMERS"
          ? addedPlayers.map((player) => String(player._id))
          : [];

      // Create the final coupon object with all required fields
      const finalCouponData = {
        code: couponData.code,
        assignedTo: "CUSTOMER",
        discountType: couponData.discountType,
        value: parseInt(couponData.value, 10) || 0,
        maxDiscount: null,
        entityId: null,
        isPublic: eligibility !== "SPECIFIC CUSTOMERS",
        assignedCustomers,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      // Send data to the API
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/discounts`,
        finalCouponData
      );

      if (response.status === 200 || response.status === 201) {
        navigate(`/coupons`);
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Coupon creation failed:", err);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenAmountType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (code) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/discounts/delete/${
          formData.code
        }`
      );

      if (response.status === 200) {
        navigate(`/coupons`);
      } else {
        console.error("Failed to delete coupon:", response.data);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  useEffect(() => {
    if (formData) {
      if (formData.isPublic) {
        setEligibility("CUSTOMER");
      } else if (formData.assignedTo === "COURT") {
        setEligibility("COURT");
      } else if (formData.assignedCustomersDetails?.length > 0) {
        setEligibility("SPECIFIC CUSTOMERS");
      }
    }
  }, [formData]);

  const isDisabled = formData && Object.keys(formData).length > 0;

  return (
    <div className="max-w-[70%]">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-left font-semibold font-general text-base">
          Amount off Registration
        </p>
        <p className="text-left font-regular mt-4 font-general text-sm capitalize">
          Code
        </p>
        <input
          type="text"
          className="w-full border mt-2 p-2 rounded-lg focus:outline-none"
          placeholder="Enter Code"
          onChange={(e) =>
            setCouponData({ ...couponData, code: e.target.value })
          }
          value={couponData.code}
          disabled={formData?.code}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-5">
        <p className="text-left font-semibold font-general text-base">
          Discount Amount
        </p>
        <div className="flex items-center gap-1 mt-4">
          {/* Dropdown Selector */}
          <div
            className={`flex border p-2 rounded-lg items-center justify-between flex-none w-1/2 relative ${
              formData.discountType
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            onClick={() =>
              !formData.discountType && setOpenAmountType((prev) => !prev)
            }
            ref={dropdownRef}
          >
            <p className="text-left capitalize font-medium font-general text-base">
              {amountType}
            </p>
            <img src={AccordianIcon} alt="Accordian Icon" className="w-5 h-5" />
            {openAmountType && (
              <div className="flex flex-col absolute top-full w-full bg-white border p-2 rounded-lg mt-1 divide-y divide-gray-300">
                <p
                  className="text-left capitalize py-2 cursor-pointer"
                  onClick={() => handleSelectAmountType("fixed amount")}
                >
                  Fixed Amount
                </p>
                <p
                  className="text-left capitalize py-2 cursor-pointer"
                  onClick={() => handleSelectAmountType("percentage")}
                >
                  Percentage
                </p>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="border p-2 rounded-lg flex-none w-1/2 flex items-center gap-2">
            {amountType === "fixed amount" && (
              <p className="font-regular text-sm text-gray-400">₹</p>
            )}
            <input
              type="number"
              className="w-full focus:outline-none"
              placeholder={amountType === "fixed amount" ? "0" : ""}
              onChange={(e) =>
                setCouponData({ ...couponData, value: e.target.value })
              }
              value={couponData.value}
              disabled={formData?.code}
            />
            {amountType === "percentage" && (
              <p className="font-regular text-sm text-gray-400">%</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-5">
        <p className="text-left font-semibold font-general text-base">
          Maximum discount price
        </p>
        <p className="text-left font-regular mt-4 font-general text-sm capitalize">
          Price
        </p>
        <input
          type="number"
          className="w-full border mt-2 p-2 rounded-lg focus:outline-none"
          placeholder="Set Max Discount"
          onChange={(e) =>
            setCouponData({ ...couponData, maxDiscount: e.target.value })
          }
          value={couponData.maxDiscount}
          disabled={formData?.code}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-5 relative">
        <p className="text-left font-semibold font-general text-base">
          Eligibility
        </p>

        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={eligibility === "COURT"}
            onChange={() => setEligibility("COURT")}
            className="accent-blue-500"
            disabled={isDisabled}
          />
          Court
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={eligibility === "CUSTOMER"}
            onChange={() => setEligibility("CUSTOMER")}
            className="accent-blue-500"
            disabled={isDisabled}
          />
          All Customers
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={eligibility === "SPECIFIC CUSTOMERS"}
            onChange={() => setEligibility("SPECIFIC CUSTOMERS")}
            className="accent-blue-500"
            disabled={isDisabled}
          />
          Select Specific Customers
        </label>

        {eligibility === "SPECIFIC CUSTOMERS" && (
          <div className="">
            <AddPlayers
              setAddedPlayers={setAddedPlayers}
              checkCoupon={true}
              isabled={isDisabled}
            />

            {/* Display Assigned Customers */}
            {formData.assignedCustomersDetails?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-sm">Assigned Customers:</p>
                <ul className="mt-2 space-y-2">
                  {formData.assignedCustomersDetails.map((customer) => (
                    <li
                      key={customer._id}
                      className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
                    >
                      <span className="text-sm font-medium">
                        {customer.name}
                      </span>
                      <span className="text-xs opacity-75">
                        {customer.phone || customer.email}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mt-5">
        <p className="text-left font-semibold font-general text-base">
          Active Dates
        </p>
        <div className="mt-4">
          <div className="flex itms-center gap-2">
            <div className="flex-none w-1/2">
              <p className="text-left mb-2">Start Date</p>
              <div className="flex items-center gap-2 border px-3 rounded-lg">
                <img
                  src={calenderIcon}
                  alt="Calender Icon"
                  className="w-5 h-5"
                />
                <DatePicker
                  selected={
                    formData?.startDate
                      ? new Date(formData.startDate)
                      : startDate
                  }
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd-MM-yyyy"
                  className="block w-full rounded-md py-2 text-base focus:outline-none"
                  disabled={!!formData?.startDate}
                />
              </div>
            </div>
            <div className="flex-none w-1/2">
              <p className="text-left mb-2">Start Time (IST)</p>
              <div className="flex items-center gap-2 border px-3 rounded-lg">
                <img src={TimeIcon} alt="Time Icon" className="w-5 h-5" />
                <input
                  type="time"
                  className="block w-full rounded-md py-[6px] text-base focus:outline-none"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex itms-center gap-2 mt-5">
            <div className="flex-none w-1/2">
              <p className="text-left mb-2">End Date</p>
              <div className="flex items-center gap-2 border px-3 rounded-lg">
                <img
                  src={calenderIcon}
                  alt="Calender Icon"
                  className="w-5 h-5"
                />
                <DatePicker
                  selected={
                    formData?.endDate ? new Date(formData.endDate) : endDate
                  }
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd-MM-yyyy"
                  className="block w-full rounded-md py-2 text-base focus:outline-none"
                  disabled={!!formData?.endDate}
                />
              </div>
            </div>
            <div className="flex-none w-1/2">
              <p className="text-left mb-2">End Time (IST)</p>
              <div className="flex items-center gap-2 border px-3 rounded-lg">
                <img src={TimeIcon} alt="Time Icon" className="w-5 h-5" />
                <input
                  type="time"
                  className="block w-full rounded-md py-[6px] text-base focus:outline-none"
                  value={formData?.endTime || endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!!formData?.endTime}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-5">
            {formData.code ? (
              <button
                className="bg-red-500 px-3 py-2 rounded-lg text-white cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            ) : (
              <button
                className="bg-[#1570ef] px-3 py-2 rounded-lg text-white cursor-pointer"
                onClick={handleSaveCoupon}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponsFormData;
