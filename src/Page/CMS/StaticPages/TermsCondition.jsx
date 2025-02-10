import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'

export default function TermsCondition () {
  const [TermsConditionData, setTermsConditionData] = useState({});
  const getTermsConditionData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/termsConditions`, { method: "GET" })
    const result = await response.json();
    setTermsConditionData(result.data)
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/termsConditions`, requestOptions)
  }
  useEffect(() => { getTermsConditionData() }, [])
  return (
    <StaticPage PageData={TermsConditionData} handleSavePage={handleSavePage} getPageData={getTermsConditionData}/>
  )
}
