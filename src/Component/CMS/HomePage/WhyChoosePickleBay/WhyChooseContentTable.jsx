import React, { useState } from "react";
import WhyChooseEditDataModal from "./WhyChooseEditDataModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import WhyChooseDeleteModal from "./WhyChooseDeleteModal";

export default function WhyChooseContentTable({ data, fetchHomepageSections }) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleModifyData = (item) => {
        setOpenEditModal(true);
        setSelectedCard(item);
    };

    const handleDelete = (item) => {
        setDeleteModal(true);
        setSelectedCard(item);
    };

    const headers = [
        "Position",
        "Heading",
        "Sub Heading",
        "Image",
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
                                : header === "Heading" || header === "Sub Heading"
                                    ? "w-[30%]"
                                    : "w-[20%]"
                                }`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.map((event, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 w-[10%]">
                                {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[30%]">
                                {event.heading}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[30%]">
                                {event.subHeading}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[20%]">
                                {event.image}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 w-[10%]">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleModifyData(event)} className="hover:text-blue-600">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(event)} className="hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openEditModal && (
                <WhyChooseEditDataModal
                    data={selectedCard}
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    fetchHomepageSections={fetchHomepageSections}
                />
            )}
            {deleteModal && (
                <WhyChooseDeleteModal
                    data={data}
                    selectedCard={selectedCard}
                    isOpen={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    fetchHomepageSections={fetchHomepageSections}
                />
            )}
        </div>
    );
}
