import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Services/axios";
import PackageSectionInfo from "../../../Component/CMS/TourismPages/PackagesSection/PackageSectionInfo";
import PackageContentTable from "../../../Component/CMS/TourismPages/PackagesSection/PackageContentTable";
import PackageAddDataModal from "../../../Component/CMS/TourismPages/PackagesSection/PackageAddModal";



export default function PackageSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packageData,setPackageData]=useState([])
    
    const fetchPackages=async()=>{
        try{
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const response = await axiosInstance.get(
              `${
                import.meta.env.VITE_BASE_URL
              }/users/admin/tourism?section=packages`,
              config
            );
            setPackageData(response?.data?.data[0] || {});
        }catch(error){
            console.error(error);
        }
    }
    useEffect(() => {
     fetchPackages();
    }, []);
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col gap-4">
          <div className="sm:flex-auto text-left">
            <h1 className="text-base font-semibold text-gray-900">
              Package Section
            </h1>
          </div>
          <div className="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4 mt-2">
            <PackageSectionInfo sectionInfo={packageData} />
            <div className="flex justify-end">
              <button
                type="button"
                className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                onClick={() => setIsModalOpen(true)}
              >
                Add Package
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <PackageContentTable
                data={packageData}
                fetchTourismSections={fetchPackages}
              />
            </div>
          </div>
        </div>

        {/* Pass isOpen and onClose to AddDataModal */}
        <PackageAddDataModal
          data={packageData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fetchTourismSections={fetchPackages}
        />
      </div>
    );
}
