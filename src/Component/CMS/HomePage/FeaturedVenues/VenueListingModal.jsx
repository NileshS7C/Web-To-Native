import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axiosInstance from '../../../../Services/axios';

export default function VenueListingModal({ venuesCMSData, isOpen, onClose,fetchHomepageSections }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [venueSectionData, setVenueSectionData] = useState();
    const [venuesData, setVenuesData] = useState([]);

    const GetAllVenues = async () => {
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/players/venues`, config);
            console.log('venues',response.data.data)
            setVenueSectionData(response);
            setVenuesData(response.data.data.data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            GetAllVenues();
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
            venueID: item._id,
            position: index,
        }));

        const payload = {
            sectionTitle: venuesCMSData.sectionTitle,
            isVisible: venuesCMSData.isVisible,
            venues: formattedData,
        };

        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
            const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/venues`, JSON.stringify(payload),config);
            if (response.data?.data?.length) {
                const allVenues = response.data.data.flatMap(section => section.venues);
                setVenuesData(allVenues);
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
                    <DialogPanel className="modal-content w-[70%] mx-auto p-4 bg-white rounded-lg">
                        <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 min-h-[60vh] max-h-[60vh] rounded-lg border border-gray-300 p-2">
                            {venuesData?.length > 0 ? (
                                venuesData.map((item,index) => (
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
                                            className="checkbox"
                                        />
                                        <div className="items-center flex flex-row justify-between w-full text-left gap-4">
                                        <p className='w-[10%]'>{index + 1}</p>
                                            <h4 className='w-[40%]'>{item.name}</h4>
                                            <p className='w-[40%] line-clamp-1'>{item.handle}</p>
                                            <p className='w-[10%]'>{item.address.city}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No tournaments available</p>
                            )}
                        </div>

                        <div className="modal-footer flex justify-end gap-2">
                            <button onClick={handleDiscard} className="px-4 py-2 bg-gray-400 rounded-md">Discard</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
