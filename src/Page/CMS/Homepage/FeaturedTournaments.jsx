import React, { useState, useEffect } from "react";
import TournamentSectionInfo from "../../../Component/CMS/HomePage/FeaturedTournaments/TournamentSectionInfo";
import TournamentContentTable from "../../../Component/CMS/HomePage/FeaturedTournaments/TournamentContentTable";
import TournamentListingModal from "../../../Component/CMS/HomePage/FeaturedTournaments/TournamentListingModal";
import axiosInstance from "../../../Services/axios";


export default function FeaturedTournaments() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tournamentData, setTournamentData] = useState([]);
    const fetchTournamentsData = async () => {
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=tournament`, config);
            setTournamentData(response.data.data[0])
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchTournamentsData() }, [])
    return (
        <div className="">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">Featured Tournaments</h1>
                </div>
                <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4 mt-2">
                    <TournamentSectionInfo sectionInfo={tournamentData} />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Tournaments
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <TournamentContentTable data={tournamentData} fetchHomepageSections={fetchTournamentsData} />
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <TournamentListingModal tournamentData={tournamentData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchHomepageSections={fetchTournamentsData}/>
        </div>
    );
}
