import React, { useEffect, useState } from 'react'
import StaticPage from '../../../Component/CMS/StaticPages/StaticPage'

export default function RefundCancellation() {
  const [RedundCancellationData, setRedundCancellationData] = useState({});
  const getRedundCancellationData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/refundsCancellations`, { method: "GET" })
    const result = await response.json();
    setRedundCancellationData(result.data)
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/static-pages/refundsCancellations`, requestOptions)
  }
  useEffect(() => { getRedundCancellationData() }, [])
  return (
    <StaticPage PageData={RedundCancellationData} handleSavePage={handleSavePage} getPageData={getRedundCancellationData}/>
  )
}
