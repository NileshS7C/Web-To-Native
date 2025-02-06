import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import NewsDeleteModal from "./NewsDeleteModal";
import NewsEditDataModal from "./NewsEditDataModal";

export default function NewsContentTable({ data, fetchHomepageSections }) {
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
        "Title",
        "Date",
        "Link",
        "Actions"
    ];
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${header === "Position" || header === "Actions"
                                ? "w-[10%]"
                                : header === "Title" || header === "Link"
                                    ? "w-[30%]"
                                    : "w-[20%]"
                                }`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.news?.map((item, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {item.title}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {item.date}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {item.link}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleModifyData(item)} className="hover:text-blue-600">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item)} className="hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openEditModal && (
                <NewsEditDataModal
                    data={data}
                    selectedCard={selectedCard}
                    isOpen={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    fetchHomepageSections={fetchHomepageSections}
                />
            )}
            {deleteModal && (
                <NewsDeleteModal
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
