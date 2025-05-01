import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Services/axios";


import MediaGallerySectionInfo from "../../../Component/CMS/TourismPages/MediaGallery/MediaGallerySectionInfo";
import MediaGalleryContentTable from "../../../Component/CMS/TourismPages/MediaGallery/MediaGalleryContentTable";
import MediaGalleryAddDataModal from "../../../Component/CMS/TourismPages/MediaGallery/MediaGalleryAddModal";


export default function MediaGallery() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaGalleryData,setMediaGalleryData]=useState([]);
    const fetchMediaGallerySection = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/users/admin/tourism?section=mediaGallery`,
          config
        );
        setMediaGalleryData(response.data.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      fetchMediaGallerySection();
    }, []);
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col gap-4">
          <div className="sm:flex-auto text-left">
            <h1 className="text-base font-semibold text-gray-900">
              Media Gallery
            </h1>
          </div>
          <div className="flex items-end justify-between w-full">
            <MediaGallerySectionInfo sectionInfo={mediaGalleryData} />
            <div className="flex justify-end">
              <button
                type="button"
                className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                onClick={() => setIsModalOpen(true)}
              >
                Add Media Gallery
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <MediaGalleryContentTable
                data={mediaGalleryData}
                fetchMediaGallerySections={fetchMediaGallerySection}
              />
            </div>
          </div>
        </div>

        {/* Pass isOpen and onClose to AddDataModal */}
        <MediaGalleryAddDataModal
          data={mediaGalleryData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fetchMediaGallerySections={fetchMediaGallerySection}
        />
      </div>
    );
}
