import React, { useState } from "react";

export default function DestinationDinkContentTable({ data, fetchHomepageSections }) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleModifyData = () => {
        setOpenEditModal(true);
        setSelectedCard(data);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4 max-w-md mx-auto">
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900">{data.MobileBannerImage}</h2>
                <a
                    href={data.link}
                    className="block text-blue-600 hover:underline mt-2"
                >
                    URL : {data.link}
                </a>
                <img
                    src={data.DesktopBannerImage}
                    alt={data.MobileBannerImage}
                    className="w-full h-40 object-cover rounded-md"
                />
                <img
                    src={data.MobileBannerImage}
                    alt={data.MobileBannerImage}
                    className="w-full h-40 object-cover rounded-md"
                />
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleModifyData}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
