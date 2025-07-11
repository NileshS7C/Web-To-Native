import React, { useState } from "react";
import WhyChooseEditDataModal from "./WhyChooseEditDataModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

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

    const handleDeleteItem = async () => {
        const updatedFeatures = data.steps.filter(item => {
            const itemKey = `${item.position}-${item.heading}-${item.subHeading}`;
            const selectedKey = `${selectedCard.position}-${selectedCard.heading}-${selectedCard.subHeading}`;
            
            return itemKey !== selectedKey;
        });

        const payload = {
            sectionTitle: data.sectionTitle,
            isVisible: data.isVisible,
            steps: updatedFeatures,
        };
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/whyChoosePicklebay`, JSON.stringify(payload),config);
        fetchHomepageSections();
        setDeleteModal(false);
    };

    const headers = [
        "Position",
        "Heading",
        "Sub Heading",
        "Image",
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
                        {data?.steps?.map((event, index) => (
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
                                    {event.image ? (
                                        <img src={event.image} alt="Step" className="w-10 h-10 object-cover rounded" />
                                    ) : (
                                        <span>No Image</span>
                                    )}
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
            </div>

            {/* Cards for mobile */}
            <div className="block md:hidden space-y-4">
                {data?.steps?.map((event, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 flex flex-col space-y-2 divide-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-500">Position</span>
                            <span className="text-base text-gray-700">{index + 1}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">Heading</span>
                            <span className="block text-base font-regular text-gray-500">{event.heading}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 gap-2">
                            <span className="block text-base font-semibold text-gray-500">Sub Heading</span>
                            <span className="block text-base font-regular text-gray-500 text-right line-clamp-2">{event.subHeading}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">Image</span>
                            {event.image ? (
                                <img src={event.image} alt="Step" className="w-10 h-10 object-cover rounded" />
                            ) : (
                                <span className="block text-base font-regular text-gray-500">No Image</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <p className="block text-base font-semibold text-gray-500">Actions</p>
                            <div>
                                <button onClick={() => handleModifyData(event)} className="hover:text-blue-600">
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(event)} className="hover:text-red-600">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {openEditModal && (
                <WhyChooseEditDataModal
                    data={data}
                    selectedCard={selectedCard}
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    fetchHomepageSections={fetchHomepageSections}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    title="Delete Card"
                    isOpen={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    handleDeleteItem={handleDeleteItem}
                />
            )}
        </>
    );
}
