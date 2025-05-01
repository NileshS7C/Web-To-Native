import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

export default function VenueContentTable({ data, fetchHomepageSections }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleDelete = (item) => {
        setDeleteModal(true);
        setSelectedCard(item);
    };

    const handleDeleteItem = async () => {
        const updatedFeatures = data.venues
            .filter(venue => venue.venueID.name !== selectedCard.venueID.name);

        const reindexedFeatures = updatedFeatures.map((venue, index) => ({
            venueID: venue.venueID._id,
            position: venue.position,
        }));

        const payload = {
            sectionTitle: data.sectionTitle,
            isVisible: data.isVisible,
            venues: reindexedFeatures,
        };

        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        // Send API request
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/venues`, JSON.stringify(payload),config);
        fetchHomepageSections();

    };

    const headers = [
        "Position",
        "Name",
        "Handle",
        "Address",
        "Actions"
    ];

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className={`px-3 py-2 text-left text-sm font-semibold text-gray-900" ${header === "Position" || header === "Actions"
                                ? "w-[10%]"
                                : header === "Name" || header === "Handle"
                                    ? "w-[30%]"
                                    : "w-[20%]"
                                }`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.venues?.map((venue, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 w-[10%]">
                                {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[30%]">
                                {venue.venueID.name}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[30%]">
                                {venue.venueID.handle}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[20%]">
                                {venue.venueID.address.city}
                            </td>
                            <td className="px-3 py-4 text-sm text-[#1570EF] w-[10%]">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleDelete(venue)} className="hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {deleteModal && (
                <DeleteModal
                    title="Delete Venue"
                    isOpen={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    handleDeleteItem={handleDeleteItem}
                />
            )}
        </div>
    );
}
