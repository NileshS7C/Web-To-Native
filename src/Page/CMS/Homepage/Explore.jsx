import React, { useEffect, useState } from "react";
import ExploreContentTable from "../../../Component/CMS/HomePage/Explore/ExploreContentTable";
import ExploreSectionInfo from "../../../Component/CMS/HomePage/Explore/ExploreSectionInfo";
import ExploreAddDataModal from "../../../Component/CMS/HomePage/Explore/ExploreAddDataModal";
import axiosInstance from "../../../Services/axios";

export default function Explore() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exploreData, setExploreData] = useState([]);
    const fetchExploreSection = async () => {
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=explore`,config);
            setExploreData(response.data.data[0]);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchExploreSection() }, [])

    return (
        <div className="">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">Explore Picklebay</h1>
                </div>
                <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4 mt-2">
                    <ExploreSectionInfo sectionInfo={exploreData} />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Card
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="">
                    <div className="inline-block min-w-full align-middle">
                        <ExploreContentTable data={exploreData} fetchHomepageSections={fetchExploreSection} />
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <ExploreAddDataModal data={exploreData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchHomepageSections={fetchExploreSection} />
        </div>
    );
}
