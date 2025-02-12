import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

export default function JournalContentTable({ data, fetchHomepageSections }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
console.log('data',data)
    const handleDelete = (item) => {
        setDeleteModal(true);
        setSelectedCard(item);
    };
    const handleDeleteItem = async () => {
        const updatedFeatures = data.filter(journal => journal.blogID?._id !== selectedCard.blogID?._id)
            .map(event => ({
                blogID: event.blogID?._id,
                position: event.position
            }));

        const payload = {
            isVisible: data[0].blogID?.isVisible,
            journals: updatedFeatures,
        };
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/journal`, JSON.stringify(payload),config);
        fetchHomepageSections();
    };

    const headers = ["Position", "Blog Name", "Description", "Image", "Actions"];
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${header === "Position" || header === "Actions"
                                    ? "w-[10%]"
                                    : header === "Blog Name" || header === "Description"
                                        ? "w-[30%]"
                                        : "w-[20%]"
                                    }`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data && data.length > 0 ? (data.map((journal, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%] text-center">
                                {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                                {journal.blogID?.blogName}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                                {journal.blogID?.description}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[50%]">
                                {journal.blogID?.featureImage}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleDelete(journal)} className="hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))):(
                        <div>No Journals selected</div>
                    )}
                </tbody>
            </table>
            {deleteModal && (
                <DeleteModal title="Delete Journal" isOpen={deleteModal} onClose={() => setDeleteModal(false)} handleDeleteItem={handleDeleteItem} />
            )}
        </div>
    );
}
