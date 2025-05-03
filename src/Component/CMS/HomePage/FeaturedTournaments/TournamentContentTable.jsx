import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

export default function TournamentContentTable({ data, fetchHomepageSections }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleDelete = (item) => {
        setDeleteModal(true);
        setSelectedCard(item);
    };

    const handleDeleteItem = async () => {
        const updatedFeatures = data.tournaments
            .filter(tournament => tournament.tournamentID.tournamentName !== selectedCard.tournamentID.tournamentName);

        const reindexedFeatures = updatedFeatures.map((tournament, index) => ({
            tournamentID: tournament.tournamentID._id,
            position: index + 1,
        }));
        const payload = {
            sectionTitle: data.sectionTitle,
            isVisible: data.isVisible,
            tournaments: reindexedFeatures,
        };
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/tournament`, JSON.stringify(payload),config);
        fetchHomepageSections();
    };

    const headers = [
        "Position",
        "Tournament Name",
        "Start Date",
        "End Date",
        "Location",
        "Actions"
    ];

    return (
        <>
            {/* Table for md and up */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300 hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${header === "Position" || header === "Actions"
                                    ? "w-[10%]"
                                    : header === "Tournament Name"
                                        ? "w-[50%]"
                                        : "w-[10%]"
                                    }`}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data?.tournaments?.map((tournament, index) => (
                            <tr key={index} className="text-left">
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {tournament.tournamentID.tournamentName}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(tournament.tournamentID.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(tournament.tournamentID.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {tournament.tournamentID.tournamentLocation.address.city}, {tournament.tournamentID.tournamentLocation.address.state}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => handleDelete(tournament)} className="hover:text-red-600">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards for mobile */}
            <div className="block md:hidden space-y-4">
                {data?.tournaments?.map((tournament, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 flex flex-col space-y-2 divide-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-500">Position</span>
                            <span className="text-base text-gray-700">{index + 1}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">Tournament Name</span>
                            <span className="block text-base font-regular text-gray-500">{tournament.tournamentID.tournamentName}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">Start Date</span>
                            <span className="block text-base font-regular text-gray-500">{new Date(tournament.tournamentID.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">End Date</span>
                            <span className="block text-base font-regular text-gray-500">{new Date(tournament.tournamentID.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">Location</span>
                            <span className="block text-base font-regular text-gray-500">
                                {tournament.tournamentID.tournamentLocation.address.city}, {tournament.tournamentID.tournamentLocation.address.state}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <p className="block text-base font-semibold text-gray-500">Actions</p>
                            <div>
                                <button onClick={() => handleDelete(tournament)} className="hover:text-red-600">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {deleteModal && (
                <DeleteModal
                    title="Delete Tournament"
                    isOpen={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    handleDeleteItem={handleDeleteItem}
                />
            )}
        </>
    );
}
