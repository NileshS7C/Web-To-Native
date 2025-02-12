import React, { useState } from "react";
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
    const myHeaders = new Headers({
      "Content-Type": "application/json",
    });

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
    await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/explore`,JSON.stringify(payload),config);
    fetchHomepageSections();
  };


  const headers = ["Position", "Title", "Link", "Actions"];

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
                  : header === "Title"
                    ? "w-[30%]"
                    : "w-[50%]"
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
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                {explore.title}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[50%]">
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
      {openEditModal && (
        <ExploreEditDataModal
          data={selectedCard}
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
    </div>
  );
}
