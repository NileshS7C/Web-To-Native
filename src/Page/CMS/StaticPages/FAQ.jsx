import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'

export default function FAQ() {
  const [FAQData, setFAQData] = useState({});
  const getFAQData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/helpFaqs`, { method: "GET" })
    const result = await response.json();
    setFAQData(result.data)
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/helpFaqs`, requestOptions)
  }
  useEffect(() => { getFAQData() }, [])
  return (
    <StaticPage PageData={FAQData} handleSavePage={handleSavePage} getPageData={getFAQData} />
  )
}
