import React, { useState } from "react";
import PackageEditModal from "./PackageEditModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";
import PackageSection from "../../../../Page/CMS/Homepage/PackageSection";



export default function PackageContentTable({ data, fetchTourismSections }) {
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
    const updatedPackages = data.packages
      .filter((feature) => feature.position !== selectedCard.position)
      .map(({ _id, ...rest }) => rest);

    const reindexedPackages = updatedPackages.map((Package, index) => ({
      ...Package,
      position: index + 1,
    }));

    const payload = {
      sectionTitle: data.sectionTitle,
      isVisible: data.isVisible,
      packages: reindexedPackages,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Send API request
    await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/users/admin/tourism/packages`,
      JSON.stringify(payload),
      config
    );
     fetchTourismSections();
  };


  const headers = ["Position", "Location","Link","Images", "Actions"];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${
                  header === "Position" || header === "Actions" || header === "Link"
                    ? "w-[10%]"
                    : header === "Location"
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
          {data?.packages?.map((Package, index) => (
            <tr key={index} className="text-left">
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%] text-center">
                {Package?.position || index + 1}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                {Package?.locationName}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[30%]">
                {Package?.link }
              </td>

              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[50%] flex items-center">
                <div className="flex items-center gap-1 w-full">
                  {Package?.packageImages?.slice(0, 5)?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-8 h-8 object-cover"
                    />
                  ))}
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap w-[10%]">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleModifyData(Package)}
                    className="hover:text-blue-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(Package)}
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
          fetchTourismSections={fetchTourismSections}
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
