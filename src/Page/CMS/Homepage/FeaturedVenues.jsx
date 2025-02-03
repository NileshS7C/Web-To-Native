import React, { useState, useEffect } from "react";
import VenueSectionInfo from "../../../Component/CMS/HomePage/FeaturedVenues/VenueSectionInfo";
import VenueContentTable from "../../../Component/CMS/HomePage/FeaturedVenues/VenueContentTable";
import VenueListingModal from "../../../Component/CMS/HomePage/FeaturedVenues/VenueListingModal";


export default function FeaturedVenues() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [venuesData, setVenuesData] = useState([]);
    const fetchVenuesData = async () => {
        try {
            const response = await fetch("http://localhost:1234/api/admin/homepage-sections?section=venues", { method: "GET" });
            const result = await response.json();
            setVenuesData(result.data[0])
            console.log(result.data[0],"result.data[0]")
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchVenuesData() }, [])
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">Featured Tournaments</h1>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <VenueSectionInfo sectionInfo={venuesData} />
                    <div className="w-[40%] flex justify-end">
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Venues
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <VenueContentTable data={venuesData} fetchHomepageSections={fetchVenuesData} />
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <VenueListingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchHomepageSections={fetchVenuesData}/>
        </div>
    );
}
