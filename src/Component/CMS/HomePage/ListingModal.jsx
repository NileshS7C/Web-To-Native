import React, { useState } from 'react';
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";

export default function ListingModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = async (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const requestOptions = {
            method: "GET",
            redirect: "follow"
          };
          
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/public/tournaments`, requestOptions)
        const result = await response.json();
        console.log(result)
        setFilteredData(result.data.tournaments);
    };

    const handleSelectItem = (item) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.some(selectedItem => selectedItem._id === item._id)) {
                // Remove item from selected list if already selected
                return prevSelected.filter(selectedItem => selectedItem._id !== item._id);
            } else {
                // Add item to selected list
                return [...prevSelected, item];
            }
        });
    };
    

    const handleSave = () => {
        console.log("Saved items: ", selectedItems);
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
                        <div className="flex gap-2 items-center justify-center">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="search-bar p-2 border rounded w-full"
                            />
                            <div className="buttons flex justify-between gap-2">
                                <button onClick={handleSave} className="save-button bg-green-500 text-white px-2 rounded">Save</button>
                                <button onClick={handleDiscard} className="discard-button bg-red-500 text-white p-2 rounded">Discard</button>
                            </div>
                        </div>
                        <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 min-h-[60vh] max-h-[60vh] justify-center">
                            {filteredData.length> 0 ? filteredData.map((item) => (
                                <div
                                    key={item.position}
                                    className={`item flex items-center gap-4 p-2 cursor-pointer ${selectedItems.some(selectedItem => selectedItem._id === item._id) ? 'bg-gray-200' : ''}`}
                                    onClick={() => handleSelectItem(item)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
                                        onChange={() => handleSelectItem(item)}
                                        className="checkbox"
                                    />
                                    <div className="item-details flex flex-row justify-between w-full text-left gap-4">
                                        <h4 className='w-[40%]'>{item.tournamentName}</h4>
                                        <p className='w-[40%]'>{item.ownerBrandName}</p>
                                        <p className='w-[10%]'>{item.startDate}</p>
                                        <p className='w-[10%]'>{item.endDate}</p>
                                    </div>
                                </div>
                            )
                        ):
                            <p>No Entries Logged</p>
                        }
                        </div>
                        {/* <div className="selected-items mt-4">
                            <h4>Selected Items:</h4>
                            {selectedItems.length === 0 ? (
                                <p>No items selected</p>
                            ) : (
                                <ul>
                                    {selectedItems.map(item => (
                                        <li key={item.position}>{item.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div> */}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
