import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import NewsEditDataModal from "./NewsEditDataModal";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

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
    const handleDeleteItem = async () => {
        const updatedFeatures = data.news.filter(item => item.title !== selectedCard.title);

        const payload = {
            sectionTitle: data.sectionTitle,
            isVisible: data.isVisible,
            news: updatedFeatures,
        };
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/news`, JSON.stringify(payload),config);
        fetchHomepageSections();
    };
    const headers = [
        "Position",
        "Image",
        "Title",
        "Date",
        "Link",
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
                                : header === "Title" || header === "Link"
                                    ? "w-[25%]"
                                    : header === "Image"
                                        ? "w-[15%]"
                                        : "w-[15%]"
                                }`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.news?.length > 0 ? data?.news?.map((item, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500">
                                {item.image && (
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="h-16 w-auto object-contain"
                                    />
                                )}
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
                    )):(
                        <tr>
                            <td colSpan={headers.length} className="text-center py-4">
                                No news to show
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Cards for mobile */}
        <div className="block md:hidden space-y-4">
            {data?.news?.length > 0 ? (
                data.news.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 flex flex-col space-y-2 divide-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-500">
                                Position
                            </span>
                            <span className="text-base text-gray-700">{index + 1}</span>
                        </div>
                        {item.image && (
                            <div className="pt-3 flex flex-col items-center">
                                <span className="block text-base font-semibold text-gray-500 mb-2">
                                    Image
                                </span>
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="h-32 w-auto object-contain"
                                />
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">
                                Title
                            </span>
                            <span className="block text-base font-regular text-gray-500">
                                {item.title}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <span className="block text-base font-semibold text-gray-500">
                                Date
                            </span>
                            <span className="block text-base font-regular text-gray-500">
                                {item.date}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 gap-2">
                            <span className="block text-base font-semibold text-gray-500">
                                Link
                            </span>
                            <span className="block text-base font-regular text-blue-700 underline break-all text-right">
                                {item.link}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3">
                            <p className="block text-base font-semibold text-gray-500">
                                Actions
                            </p>
                            <div>
                                <button
                                    onClick={() => handleModifyData(item)}
                                    className="hover:text-blue-600"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="hover:text-red-600"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-4 text-gray-500">
                    No news to show
                </div>
            )}
        </div>
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
            <DeleteModal title="Delete News" isOpen={deleteModal} onClose={() => setDeleteModal(false)} handleDeleteItem={handleDeleteItem} />
        )}
        </>
    );
}
