import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'
import axiosInstance from '../../../Services/axios';

export default function PrivacyPolicy() {
  const [PrivacyPolicyData, setPrivacyPolicyData] = useState({});
  const getPrivacyPolicyData = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/static-pages/privacyPolicy`, config)
    setPrivacyPolicyData(response.data.data)
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
    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/static-pages/privacyPolicy`, JSON.stringify(filterData),config)
  }
  useEffect(() => { getPrivacyPolicyData() }, [])
  return (
    <StaticPage PageData={PrivacyPolicyData} handleSavePage={handleSavePage} getPageData={getPrivacyPolicyData}/>
  )
}
