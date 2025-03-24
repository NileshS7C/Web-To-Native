import React, { useEffect, useState } from 'react'
import { AccordianIcon, calenderIcon, TimeIcon, searchIcon } from '../../Assests'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddPlayers from './AddPlayers';
import useCreateDiscountCoupon from '../../Hooks/useCreateDiscountCoupon';

const CouponsFormData = ({ mode = 'view', formData, setFormData }) => {
    const [amountType, setAmountType] = useState('fixed amount');
    const [openAmountType, setOpenAmountType] = useState(false);
    const [eligibility, setEligibility] = useState('');
    const [customerList, setCustomerList] = useState([]);
    const [showCustomerList, setShowCustomerList] = useState(false);
    const [addedPlayers, setAddedPlayers] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState("12:00"); // Default time
    const [endTime, setEndTime] = useState("19:00"); // Default time
    const { createDiscountCoupon, loading, error, response } = useCreateDiscountCoupon();

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
        endDate: ""
    });

    const handleSelectAmountType = (value) => {
        setAmountType(value);
        setOpenAmountType(false);
        // Convert to proper format for the API
        const apiDiscountType = value === 'fixed amount' ? 'FIXED' : 'PERCENTAGE';
        setCouponData({ ...couponData, discountType: apiDiscountType });
    }

    const handleEligibilityChange = (value) => {
        setEligibility(value);
        
        if (value === "COURT" || value === "CUSTOMER") {
            setCouponData({ 
                ...couponData, 
                assignedTo: value,
                isGlobalCustomer: true,
                assignedCustomers: []
            });
        } else if (value === "SPECIFIC CUSTOMERS") {
            setCouponData({ 
                ...couponData, 
                assignedTo: 'CUSTOMER', 
                isGlobalCustomer: false,
                // The actual customers will be set when saving
            });
        }
    }

    const handleSaveCoupon = () => {
        // Format dates properly
        const formattedStartDate = `${startDate.toLocaleDateString("en-GB")} ${startTime}`;
        const formattedEndDate = `${endDate.toLocaleDateString("en-GB")} ${endTime}`;

        // Create the final coupon object with all required fields
        const finalCouponData = {
            ...couponData,
            // Convert value and maxDiscount to integers
            value: parseInt(couponData.value, 10) || 0,
            maxDiscount: parseInt(couponData.maxDiscount, 10) || 0,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            // Set assigned customers only if specific customers are selected
            assignedCustomers: eligibility === "SPECIFIC CUSTOMERS" ? addedPlayers : [],
            isGlobalCustomer: eligibility !== "SPECIFIC CUSTOMERS",
            // Ensure entityId is null
            entityId: null
        };

        try {
            // Call the hook with the complete data
            createDiscountCoupon(finalCouponData);
            alert("Coupon created successfully!");
        } catch (err) {
            console.error("Coupon creation failed:", err);
        }
    };

    // For debugging purposes
    useEffect(() => {
        console.log(couponData);
    }, [couponData]);

    return (
        <div>
            <div className='bg-white p-4 rounded-lg shadow-md'>
                <p className='text-left font-semibold font-general text-base'>Amount off Registration</p>
                <p className='text-left font-regular mt-4 font-general text-sm capitalize'>Code</p>
                <input 
                    type="text" 
                    className='w-full border mt-2 p-2 rounded-lg focus:outline-none' 
                    placeholder='Enter Code' 
                    onChange={(e) => setCouponData({ ...couponData, code: e.target.value })} 
                    value={couponData.code} 
                />
            </div>

            <div className='bg-white p-4 rounded-lg shadow-md mt-5'>
                <p className='text-left font-semibold font-general text-base'>Discount Amount</p>
                <div className='flex items-center gap-1 mt-4'>
                    <div 
                        className='flex border p-2 rounded-lg items-center justify-between flex-none w-1/2 relative cursor-pointer' 
                        onClick={() => setOpenAmountType((prev) => !prev)}
                    >
                        <p className='text-left capitalize font-medium font-general text-base cursor-pointer'>{amountType}</p>
                        <img src={AccordianIcon} alt="Accordian Icon" className='w-5 h-5' />
                        {openAmountType && (
                            <div className='flex flex-col absolute top-full w-full bg-white border p-2 rounded-lg mt-1 divide-y divide-gray-300'>
                                <p className='text-left capitalize py-2 cursor-pointer' onClick={() => handleSelectAmountType('fixed amount')}>fixed amount</p>
                                <p className='text-left capitalize py-2 cursor-pointer' onClick={() => handleSelectAmountType('percentage')}>percentage</p>
                            </div>
                        )}
                    </div>
                    <div className='border p-2 rounded-lg flex-none w-1/2 flex items-center gap-2'>
                        {amountType === 'fixed amount' && (
                            <p className='font-regular text-sm text-gray-400'>₹</p>
                        )}
                        <input 
                            type="number" 
                            className='w-full focus:outline-none' 
                            placeholder={`${amountType === 'fixed amount' ? '0' : ''}`} 
                            onChange={(e) => setCouponData({ ...couponData, value: e.target.value })} 
                            value={couponData.value} 
                        />
                        {amountType === 'percentage' && (
                            <p className='font-regular text-sm text-gray-400'>%</p>
                        )}
                    </div>
                </div>
            </div>

            <div className='bg-white p-4 rounded-lg shadow-md mt-5'>
                <p className='text-left font-semibold font-general text-base'>Maximum discount price</p>
                <p className='text-left font-regular mt-4 font-general text-sm capitalize'>Price</p>
                <input 
                    type="number" 
                    className='w-full border mt-2 p-2 rounded-lg focus:outline-none' 
                    placeholder='Set Max Discount' 
                    onChange={(e) => setCouponData({ ...couponData, maxDiscount: e.target.value })} 
                    value={couponData.maxDiscount} 
                />
            </div>

            <div className='bg-white p-4 rounded-lg shadow-md mt-5 relative'>
                <p className='text-left font-semibold font-general text-base'>Eligibility</p>
                <label className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        checked={eligibility === "COURT"}
                        onChange={() => handleEligibilityChange("COURT")}
                        className="accent-blue-500"
                    />
                    Court
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={eligibility === "CUSTOMER"}
                        onChange={() => handleEligibilityChange("CUSTOMER")}
                        className="accent-blue-500"
                    />
                    All Customer
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={eligibility === "SPECIFIC CUSTOMERS"}
                        onChange={() => handleEligibilityChange("SPECIFIC CUSTOMERS")}
                        className="accent-blue-500"
                    />
                    Select Specific Customers
                </label>
                {eligibility === "SPECIFIC CUSTOMERS" && (
                    <div className=''>
                        <AddPlayers setAddedPlayers={setAddedPlayers} />
                    </div>
                )}
            </div>

            <div className='bg-white p-4 rounded-lg shadow-md mt-5'>
                <p className='text-left font-semibold font-general text-base'>Active Dates</p>
                <div className='mt-4'>
                    <div className='flex itms-center gap-2'>
                        <div className='flex-none w-1/2'>
                            <p className='text-left mb-2'>Start Date</p>
                            <div className='flex items-center gap-2 border px-3 rounded-lg'>
                                <img src={calenderIcon} alt="Calender Icon" className='w-5 h-5' />
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                    className="block w-full rounded-md py-2 text-base focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className='flex-none w-1/2'>
                            <p className='text-left mb-2'>Start Time (IST)</p>
                            <div className='flex items-center gap-2 border px-3 rounded-lg'>
                                <img src={TimeIcon} alt="Time Icon" className='w-5 h-5' />
                                <input
                                    type="time"
                                    className="block w-full rounded-md py-[6px] text-base focus:outline-none"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex itms-center gap-2 mt-5'>
                        <div className='flex-none w-1/2'>
                            <p className='text-left mb-2'>End Date</p>
                            <div className='flex items-center gap-2 border px-3 rounded-lg'>
                                <img src={calenderIcon} alt="Calender Icon" className='w-5 h-5' />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                    className="block w-full rounded-md py-2 text-base focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className='flex-none w-1/2'>
                            <p className='text-left mb-2'>End Time (IST)</p>
                            <div className='flex items-center gap-2 border px-3 rounded-lg'>
                                <img src={TimeIcon} alt="Time Icon" className='w-5 h-5' />
                                <input
                                    type="time"
                                    className="block w-full rounded-md py-[6px] text-base focus:outline-none"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-4 mt-5'>
                        <button 
                            className='bg-[#1570ef] px-3 py-2 rounded-lg text-white cursor-pointer' 
                            onClick={handleSaveCoupon}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CouponsFormData