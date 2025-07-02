import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import BasicInfo from './BasicInfo'
import { AcknowledgementText as Acknowledgement } from './Acknowledgement'

const AddSocialEvents = () => {
  const location = useLocation()
  const { eventId } = useParams()
  const [activeTab, setActiveTab] = useState('basic info')

  // Check if we have an eventId (means event was created successfully)
  const isEventCreated = !!eventId

  // Get ownerUserId from localStorage if we're on acknowledgement page
  const ownerUserId = eventId ? localStorage.getItem(`event_${eventId}_ownerUserId`) : null

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname.includes('/acknowledgement') && isEventCreated) {
      setActiveTab('acknowledgement')
    } else {
      setActiveTab('basic info')
    }
  }, [location.pathname, isEventCreated])

  const handleTabClick = (tabName) => {
    
    // Only allow acknowledgement tab if event is created
    if (tabName === 'acknowledgement' && !isEventCreated) {
      return;
    }
    setActiveTab(tabName);
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <div className='flex gap-6 mt-4 border-b-[1px] border-[#EDEDED]'>
        <p
          className={`pb-4 cursor-pointer text-base leading-[19.36px] ${
            activeTab === 'basic info' ? 'border-b-2 border-blue-500 text-blue-600' : ''
          }`}
          onClick={() => handleTabClick('basic info')}
        >
          Basic Info
        </p>
        <p
          className={`pb-4 text-base leading-[19.36px] ${
            activeTab === 'acknowledgement' ? 'border-b-2 border-blue-500 text-blue-600' : ''
          } ${
            !isEventCreated
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:text-blue-600'
          }`}
          onClick={() => handleTabClick('acknowledgement')}
          title={!isEventCreated ? 'Complete Basic Info first to enable Acknowledgement' : ''}
        >
          Acknowledgement
        </p>
      </div>
      <div>
        {activeTab === 'basic info' && <BasicInfo />}
        {activeTab === 'acknowledgement' && (
          <Acknowledgement ownerUserId={ownerUserId} disabled={false} />
        )}
      </div>
    </div>
  )
}

export default AddSocialEvents