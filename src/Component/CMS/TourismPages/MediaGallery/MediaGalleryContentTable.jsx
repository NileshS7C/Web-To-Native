import React, { useState } from "react";
import PackageEditModal from "./MediaGalleryEditModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";

export default function MediaGalleryContentTable({ data, fetchMediaGallerySections }) {
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
    const updatedMediaGallery = data.mediaGallery
      .filter((gallery) => gallery.description !== selectedCard.description)
      .map(({ _id, ...rest }) => rest);

    const reindexedMediaGallery = updatedMediaGallery.map(
      (mediaGallery, index) => ({
        ...mediaGallery,
        position: index + 1,
      })
    );

    const payload = {
      sectionTitle: data.sectionTitle,
      isVisible: data.isVisible,
      mediaGallery: reindexedMediaGallery,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Send API request
    await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/users/admin/tourism/mediaGallery`,
      JSON.stringify(payload),
      config
    );
    fetchMediaGallerySections();
  };

  const headers = ["Position", "Location", "Image", "Actions"];
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
          {data?.mediaGallery?.map((gallery, index) => (
            <tr key={index} className="text-left">
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%] text-center">
                {gallery?.position || "temp"}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%] ">
                {gallery?.description || "temp"}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[50%]">
                <img
                  key={index}
                  src={gallery?.image}
                  alt={`Image ${index + 1}`}
                  className="w-10 h-10 object-cover"
                />
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleModifyData(gallery)}
                    className="hover:text-blue-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(gallery)}
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
        <PackageEditModal
          data={data}
          selectedCard={selectedCard}
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          fetchMediaGallerySections={fetchMediaGallerySections}
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
