import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { uploadImage, deleteUploadedImage } from "../../redux/Upload/uploadActions";
import { useDispatch } from "react-redux";
import { imageUpload } from "../../Assests";

const SponsorTable = ({ disabled = false, onChange = () => { }, data = [] }) => {
  const dispatch = useDispatch();

  const [sponsors, setSponsors] = useState([
    { sponsorName: "", sponsorImage: "", errors: {} },
  ]);
  const [uploadingIndex, setUploadingIndex] = useState(null); // Track which sponsor is uploading
  const [uploadErrors, setUploadErrors] = useState({});        // Track upload errors by index

  // Initialize with data prop
  useEffect(() => {
    if (data && data.length > 0) {
      setSponsors(data.map(sponsor => ({
        ...sponsor,
        errors: {}
      })));
    }
  }, [data]);

  // Validation function for individual sponsor
  const validateSponsor = (sponsor) => {
    const errors = {};
    const hasName = sponsor.sponsorName.trim();
    const hasImage = sponsor.sponsorImage;

    // If either field has content, both are required
    if (hasName || hasImage) {
      if (!hasName) {
        errors.sponsorName = "Sponsor name is required when image is provided";
      }
      if (!hasImage) {
        errors.sponsorImage = "Sponsor image is required when name is provided";
      }
    }

    return errors;
  };

  useEffect(() => {
    // Validate all sponsors and update errors
    const validatedSponsors = sponsors.map(sponsor => ({
      ...sponsor,
      errors: validateSponsor(sponsor)
    }));

    setSponsors(validatedSponsors);

    // Only send sponsors that have both name and image (valid sponsors)
    // Remove the 'errors' field before sending to parent
    const validSponsors = validatedSponsors
      .filter((s) =>
        s.sponsorName.trim() && s.sponsorImage &&
        Object.keys(s.errors).length === 0
      )
      .map(({ errors, ...sponsor }) => sponsor); // Remove errors field

    onChange(validSponsors);
  }, [sponsors.map(s => s.sponsorName + s.sponsorImage).join(',')]);

  const handleAddSponsor = () => {
    setSponsors([...sponsors, { sponsorName: "", sponsorImage: "", errors: {} }]);
  };

  const handleDelete = async (index) => {
    const img = sponsors[index]?.sponsorImage;
    if (img) {
      try {
        await dispatch(deleteUploadedImage(img)).unwrap();
        console.log("Image deleted successfully:", img);
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert("Failed to delete image. Please try again.");
        return; // Don't proceed with deletion if image deletion failed
      }
    }
    const updated = sponsors.filter((_, i) => i !== index);
    setSponsors(updated.length ? updated : [{ sponsorName: "", sponsorImage: "", errors: {} }]);
  };

  const handleChange = (index, key, value) => {
    const updated = sponsors.map((s, i) => {
      if (i === index) {
        const updatedSponsor = { ...s, [key]: value };
        // Clear errors when user starts typing/uploading
        if (key === 'sponsorName' && value.trim()) {
          delete updatedSponsor.errors.sponsorName;
        }
        if (key === 'sponsorImage' && value) {
          delete updatedSponsor.errors.sponsorImage;
        }
        return updatedSponsor;
      }
      return s;
    });
    setSponsors(updated);
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    const newErrors = { ...uploadErrors };

    if (!file?.type?.startsWith("image/")) {
      newErrors[index] = "Only image files are allowed.";
      setUploadErrors(newErrors);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      newErrors[index] = "File must be less than 5MB.";
      setUploadErrors(newErrors);
      e.target.value = "";
      return;
    }

    setUploadingIndex(index);
    delete newErrors[index];
    setUploadErrors(newErrors);

    try {
      const result = await dispatch(uploadImage(file)).unwrap();
      const url = result.data.url;
      handleChange(index, "sponsorImage", url);
    } catch (err) {
      newErrors[index] = err?.data?.message || "Upload failed.";
      setUploadErrors(newErrors);
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
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
                  <div className="flex flex-col gap-1">
                    <div className="relative flex items-center gap-2">
                      <img
                        src={sponsor.sponsorImage || imageUpload}
                        className="w-8 h-8"
                        alt="sponsor"
                      />
                      {!disabled && (
                        <>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e, index)}
                            className="absolute w-8 h-8 opacity-0 cursor-pointer"
                          />
                          {uploadingIndex === index && (
                            <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center bg-white/60 rounded">
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {(sponsor.errors?.sponsorImage || uploadErrors[index]) && (
                      <div className="text-sm text-[#FF3333] text-left mt-2">
                        {sponsor.errors?.sponsorImage || uploadErrors[index]}
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-2">
                  <div className="flex flex-col gap-1">
                    <input
                      value={sponsor.sponsorName}
                      onChange={(e) =>
                        handleChange(index, "sponsorName", e.target.value)
                      }
                      className="w-[80%] px-[10px] border border-[#DFEAF2] rounded-[10px] h-[40px]"
                      placeholder="Enter Sponsor Name"
                      disabled={disabled}
                    />
                    {sponsor.errors?.sponsorName && (
                      <div className="text-sm text-[#FF3333]">
                        {sponsor.errors.sponsorName}
                      </div>
                    )}
                  </div>
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
