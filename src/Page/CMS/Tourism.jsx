import React, { useEffect, useState } from "react";
import TourismContentTable from "../../Component/CMS/TourismPages/Tourism/TourismContentTable";
import axiosInstance from "../../Services/axios";
import TourismAddDataModal from "../../Component/CMS/TourismPages/Tourism/TourismAddDataModal";

export default function Tourism() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourismData, setTourismData] = useState([]);
  const fetchTourismSection = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/cms-sections?section=tourism`,
        config
      );
      setTourismData(response.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTourismSection();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col gap-4">
        <div className="sm:flex-auto text-left flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Tourism Pages</h1>
          <div className="flex justify-end">
            <button
              type="button"
              className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
              onClick={() => setIsModalOpen(true)}
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
            <TourismContentTable
              data={tourismData}
              fetchHomepageSections={fetchTourismSection}
              onEdit={(card) => {
                setSelectedCard(card);
                setIsEditModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Pass isOpen and onClose to AddDataModal */}
      <TourismAddDataModal
        data={tourismData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchHomepageSections={fetchTourismSection}
      />
    </div>
  );
}
