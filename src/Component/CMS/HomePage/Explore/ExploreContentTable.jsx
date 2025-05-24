import React, { useEffect, useState } from "react";
import ExploreEditDataModal from "./ExploreEditDataModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

export default function ExploreContentTable({ data, fetchHomepageSections }) {
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
    const updatedFeatures = data.features
      .filter(feature => feature.title !== selectedCard.title)
      .map(({ _id, ...rest }) => rest);

    const reindexedFeatures = updatedFeatures.map((feature, index) => ({
      ...feature,
      position: index + 1,
    }));

    const payload = {
      sectionTitle: data.sectionTitle,
      isVisible: data.isVisible,
      features: reindexedFeatures,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Send API request
    await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/explore`, JSON.stringify(payload), config);
    fetchHomepageSections();
  };


  const headers = ["Position", "Image", "Title", "Link", "Actions"];

  return (
    <>
      {/* Table for md and up */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300 hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${header === "Position" || header === "Actions"
                    ? "w-[10%]"
                    : header === "Title"
                      ? "w-[25%]"
                      : header === "Image"
                        ? "w-[15%]"
                        : "w-[40%]"
                    }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data?.features?.map((explore, index) => (
              <tr key={index} className="text-left">
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%] text-center">
                  {explore.position}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {explore.image && (
                    <img 
                      src={explore.image} 
                      alt={explore.title} 
                      className="h-16 w-auto object-contain"
                    />
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[25%]">
                  {explore.title}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[40%]">
                  {explore.link}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleModifyData(explore)} className="hover:text-blue-600">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(explore)} className="hover:text-red-600">
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
        {data?.features?.map((explore, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 flex flex-col space-y-2 divide-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-500">Position</span>
              <span className="text-base text-gray-700">{explore.position}</span>
            </div>
            {explore.image && (
              <div className="pt-3 flex flex-col items-center">
                <span className="block text-base font-semibold text-gray-500 mb-2">
                  Image
                </span>
                <img 
                  src={explore.image} 
                  alt={explore.title} 
                  className="h-32 w-auto object-contain"
                />
              </div>
            )}
            <div className="flex justify-between items-center pt-3">
              <span className="block text-base font-semibold text-gray-500">Title</span>
              <span className="block text-base font-regular text-gray-500">{explore.title}</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="block text-base font-semibold text-gray-500">Link</span>
              <span className="block text-base text-blue-700 font-semibold underline break-all">{explore.link}</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <p className="block text-base font-semibold text-gray-500">Actions</p> 
              <div>
              <button onClick={() => handleModifyData(explore)} className="hover:text-blue-600">
                <PencilIcon className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(explore)} className="hover:text-red-600">
                <TrashIcon className="w-5 h-5" />
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openEditModal && (
        <ExploreEditDataModal
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
