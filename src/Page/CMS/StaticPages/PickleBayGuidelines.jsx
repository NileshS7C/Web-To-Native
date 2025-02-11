import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'
import axiosInstance from '../../../Services/axios';

export default function Guidelines() {
  const [GuidelinesData, setGuidelinesData] = useState({});
  const getGuidelinesData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/static-pages/guidelines`, config)
    setGuidelinesData(response.data.data)
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
    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/static-pages/guidelines`, JSON.stringify(filterData), config)
  }
  useEffect(() => { getGuidelinesData() }, [])
  return (
    <StaticPage PageData={GuidelinesData} handleSavePage={handleSavePage} getPageData={getGuidelinesData} />
  )
}
