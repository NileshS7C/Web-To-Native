import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosInstance from '../../../../Services/axios';

export default function JournalAddDataModal({ data,isOpen, onClose, fetchHomepageSections }) {
    const [selectedItems, setSelectedItems] = useState([]);
    // const [journalSectionData, setJournalSectionData] = useState();
    const [journalsData, setJournalsData] = useState([]);

    const GetAllJournals = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/public/blogs`, config);
            // setJournalSectionData(response);
            setJournalsData(response.data.data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            GetAllJournals();
        }
    }, [isOpen]);

    const handleSelectItem = (item) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.some(selectedItem => selectedItem._id === item._id)) {
                return prevSelected.filter(selectedItem => selectedItem._id !== item._id);
            } else {
                return [...prevSelected, item];
            }
        });
    };

    const handleSave = async () => {

        const formattedData = selectedItems.map((item, index) => ({
            blogID: item._id,
            position: index,
        }));

        const payload = {
            isVisible: data.isVisible,
            journals: formattedData,
        };

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/journal`, JSON.stringify(payload), config);
            if (response.data?.data?.length) {
                const allJournals = response.data.data.flatMap(section => section.journals);
                setJournalsData(allJournals);
            }
        } catch (error) {
            console.error("Error updating tournaments:", error);
        }
        fetchHomepageSections();
        onClose();
    };

    const handleDiscard = () => {
        setSelectedItems([]);
        onClose();
    };
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel className="modal-content w-[95%] sm:w-[70%] mx-auto p-4 bg-white rounded-lg">
                        <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 min-h-[60vh] max-h-[60vh] rounded-lg border border-gray-300 p-2">
                            {journalsData.length > 0 ? (
                               <>
                               {/* Desktop View */}
                               <div className="hidden md:flex md:flex-col md:gap-2">
                                   {journalsData.map((item) => (
                                       <div
                                           key={item._id}
                                           className={`item flex items-center gap-4 p-3 border border-gray-300 rounded-md cursor-pointer transition-all 
                                           ${selectedItems.some(selectedItem => selectedItem._id === item._id) ? 'bg-blue-100 border-[#1570EF]' : 'hover:bg-gray-100'}`}
                                           onClick={() => handleSelectItem(item)}
                                       >
                                           <input
                                               type="checkbox"
                                               checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
                                               onChange={() => handleSelectItem(item)}
                                               className="checkbox accent-blue-500"
                                           />
                                           <div className="item-details flex flex-row justify-between w-full text-left gap-4">
                                               <h4 className='w-[20%] font-medium line-clamp-1'>{item.blogName}</h4>
                                               <p className='w-[40%] text-gray-600 line-clamp-1'>{item.description}</p>
                                               <p className='w-[40%] text-gray-600 line-clamp-1'>{item.featureImage}</p>
                                           </div>
                                       </div>
                                   ))}
                               </div>

                               {/* Mobile View */}
                               <div className="md:hidden flex flex-col gap-3">
                                   {journalsData.map((item) => (
                                       <div
                                           key={item._id}
                                           className={`flex flex-col bg-white rounded-xl shadow-sm border ${
                                               selectedItems.some(selectedItem => selectedItem._id === item._id)
                                                   ? 'border-[#1570EF] bg-blue-50'
                                                   : 'border-gray-200'
                                           }`}
                                           onClick={() => handleSelectItem(item)}
                                       >
                                           <div className="flex items-center justify-between px-3 py-3">
                                               <div className="flex items-center gap-2 w-full overflow-hidden">
                                                   <input
                                                       type="checkbox"
                                                       checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
                                                       onChange={() => handleSelectItem(item)}
                                                       className="checkbox accent-blue-500 h-4 w-4 flex-shrink-0"
                                                   />
                                                   <h4 className="font-medium text-[#2B2F38] truncate">{item.blogName}</h4>
                                               </div>
                                           </div>
                                           
                                           <div className="flex flex-col divide-y divide-gray-100">
                                               <div className="flex justify-between items-center gap-2 px-3 py-2">
                                                   <span className="text-sm font-medium text-black">Description:</span>
                                                   <span className="text-sm text-gray-600 text-right truncate max-w-[60%]">{item.description}</span>
                                               </div>
                                               
                                               <div className="flex justify-between items-center gap-2 px-3 py-2">
                                                   <span className="text-sm font-medium text-black">Image URL:</span>
                                                   <span className="text-sm text-gray-600 truncate max-w-[60%]">{item.featureImage}</span>
                                               </div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No Journals available</p>
                            )}
                        </div>

                        <div className="modal-footer flex justify-end gap-2 mt-4">
                            <button onClick={handleDiscard} className="px-3 sm:px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors">
                                Discard
                            </button>
                            <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                Save
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
