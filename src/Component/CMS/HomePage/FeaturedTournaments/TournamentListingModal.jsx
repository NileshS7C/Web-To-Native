import React, { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export default function TournamentListingModal({ isOpen, onClose,fetchHomepageSections }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [tournamentSectionData, setTournamentSectionData] = useState();
    const [tournamentsData, setTournamentsData] = useState([]);

    const GetAllTournaments = async () => {
        try {
            const response = await fetch(`http://localhost:1234/api/admin/homepage-sections?section=tournament`, { method: "GET" });
            const result = await response.json();
            setTournamentSectionData(result);
            if (result.data?.length) {
                const allTournaments = result.data.flatMap(section => section.tournaments);
                setTournamentsData(allTournaments);
            }
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            GetAllTournaments();
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
            tournamentID: item.tournamentID._id,
            position: index,
        }));

        const payload = {
            sectionTitle: tournamentSectionData.data[0].sectionTitle,
            isVisible: tournamentSectionData.data[0].isVisible,
            tournaments: formattedData,
        };
        console.log("payload", payload)

        try {
            const response = await fetch(`http://localhost:1234/api/admin/homepage-sections/tournament`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('result', result);
            if (result.data?.length) {
                const allTournaments = result.data.flatMap(section => section.tournaments);
                setTournamentsData(allTournaments);
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
                        <div className="data-list overflow-y-auto my-4 flex flex-col gap-2 min-h-[60vh] max-h-[60vh] justify-center rounded-lg border border-gray-300">
                            {tournamentsData.length > 0 ? (
                                tournamentsData.map((item) => (
                                    <div
                                        key={item._id}
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
                                            <h4 className='w-[40%]'>{item.tournamentID.tournamentName}</h4>
                                            <p className='w-[40%]'>Owner ID: {item.tournamentID.ownerUserId}</p>
                                            <p className='w-[10%]'>{new Date(item.tournamentID.startDate).toLocaleDateString()}</p>
                                            <p className='w-[10%]'>{new Date(item.tournamentID.endDate).toLocaleDateString()}</p>
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
