import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Services/axios";
import Spinner from "../Component/Common/Spinner";
import couponsTableHeaders from "../Constant/coupons";
import { searchIcon } from "../Assests";
import useDebounce from "../Hooks/useDebounce";
import ErrorBanner from "../Component/Common/ErrorBanner";
import CouponsTable from "../Component/Coupons/CouponsTable";
import FilterGroup from "../Component/Common/FilterGroup";
import { MdDeleteOutline } from "react-icons/md";

const Coupons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  let currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 20;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 });
    }
  }, []);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [status]);

  const getAllCoupons = async (page, filter, searchQuery) => {
    try {
      setLoading(true);
      setError("");

      let queryParams = `?page=${page}&limit=${limit}`;
      if (filter === "active") queryParams += `&isActive=true`;
      else if (filter === "expired") queryParams += `&isActive=false`;
      if (searchQuery) queryParams += `&search=${searchQuery}`;

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/users/admin/discounts${queryParams}`
      );

      setCoupons(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching Coupons:", error);
      setError("Failed to load Coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCoupons(currentPage, status, debouncedSearchTerm);
  }, [currentPage, status, debouncedSearchTerm, refresh]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div>
      <CouponsQueryTools
        setCoupons={setCoupons}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setLoading={setLoading}
        setError={setError}
        status={status}
        setStatus={setStatus}
        currentPage={currentPage}
        limit={limit}
      />
      <DiscountCoupons
        coupons={coupons}
        setCoupons={setCoupons}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        loading={loading}
        error={error}
        limit={limit}
        setRefresh={setRefresh}
      />
    </div>
  );
};

const DiscountCoupons = ({
  coupons,
  handlePageChange,
  currentPage,
  loading,
  error,
  limit,
  setCoupons,
  setRefresh,
}) => {
  const handleDelete = async (code) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/discounts/delete/${code}`
      );

      if (response.status === 200) {
        setRefresh((prev) => !prev);
      } else {
        console.error("Failed to delete coupon:", response.data);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const columns = couponsTableHeaders.map((col) => {
    if (col.key === "actions") {
      return {
        ...col,
        render: (item) => {
          return (
            <button onClick={() => handleDelete(item.code)}>
              <MdDeleteOutline className="h-5 w-5" />
            </button>
          );
        },
      };
    }
    return col;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <div>
      <CouponsTable
        columns={columns}
        data={coupons?.discounts}
        currentPage={currentPage}
        totalPages={coupons.total}
        onPageChange={handlePageChange}
        pathName="/coupons"
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-100"
        alternateRowColors={true}
        pageLimit={limit}
        headerTextAlign="center"
        rowTextAlignment="center"
      />
    </div>
  );
};

const CouponsQueryTools = ({
  searchTerm,
  setSearchTerm,
  setCoupons,
  setLoading,
  setError,
  currentPage,
  status,
  setStatus,
  limit,
}) => {
  const couponFilters = [
    { id: "all", title: "All" },
    { id: "active", title: "Active" },
    { id: "expired", title: "Expired" },
  ];

  return (
    <div className="flex justify-between mb-2 flex-col md:flex-row gap-3">
      <SearchCoupons
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCoupons={setCoupons}
        setLoading={setLoading}
        setError={setError}
        currentPage={currentPage}
        limit={limit}
      />
      <div className="flex items-baseline gap-5">
        <div className="flex space-x-4 mb-4">
          <FilterGroup
            title="Filter By Type:"
            options={couponFilters}
            selectedValue={status}
            onChange={setStatus}
            defaultValue="all"
          />
        </div>
      </div>
    </div>
  );
};

const SearchCoupons = ({
  searchTerm,
  setSearchTerm,
  setCoupons,
  setLoading,
  setError,
  currentPage,
  limit,
}) => {
  const debouncedValue = useDebounce(searchTerm, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative">
      <img
        src={searchIcon}
        alt="Search"
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        ref={inputRef}
        placeholder="Search Coupons"
        className="w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
    </div>
  );
};

export default Coupons;
