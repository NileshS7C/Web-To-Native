import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import DeleteModal from "../DeleteModal";
import axiosInstance from "../../../../Services/axios";
export default function JournalContentTable({
  data,
  fetchHomepageSections,
  handleEdit,
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const handleDelete = (item) => {
    setDeleteModal(true);
    setSelectedCard(item);
  };
  const handleDeleteItem = async () => {
    const updatedFeatures = data
      .filter((journal) => journal.blogID?._id !== selectedCard.blogID?._id)
      .map((event) => ({
        blogID: event.blogID?._id,
        position: event.position,
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
    await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/journal`,
      JSON.stringify(payload),
      config
    );
    fetchHomepageSections();
  };

  const headers = ["Position", "Blog Name", "Image", "Actions"];
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
                  className={`px-3 py-2 text-left text-sm font-semibold text-gray-900 ${
                    header === "Position" || header === "Actions"
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
            {data && data.length > 0 ? (
              data.map((journal, index) => (
                <tr key={index} className="text-left">
                  <td className="px-3 py-4 text-sm text-gray-500 w-[10%] text-center">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 w-[20%]">
                    {journal.blogID?.blogName}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 w-[30%]">
                    {journal.blogID?.featureImage}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 w-[10%]">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(journal)}
                        className="hover:text-blue-600"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(journal)}
                        className="hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No Journals selected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="block md:hidden space-y-4">
        {data && data.length > 0 ? (
          data.map((journal, index) => (
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
              <div className="flex justify-between items-center pt-3">
                <span className="block text-base font-semibold text-gray-500">
                  Blog Name
                </span>
                <span className="block text-base font-regular text-gray-500">
                  {journal.blogID?.blogName}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="block text-base font-semibold text-gray-500">
                  Image
                </span>
                {journal.blogID?.featureImage ? (
                  <img
                    src={journal.blogID?.featureImage}
                    alt="Journal"
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="block text-base font-regular text-gray-500">
                    No Image
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-3">
                <p className="block text-base font-semibold text-gray-500">
                  Actions
                </p>
                <div>
                  <button
                    onClick={() => handleEdit(journal)}
                    className="hover:text-blue-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(journal)}
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
            No Journals selected
          </div>
        )}
      </div>

      {deleteModal && (
        <DeleteModal
          title="Delete Journal"
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          handleDeleteItem={handleDeleteItem}
        />
      )}
    </>
  );
}
