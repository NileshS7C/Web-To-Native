import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { imageUpload } from "../../Assests";

const SponsorTable = ({ disabled = false, onChange = () => {} }) => {
  const dispatch = useDispatch();

  const [sponsors, setSponsors] = useState([
    { sponsorName: "", sponsorImage: "" },
  ]);

  useEffect(() => {
    onChange(sponsors.filter((s) => s.sponsorName && s.sponsorImage)); // only send valid
  }, [sponsors]);

  const handleAddSponsor = () => {
    setSponsors([...sponsors, { sponsorName: "", sponsorImage: "" }]);
  };

  const handleDelete = (index) => {
    const img = sponsors[index]?.sponsorImage;
    if (img) dispatch(deleteUploadedImage(img));
    const updated = sponsors.filter((_, i) => i !== index);
    setSponsors(updated.length ? updated : [{ sponsorName: "", sponsorImage: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updated = sponsors.map((s, i) =>
      i === index ? { ...s, [key]: value } : s
    );
    setSponsors(updated);
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB.");
      return;
    }

    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const url = result.data.url;
      handleChange(index, "sponsorImage", url);
    } catch (err) {
      alert(err?.data?.message || "Upload failed.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2.5 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-base text-[#232323] justify-self-start font-medium">Sponsors</p>
        <button
          type="button"
          onClick={handleAddSponsor}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          disabled={disabled}
        >
          Add Sponsor
        </button>
      </div>

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
                    {!disabled && (
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, index)}
                        className="absolute w-8 h-8 opacity-0 cursor-pointer"
                      />
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <input
                    value={sponsor.sponsorName}
                    onChange={(e) =>
                      handleChange(index, "sponsorName", e.target.value)
                    }
                    className="w-[80%] px-[10px] border border-[#DFEAF2] rounded-[10px] h-[40px]"
                    placeholder="Enter Sponsor Name"
                    disabled={disabled}
                  />
                </td>
                <td className="p-2">
                  {!disabled && (
                    <div className="flex gap-4">
                      <RiDeleteBin6Line
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorTable;
