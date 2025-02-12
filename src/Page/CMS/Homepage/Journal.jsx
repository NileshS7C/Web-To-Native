import React, { useEffect, useState } from "react";
import JournalSectionInfo from "../../../Component/CMS/HomePage/Journal/JournalSectionInfo";
import JournalContentTable from "../../../Component/CMS/HomePage/Journal/JournalContentTable";
import JournalAddDataModal from "../../../Component/CMS/HomePage/Journal/JournalAddDataModal";
import axiosInstance from "../../../Services/axios";
// import SpinnerLoader from "../../../Assests/Spinner";

export default function Journal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [journalData, setJournalData] = useState([]);
    const fetchJournalSection = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=journal`, config);
            setJournalData(response.data.data[0])
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchJournalSection() }, [])
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">The Picklebay Journal</h1>
                </div>
                <div className="flex items-end justify-between w-full">
                    <JournalSectionInfo sectionInfo={journalData} />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Journal
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
                        <JournalContentTable data={journalData.journals} fetchHomepageSections={fetchJournalSection}/>
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <JournalAddDataModal data={journalData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchHomepageSections={fetchJournalSection}/>
        </div>
    );
}
