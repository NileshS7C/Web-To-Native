import React, { useState, useEffect } from "react";
import EventsSectionInfo from "../../Component/CMS/SocialEvents/EventsSectionInfo";
import EventContentTable from "../../Component/CMS/SocialEvents/EventContentTable";
import EventListingModal from "../../Component/CMS/SocialEvents/EventListingModal";
import axiosInstance from "../../Services/axios";


const FeaturedSocialEvents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, seteventData] = useState([]);
  const fetchEventsData = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/community-sections?section=events`, config);
      seteventData(response.data.data[0])
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => { fetchEventsData() }, [])
  return (
    <div className="">
      <div className="sm:flex sm:flex-col gap-4">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold text-gray-900">Featured Social Events</h1>
        </div>
        <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4 mt-2">
          <EventsSectionInfo sectionInfo={eventData} />
          <div className="flex justify-end">
            <button
              type="button"
              className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
              onClick={() => setIsModalOpen(true)}
            >
              Add Social Events
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <EventContentTable data={eventData} fetchEventSections={fetchEventsData} />
          </div>
        </div>
      </div>

      {/* Pass isOpen and onClose to AddDataModal */}
      <EventListingModal eventData={eventData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchEventSections={fetchEventsData} />
    </div>
  )
}

export default FeaturedSocialEvents