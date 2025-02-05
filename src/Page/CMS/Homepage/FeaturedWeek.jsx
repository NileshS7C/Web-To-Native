import React, { useState, useEffect } from "react";
import WeekSectionInfo from "../../../Component/CMS/HomePage/FeaturedWeeks/WeekSectionInfo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function FeaturedWeek() {
    const [isEditing, setIsEditing] = useState(false);
    const [weekData, setWeekData] = useState({});
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");

    const fetchWeekData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections?section=featuredThisWeek`);
            const result = await response.json();
            const data = result.data[0];
            setWeekData(data);
            setHeading(data.heading);
            setSubHeading(data.subHeading);
            setButtonText(data.buttonText);
            setLink(data.link);
            setImage(data.image);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchWeekData(); }, []);
    const uploadImage = async (file) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM2MGNlNTcyMDg4OTk1OThhZTgwMSIsInBob25lIjoiMjIyMjIyMjIyMiIsIm5hbWUiOiJQcmF0aGFtIiwiaWF0IjoxNzM4MzE4MDE1LCJleHAiOjE3Mzg0MDQ0MTV9.gOFdNH3a-xSFUpdiAT8E7SUXcCgGc4caUMtSSrQRF50");

        const formdata = new FormData();
        formdata.append("uploaded-file", file);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/upload-file`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    const handleSave = async () => {
        try {
            let uploadImageUrl = image;
            if (typeof image === 'object' && image instanceof Blob) {
                const uploadedImage = await uploadImage(image);
                uploadImageUrl = uploadedImage?.url || image;
            }

            await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections/featuredThisWeek`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ heading, subHeading, buttonText, link, image: uploadImageUrl })
            });

            setIsEditing(false);
            fetchWeekData();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col gap-4">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-left text-gray-900">{weekData.sectionTitle}</h1>
                </div>
                <div className="flex items-end justify-between w-full">
                    <WeekSectionInfo sectionInfo={weekData} />
                    {!isEditing ? (
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button className="bg-green-500 text-white px-3 py-2 rounded" onClick={handleSave}>Save</button>
                            <button className="bg-gray-500 text-white px-3 py-2 rounded" onClick={() => setIsEditing(false)}>Discard</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 shadow-md rounded-lg border border-gray-300 bg-white py-4 px-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-left">Heading</label>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        disabled={!isEditing}
                    />
                    <label className="font-semibold text-left">Sub Heading</label>
                    <ReactQuill
                        value={subHeading}
                        onChange={setSubHeading}
                        readOnly={!isEditing}
                        theme="snow"
                        style={{
                            height: '32vh',
                            cursor: isEditing ? 'text' : 'not-allowed',
                            borderColor: '#e5e7eb',
                        }}
                    />

                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-left">Button Text</label>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        disabled={!isEditing}
                    />
                    <label className="font-semibold text-left">Link</label>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        disabled={!isEditing}
                    />
                    <div className="relative flex items-center gap-2">
                        {/* Image */}
                        <img src={image} alt="Preview" className="w-full h-40 object-cover rounded" />

                        {/* Upload Icon and Button */}
                        {isEditing && (
                            <div className="absolute right-0 top-0 flex flex-col gap-2">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="imageUpload"
                                    onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                                />
                                <label htmlFor="imageUpload" className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer">
                                    Upload
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
