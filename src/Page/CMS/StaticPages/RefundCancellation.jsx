import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'
import axiosInstance from '../../../Services/axios';

export default function RefundCancellation() {
  const [RedundCancellationData, setRedundCancellationData] = useState({});
  const getRedundCancellationData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/static-pages/refundsCancellations`, config)
    setRedundCancellationData(response.data.data)
  }
  const handleSavePage = async (data) => {
    const filterData = {
      pageTitle: data.pageTitle,
      description: data.description
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/static-pages/refundsCancellations`, JSON.stringify(filterData), config)
  }
  useEffect(() => { getRedundCancellationData() }, [])
  return (
    <StaticPage PageData={RedundCancellationData} handleSavePage={handleSavePage} getPageData={getRedundCancellationData} />
  )
}
