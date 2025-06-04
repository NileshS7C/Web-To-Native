import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions"; // update path
import { useDispatch } from "react-redux";
import { imageUpload } from "../../Assests";
import Button from "../Common/Button";

const SponsorTable = ({ disabled, onChange }) => {
  const dispatch = useDispatch();
  const [sponsors, setSponsors] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [tempImage, setTempImage] = useState("");
  const [tempName, setTempName] = useState("");

  const handleFileUpload = async (e, onSuccess) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File should be less than 5 MB.");
      return;
    }

    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const url = result.data.url;
      onSuccess?.(url);
    } catch (err) {
      alert(err?.data?.message || "Upload failed.");
    }
  };

  const handleAddSponsor = () => {
    if (!tempName || !tempImage) return;

    const newSponsor = { sponsorName: tempName, sponsorImage: tempImage };
    const updated = [...sponsors, newSponsor];
    setSponsors(updated);
    onChange?.(updated);

    setTempName("");
    setTempImage("");
  };

  const handleDelete = (index) => {
    const img = sponsors[index]?.sponsorImage;
    dispatch(deleteUploadedImage(img));
    const updated = sponsors.filter((_, i) => i !== index);
    setSponsors(updated);
    onChange?.(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleEditChange = (key, value) => {
    const updated = [...sponsors];
    updated[editIndex][key] = value;
    setSponsors(updated);
    onChange?.(updated);
  };

  return (
    <div className="grid grid-cols-1 gap-2.5 w-full">
      <p className="text-base text-[#232323] justify-self-start">Sponsors</p>

      <div className="overflow-x-auto rounded-md w-full">
        <table className="border border-[#EAECF0] rounded-[8px] table-auto min-w-[700px] w-full">
          <thead>
            <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b h-[44px]">
              <th className="text-left p-2">S.No.</th>
              <th className="text-left p-2">Sponsor Logo</th>
              <th className="text-left p-2">Sponsor Name</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor, index) => (
              <tr key={index} className="text-sm text-[#667085]">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div className="relative flex items-center gap-2">
                    <img
                      src={sponsor.sponsorImage || imageUpload}
                      className="w-8 h-8"
                      alt="sponsor"
                    />
                    {editIndex === index && !disabled && (
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileUpload(e, (url) =>
                            handleEditChange("sponsorImage", url)
                          )
                        }
                        className="absolute w-8 h-8 opacity-0 cursor-pointer"
                      />
                    )}
                  </div>
                </td>
                <td className="p-2">
                  {editIndex === index && !disabled ? (
                    <input
                      value={sponsor.sponsorName}
                      onChange={(e) =>
                        handleEditChange("sponsorName", e.target.value)
                      }
                      className="w-[80%] px-[10px] border border-[#DFEAF2] rounded-[10px] h-[40px]"
                    />
                  ) : (
                    sponsor.sponsorName
                  )}
                </td>
                <td className="p-2">
                  {!disabled && (
                    <div className="flex gap-4">
                      <RiDeleteBin6Line
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                      <MdOutlineModeEditOutline
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleEdit(index)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {/* Add Row */}
            {!disabled && (
              <tr className="text-sm text-[#667085]">
                <td className="p-2">{sponsors.length + 1}</td>
                <td className="p-2">
                  <div className="relative flex items-center gap-2">
                    <img
                      src={tempImage || imageUpload}
                      className="w-8 h-8"
                      alt="temp sponsor"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setTempImage(url))
                      }
                      className="absolute w-8 h-8 opacity-0 cursor-pointer"
                      disabled={disabled}
                    />
                  </div>
                </td>
                <td className="p-2">
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-[80%] px-[10px] border border-[#DFEAF2] rounded-[10px] h-[40px]"
                    placeholder="Enter Sponsor Name"
                    disabled={disabled}
                  />
                </td>
                <td className="p-2">
                  <Button
                    className="w-[60px] h-[40px] rounded-[8px] text-white"
                    onClick={handleAddSponsor}
                    disabled={disabled}
                  >
                    ADD
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorTable;
