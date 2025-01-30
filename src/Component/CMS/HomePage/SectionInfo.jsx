import { useState } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import SwitchToggle from "./SwitchToggle";

export default function SectionInfo({ sectionInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(sectionInfo.title);
  const [showSection, setShowSection] = useState(sectionInfo.showSection);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="px-6 py-4 relative w-[60%] shadow-md rounded-lg border border-gray-300">
      <button
        className="absolute top-1 right-1 text-gray-600 hover:text-gray-800"
        onClick={() => setIsEditing(!isEditing)}
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold">Section Title:</span>
          {isEditing ? (
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-40 border rounded p-1"
            />
          ) : (
            <span className="text-gray-900">{sectionTitle}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold">Show Section:</span>
          {isEditing ? (
            <SwitchToggle
              enabled={showSection} 
              onChange={setShowSection} 
            />
          ) : (
            <span className="text-gray-900">{showSection ? "Yes" : "No"}</span>
          )}
        </div>
        {isEditing && (
          <button onClick={handleSave} className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        )}
      </div>
    </div>
  );
}
