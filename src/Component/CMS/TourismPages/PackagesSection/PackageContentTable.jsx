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
    <div className="bg-white rounded-lg shadow-lg border border-gray-300">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
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
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4 p-4">
          {data?.packages?.map((Package, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <span className="font-medium text-gray-900">Position: {Package?.position || index + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModifyData(Package)}
                    className="p-1 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(Package)}
                    className="p-1 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-3 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-start gap-5">
                  <span className="text-sm font-medium text-gray-500">Location :</span>
                  <span className="text-sm text-gray-900">{Package?.locationName}</span>
                </div>
                
                <div className="flex flex-row items-center justify-start gap-5">
                  <span className="text-sm font-medium text-gray-500">Link</span>
                  <span className="text-sm text-gray-900 break-all">{Package?.link}</span>
                </div>
                
                <div className="flex flex-row items-center justify-start gap-5">
                  <span className="text-sm font-medium text-gray-500">Images</span>
                  <div className="flex flex-wrap gap-2">
                    {Package?.packageImages?.slice(0, 5)?.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Image ${imgIndex + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
