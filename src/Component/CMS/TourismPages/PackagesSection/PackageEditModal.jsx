import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { IoIosCloseCircleOutline } from "react-icons/io";
import * as Yup from "yup";
import Spinner from "../../../../Page/CMS/Spinner";
import axiosInstance from "../../../../Services/axios";
import { packageImageSize } from "../../../../Constant/app";
import { useDispatch } from "react-redux";
import { uploadImage } from "../../../../redux/Upload/uploadActions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const PackageEditModal = ({
  data,
  selectedCard,
  isOpen,
  onClose,
  fetchTourismSections,
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) {
      setPreviews([]);
      setIsError(false);
      setErrorMessage("");
    } else if (selectedCard?.packageImages) {
      setPreviews(selectedCard.packageImages);
    } else {
      setPreviews([]);
    }
  }, [isOpen, selectedCard]);

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File should be a valid image type.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size should not exceed 5MB");
    }
  };

  const handleImageUpload = async (file, index) => {
    try {
      validateFile(file);
      setUploadingIndex(index);
      setIsError(false);
      setErrorMessage("");

      const result = await dispatch(uploadImage(file)).unwrap();
      const { url } = result?.data;
      
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = url;
        return newPreviews;
      });

      return url;
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "Failed to upload image");
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      throw error;
    } finally {
      setUploadingIndex(-1);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const newPackage = {
        locationName: values?.locationName,
        packageImages: values?.packageImages,
        description: values?.description,
        link: values?.link,
        linkText: values?.linkText,
        position: selectedCard?.position
      };

      const hasChanged = Object.keys(newPackage).some(
        (key) => newPackage[key] !== selectedCard[key]
      );

      if (!hasChanged) {
        setLoading(false);
        return;
      }

      const updatedPackages = data.packages.map((Package) =>
        Package.position === selectedCard.position ? newPackage : Package
      );

      const payload = {
        sectionTitle: selectedCard?.sectionTitle,
        isVisible: selectedCard?.isVisible,
        packages: updatedPackages
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/tourism/packages`,
        JSON.stringify(payload),
        config
      );

      fetchTourismSections();
      onClose();
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "Failed to update package");
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    locationName: Yup.string().required("Location Name is required"),
    description: Yup.string().required("Description is required"),
    packageImages: Yup.array()
      .min(1, "At least 1 image is required")
      .max(20, "You can upload up to 20 images")
      .required("Image is required"),
    link: Yup.string(),
    linkText: Yup.string(),
  });
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-auto max-h-[90vh] rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            {isError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <Formik
              initialValues={{
                locationName: selectedCard?.locationName || "",
                description: selectedCard?.description || "",
                packageImages: selectedCard?.packageImages || [],
                link: selectedCard?.link || "",
                linkText: selectedCard?.linkText || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, setFieldError }) => (
                <Form>
                  <div className="space-y-6">
                    <div className="border-b border-gray-900/10 pb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Edit Package
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-y-4">
                        {/* Title Input */}
                        <div>
                          <label
                            htmlFor="locationName"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Location
                          </label>
                          <Field
                            id="locationName"
                            name="locationName"
                            type="text"
                            placeholder="Enter location details.."
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                          />
                          <ErrorMessage
                            name="locationName"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Description
                          </label>
                          <Field
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Enter a description.."
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                          />
                          <ErrorMessage
                            name="description"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="link"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Button link
                          </label>
                          <Field
                            id="link"
                            name="link"
                            type="text"
                            placeholder="Enter a button link.."
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                          />
                          <ErrorMessage
                            name="link"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="linkText"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Button text
                          </label>
                          <Field
                            id="linkText"
                            name="linkText"
                            type="text"
                            placeholder="Enter a button text.."
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                          />
                          <ErrorMessage
                            name="linkText"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                        {/* Image Upload Input */}
                        <div>
                          <label
                            htmlFor="packageImages"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Upload Images
                          </label>

                          <div className="mt-2 relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                            <FieldArray name="packageImages">
                              {({ form, field, meta }) => (
                                <input
                                  {...field}
                                  id="packageImages"
                                  name="packageImages"
                                  onChange={async (event) => {
                                    const file = event.target.files[0];
                                    if (!file) return;

                                    try {
                                      const uploadIndex = previews.length;
                                      setPreviews((prev) => [
                                        ...prev,
                                        URL.createObjectURL(file),
                                      ]);

                                      const url = await handleImageUpload(file, uploadIndex);
                                      setFieldValue("packageImages", [
                                        ...values.packageImages,
                                        url,
                                      ]);
                                    } catch (error) {
                                      setFieldError(
                                        "packageImages",
                                        error.message
                                      );
                                    }
                                  }}
                                  value=""
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                                  disabled={uploadingIndex !== -1}
                                />
                              )}
                            </FieldArray>
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="text-sm text-gray-600">
                                <label
                                  htmlFor="packageImages"
                                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  <span>Upload images</span>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                (Recommended size: 500x700, Max size: 5MB)
                              </p>
                            </div>
                          </div>

                          <ErrorMessage
                            name="packageImages"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />

                          {/* Image Previews */}
                          <div className="flex gap-4 flex-wrap mt-4">
                            {previews.map((img, index) => (
                              <div key={index} className="relative mt-3">
                                <div className="relative">
                                  <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded-md border"
                                  />
                                  {uploadingIndex === index && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                      <Spinner />
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className="absolute right-[-6px] top-[-6px] z-10"
                                  onClick={() => {
                                    const newImages = values.packageImages.filter(
                                      (_, i) => i !== index
                                    );
                                    setFieldValue("packageImages", newImages);
                                    setPreviews((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
                                  disabled={uploadingIndex === index}
                                >
                                  <IoIosCloseCircleOutline className="w-6 h-6 text-red-800 hover:text-red-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadingIndex !== -1}
                      className="rounded-md bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1570EF] focus:outline-none disabled:bg-gray-400"
                    >
                      {loading ? <Spinner /> : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PackageEditModal;
