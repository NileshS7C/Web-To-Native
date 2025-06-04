import React, { useState } from 'react'
import BasicInfo from './BasicInfo'
import Acknowledgement from './Acknowledgement'
import Participants from './Participants'

const AddSocialEvents = () => {
  const [activeTab, setActiveTab] = useState('basic info')
  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <div className='flex gap-4 mt-4 border-b-[1px] border-[#EDEDED]'>
        <p className='pb-4 cursor-pointer text-base leading-[19.36px]' onClick={() => setActiveTab('basic info')}>Basic Info</p>
        <p className='pb-4 cursor-pointer text-base leading-[19.36px]' onClick={() => setActiveTab('acknowledgement')}>Acknowledgement</p>
        <p className='pb-4 cursor-pointer text-base leading-[19.36px]' onClick={() => setActiveTab('participants')}>Participants</p>
      </div>
      <div>
        {activeTab === 'basic info' && <BasicInfo />}
        {activeTab === 'acknowledgement' && <Acknowledgement />}
        {activeTab === 'participants' && <Participants />}
      </div>
    </div>
  )
}

export default AddSocialEvents