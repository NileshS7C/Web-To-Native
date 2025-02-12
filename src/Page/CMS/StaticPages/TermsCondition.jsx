import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'
import axiosInstance from '../../../Services/axios';

export default function TermsCondition () {
  const [TermsConditionData, setTermsConditionData] = useState({});
  const getTermsConditionData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/static-pages/termsConditions`, config)
    setTermsConditionData(response.data.data)
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
    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/static-pages/termsConditions`, JSON.stringify(filterData),config)
  }
  useEffect(() => { getTermsConditionData() }, [])
  return (
    <StaticPage PageData={TermsConditionData} handleSavePage={handleSavePage} getPageData={getTermsConditionData}/>
  )
}
