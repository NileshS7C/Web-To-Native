import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../Services/axios";
import Spinner from "../Component/Common/Spinner";
import couponsTableHeaders from "../Constant/coupons";
import FilterCoupons from "../Component/Coupons/FilterCoupons";
import { searchIcon } from "../Assests";
import useDebounce from "../Hooks/useDebounce";
import ErrorBanner from "../Component/Common/ErrorBanner";
import CouponsTable from "../Component/Coupons/CouponsTable";

const Coupons = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");
    const [playerName, setPlayerName] = useState("");

    let currentPage = parseInt(searchParams.get("page")) || 1;
    const limit = 20;

    useEffect(() => {
        if (!searchParams.get("page")) {
            setSearchParams({ page: 1 });
        }
    }, []);

    useEffect(() => {
        setSearchParams({ page: 1 });
        setPlayerName("");
    }, [status]);

    const getAllCoupons = async (page, activeFilter) => {
        try {
            setLoading(true);
            setError("");

            let queryParams = `?page=${page}&limit=${limit}`;
            if (activeFilter) queryParams += `&isActive=${activeFilter.toLowerCase()}`;

            const response = await axiosInstance.get(
                `${import.meta.env.VITE_BASE_URL}/users/admin/discounts${queryParams}`
            );

            setCoupons(response?.data?.data);
        } catch (error) {
            console.error("Error fetching Coupons:", error);
            setError("Failed to load Coupons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!playerName) {
            getAllCoupons(currentPage, status);
        }
    }, [currentPage, status, playerName]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    return (
        <div>
            <CouponsQueryTools
                setCoupons={setCoupons}
                playerName={playerName}
                setPlayerName={setPlayerName}
                setLoading={setLoading}
                setError={setError}
                status={status}
                setStatus={setStatus}
                currentPage={currentPage}
                limit={limit}
            />
            <DiscountCoupons
                coupons={coupons}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                loading={loading}
                error={error}
                limit={limit}
            />
        </div>
    )
}


const DiscountCoupons = (props) => {
    const { coupons, handlePageChange, currentPage, loading, error, limit } =
        props;
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
                columns={couponsTableHeaders}
                data={coupons?.discounts}
                currentPage={currentPage}
                totalPages={coupons.total}
                onPageChange={handlePageChange}
                pathName="/coupons"
                evenRowColor="[#FFFFFF]"
                oddRowColor="blue-400"
                alternateRowColors={true}
                pageLimit={limit}
            />
        </div>
    );
};

const CouponsQueryTools = (props) => {
    const {
      playerName,
      setPlayerName,
      setCoupons,
      setLoading,
      setError,
      currentPage,
      status,
      setStatus,
      limit,
    } = props;
    return (
      <div className="flex justify-between mb-2">
        <SearchCoupons
          playerName={playerName}
          setPlayerName={setPlayerName}
          setCoupons={setCoupons}
          setLoading={setLoading}
          setError={setError}
          currentPage={currentPage}
          limit={limit}
        />
        <div className="flex items-baseline gap-5">
          <p className="text-sm text-[#b8c8eb]">Fitlers: </p>
          <div className="flex space-x-4 mb-4">
            <FilterCoupons
              label="Active"
              options={["True", "False"]}
              selectedValue={status}
              onChange={setStatus}
            />
          </div>
        </div>
      </div>
    );
  };


  const SearchCoupons = ({
    playerName,
    setPlayerName,
    setCoupons,
    setLoading,
    setError,
    currentPage,
    limit,
  }) => {
    const [searchCoupons, setSearchCoupons] = useState("");
    const debouncedValue = useDebounce(searchCoupons, 300);
    const inputRef = useRef(null);
  
    useEffect(() => {
      const getCoupons = async (amount) => {
        try {
          setLoading(true);
          setError("");
          const response = await axiosInstance.get(
            `${
              import.meta.env.VITE_BASE_URL
            }/users/admin/discounts?search=${amount}&page=${currentPage}&limit=${limit}`
          );
  
          setCoupons(response.data.data);
        } catch (err) {
          console.log("Error in getting the player information", err);
          setError("Failed to get the players.");
        } finally {
          setLoading(false);
        }
      };
      if (debouncedValue) {
        getCoupons(debouncedValue);
      }
    }, [debouncedValue, currentPage]);
  
    const handleSearch = useCallback(
      (e) => {
        setPlayerName(e.target.value);
        setSearchCoupons(e.target.value);
      },
      [setPlayerName]
    );
  
    useEffect(() => {
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    }, []);
    return (
      <div className="relative ">
        <img
          src={searchIcon}
          alt="players"
          className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
        />
        <input
          ref={inputRef}
          placeholder="Search Players"
          className=" w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
          value={playerName}
        />
      </div>
    );
  };
  
  

export default Coupons