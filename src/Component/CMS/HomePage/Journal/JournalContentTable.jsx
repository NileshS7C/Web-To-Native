import React, { useState } from "react";

export default function JournalContentTable({ data, fetchHomepageSections }) {
    // console.log('data', data);
    
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    
    const handleModifyData = (item) => {
        setOpenEditModal(true);
        setSelectedCard(item);
    };
    
    const headers = [
        "Position",
        "Title",
        "Description",
        "Image",
        "Actions"
    ];
    
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.map((journal, index) => (
                        <tr key={index} className="text-left">
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {journal.position}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {journal.title}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {journal.description}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {journal.image}
                            </td>
                            <td className="px-3 py-4 text-sm text-[#1570EF] whitespace-nowrap">
                                <a href="#" className="hover:text-[#1570EF]" onClick={() => handleModifyData(tournament)}>
                                    Edit
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* {openEditModal && <EditDataModal data={selectedCard} isOpen={openEditModal} onClose={() => setOpenEditModal(false)} fetchHomepageSections={fetchHomepageSections}/>} */}
        </div>
    );
}
