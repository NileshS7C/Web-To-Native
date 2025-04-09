import React, { useState } from "react";
// import ExploreEditDataModal from "./ExploreEditDataModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
// import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";
import TourismEditDataModal from "./TourismEditDataModal";
import DeleteModal from "../../HomePage/DeleteModal";

export default function TourismContentTable({ data, fetchHomepageSections }) {
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
    try {
      if (!selectedCard || !selectedCard.image) {
        console.error("No selected card or image found for deletion.");
        return;
      }
  
      const updatedTourism = data.tourism
        .filter((card) => card.image !== selectedCard.image)
        .map(({ package: pkg, image }) => ({
          package: pkg,
          image,
        }));
  
      const payload = {
        sectionTitle: data.sectionTitle,
        isVisible: data.isVisible,
        tourism: updatedTourism,
      };
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/cms-sections/tourism`,
        JSON.stringify(payload),
        config
      );
  
      setDeleteModal(false);
      fetchHomepageSections();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  
  
  const headers = ["Position", "Title", "Image", "Actions"];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${
                  header === "Position" || header === "Actions"
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
          {data?.tourism?.map((explore, index) => (
            <tr key={index} className="text-left">
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%] text-center">
                {index + 1}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                {explore.package}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[50%]">
                {explore.image}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleModifyData(explore)}
                    className="hover:text-blue-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(explore)}
                    className="hover:text-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openEditModal && (
        <TourismEditDataModal
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
    </div>
  );
}
