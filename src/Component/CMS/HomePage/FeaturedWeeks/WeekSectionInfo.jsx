import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import SwitchToggle from "../SwitchToggle";

export default function WeekSectionInfo({ sectionInfo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [sectionDetails, setSectionDetails] = useState([]);

    useEffect(() => {
        setSectionDetails(sectionInfo);
    }, [sectionInfo])

    const handleSave = async () => {
        setIsEditing(false);
        const hasChanged = sectionDetails.sectionTitle !== sectionInfo.sectionTitle || sectionDetails.isVisible !== sectionInfo.isVisible;
        if (!hasChanged) {
            console.log("No changes detected. API call skipped.");
            return;
        }
        const { _id, updatedAt, sectionType, ...updatedSectionDetails } = sectionDetails;
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections/featuredThisWeek`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedSectionDetails),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Update successful:", result);
        } catch (error) {
            console.error("Error updating section:", error);
        }
    };

    return (
        <div className="px-8 py-4 relative w-fit shadow-md rounded-lg border border-gray-300 bg-white">
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsEditing(!isEditing)}
            >
                <PencilIcon className="w-4 h-4" />
            </button>
            <div className="space-y-2">
                <div className="flex justify-between items-center gap-20">
                    <span className="text-gray-700 font-semibold">Section Title:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={sectionDetails?.sectionTitle}
                            onChange={(e) =>
                                setSectionDetails({ ...sectionDetails, sectionTitle: e.target.value })
                            }
                            className="w-40 border rounded p-1"
                        />
                    ) : (
                        <span className="text-gray-900">{sectionDetails?.sectionTitle}</span>
                    )}
                </div>
                <div className="flex justify-between items-center gap-20">
                    <span className="text-gray-700 font-semibold">Show Section:</span>
                    {isEditing ? (
                        <SwitchToggle
                            enabled={sectionDetails?.isVisible}
                            onChange={(value) =>
                                setSectionDetails({ ...sectionDetails, isVisible: value })
                            }
                        />
                    ) : (
                        <span className="text-gray-900">{sectionDetails?.isVisible ? "Yes" : "No"}</span>
                    )}
                </div>
                {isEditing && (
                    <button
                        onClick={handleSave}
                        className="w-full mt-2 bg-blue-500 text-white p-2 rounded"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
}
