import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'

export default function PrivacyPolicy() {
  const [PrivacyPolicyData, setPrivacyPolicyData] = useState({});
  const getPrivacyPolicyData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/privacyPolicy`, { method: "GET" })
    const result = await response.json();
    setPrivacyPolicyData(result.data)
  }
  const handleSavePage = async (data) => {
    const filterData = {
      pageTitle: data.pageTitle,
      description: data.description
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(filterData),
      redirect: "follow"
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/privacyPolicy`, requestOptions)
  }
  useEffect(() => { getPrivacyPolicyData() }, [])
  return (
    <StaticPage PageData={PrivacyPolicyData} handleSavePage={handleSavePage} getPageData={getPrivacyPolicyData}/>
  )
}
