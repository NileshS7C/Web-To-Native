import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function StaticPage({ PageData, handleSavePage, getPageData }) {
    const [pageDetails, setPageDetails] = useState({
        pageTitle: "Loading...",
        description: "Loading..."
    });
    const [originalPageDetails, setOriginalPageDetails] = useState({
        pageTitle: "Loading...",
        description: "Loading..."
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (PageData && PageData.pageTitle && PageData.description) {
            setPageDetails(PageData);
            setOriginalPageDetails(PageData); // Store original data for comparison
        }
    }, [PageData]);

    const handleSave = async () => {
        const hasChanged =
            pageDetails.pageTitle !== originalPageDetails.pageTitle ||
            pageDetails.description !== originalPageDetails.description;

        if (hasChanged) {
            await handleSavePage(pageDetails);
        }
        getPageData();
        // Stop editing mode
        setIsEditing(false);
    };

    const handleDiscard = () => {
        // Reset to the original values when discarding
        setPageDetails(originalPageDetails);
        setIsEditing(false);
    };

    return (
        <div className="mx-auto p-4 border rounded-lg shadow-md">
            {/* Heading with Edit, Save, and Discard Buttons */}
            {pageDetails.pageTitle !== "Loading..." ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        {/* Editable Title */}
                        {isEditing ? (
                            <input
                                type="text"
                                value={pageDetails.pageTitle}
                                onChange={(e) =>
                                    setPageDetails({ ...pageDetails, pageTitle: e.target.value })
                                }
                                className="text-2xl font-bold w-fit px-2 border "
                            />
                        ) : (
                            <h2 className="text-2xl font-bold w-fit px-2">{pageDetails.pageTitle}</h2>
                        )}

                        {/* Edit, Save, or Discard Buttons */}
                        {isEditing ? (
                            <div>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Editable Description */}
                    <ReactQuill
                        value={pageDetails.description} // Bind description to the editor
                        onChange={(value) => setPageDetails({ ...pageDetails, description: value })}
                        readOnly={!isEditing}
                        theme="snow"
                        className="bg-white"
                    />
                </>
            ) : (
                <p>Loading...</p> // Show loading state if data is not yet available
            )}
        </div>
    );
}
