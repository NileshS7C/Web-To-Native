import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'
import axiosInstance from '../../../Services/axios';

export default function FAQ() {
  const [FAQData, setFAQData] = useState({});
  const getFAQData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/static-pages/helpFaqs`, config)
    setFAQData(response.data.data)
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

    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/static-pages/helpFaqs`, JSON.stringify(filterData), config)
  }
  useEffect(() => { getFAQData() }, [])
  return (
    <StaticPage PageData={FAQData} handleSavePage={handleSavePage} getPageData={getFAQData} />
  )
}
