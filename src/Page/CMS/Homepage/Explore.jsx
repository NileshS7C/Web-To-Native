import React, { useState } from "react";
import AddDataModal from "../../../Component/CMS/HomePage/AddDataModal";
import ContentTable from "../../../Component/CMS/HomePage/ContentTable";
import SectionInfo from "../../../Component/CMS/HomePage/SectionInfo";

const people = [
    { position: "1", title: "Learn", description: "Explore curated Picklebay content", redirect: "https://google.com" },
    { position: "2", title: "Games", description: "Create and join community games", redirect: "https://google.com" },
];

export default function Explore() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Create an object to hold section info values
    const sectionInfo = {
        title: "Sample Title", // default section title
        showSection: true, // default state for showing section
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">Explore Picklebay</h1>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <SectionInfo sectionInfo={sectionInfo} />
                    <div className="w-[40%] flex justify-end">
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
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <ContentTable data={people} />
                    </div>
                </div>
            </div>

            {/* Pass isOpen and onClose to AddDataModal */}
            <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
