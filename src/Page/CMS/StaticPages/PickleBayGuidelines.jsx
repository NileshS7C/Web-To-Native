import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'

export default function Guidelines() {
  const [GuidelinesData, setGuidelinesData] = useState({});
  const getGuidelinesData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/guidelines`, { method: "GET" })
    const result = await response.json();
    setGuidelinesData(result.data)
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/guidelines`, requestOptions)
  }
  useEffect(() => { getGuidelinesData() }, [])
  return (
    <StaticPage PageData={GuidelinesData}  handleSavePage={handleSavePage} getPageData={getGuidelinesData}/>
  )
}
