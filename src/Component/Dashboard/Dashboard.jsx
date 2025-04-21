import React from 'react'
import { DashboardImg } from '../../Assests'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Content Container */}
      <div className="flex flex-col items-center justify-center px-4">
        <img 
          src={DashboardImg} 
          alt="Dashboard" 
          className="w-[150px] mb-7"
        />
        <h1 className="text-[#19367F] text-[24px] md:text-[32px] font-semibold text-center mb-6 max-w-[85%] md:max-w-[60%]">
          Game on! Manage your tournament like a pro right from here.
        </h1>
        <button 
          className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors text-[18px]"
          onClick={() => navigate('/tournaments')}
        >
          Manage Tournaments
        </button>
      </div>
    </div>
  )
}

export default Dashboard