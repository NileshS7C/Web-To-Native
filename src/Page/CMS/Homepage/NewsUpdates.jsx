import React, { useEffect, useState } from "react";
import NewsSectionInfo from "../../../Component/CMS/HomePage/NewsUpdate/NewsSectionInfo";
import NewsContentTable from "../../../Component/CMS/HomePage/NewsUpdate/NewsContentTable";
import NewsAddDataModal from "../../../Component/CMS/HomePage/NewsUpdate/NewsAddDataModal";
import axiosInstance from "../../../Services/axios";
export default function NewsUpdates() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const fetchNewsSection = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=news`, config);
            setNewsData(response.data.data[0])
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchNewsSection() }, [])
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">News & Update</h1>
                </div>
                <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4 mt-2">
                    <NewsSectionInfo sectionInfo={newsData} />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add News
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
                        <NewsContentTable data={newsData} fetchHomepageSections={fetchNewsSection}/>
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <NewsAddDataModal data={newsData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchHomepageSections={fetchNewsSection}/>
        </div>
    );
}
