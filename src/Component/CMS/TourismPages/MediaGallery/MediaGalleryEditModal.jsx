import { useState, useEffect } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../../../../Page/CMS/Spinner";
import { uploadImage } from "../../../../utils/uploadImage";
import axiosInstance from "../../../../Services/axios";



export default function MediaGalleryEditModal({
  data,
  selectedCard,
  isOpen,
  onClose,
  fetchMediaGallerySections,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
    } else if (selectedCard?.image) {
      setImagePreview(selectedCard.image);
    } else {
      setImagePreview(null);
    }
  }, [isOpen, selectedCard]);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return true;
        if (typeof value === "string") return true; // For existing image URLs
        return value.size <= 5 * 1024 * 1024; // 5MB in bytes
      }),
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-auto max-h-[90vh] rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <Formik
              initialValues={{
                description: selectedCard?.description || "",
                image: selectedCard?.image || "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  let finalImageUrl = values.image;
                  if (values.image instanceof File) {
                    setImageUploading(true);
                    let image = await uploadImage(values.image);
                    finalImageUrl = image.url;
                    setImageUploading(false);
                  }

                  const newGallery = {
                    description: values.description,
                    image: finalImageUrl,
                    position: selectedCard.position,
                  };
                  const hasChanged = Object.keys(newGallery).some(
                    (key) => newGallery[key] !== selectedCard[key]
                  );

                  if (!hasChanged) {
                    setLoading(false);
                    return;
                  }

                  const updatedMediaGallery = data.mediaGallery.map((gallery) =>
                    gallery.position === selectedCard.position
                      ? newGallery
                      : gallery
                  );

                  const payload = {
                    sectionTitle: data.sectionTitle,
                    isVisible: data.isVisible,
                    mediaGallery:updatedMediaGallery
                  };

                  console.log("Updated Payload:", payload);

                  const config = {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  };

                  // Send API request
                  const response = await axiosInstance.post(
                    `${import.meta.env.VITE_BASE_URL}/users/admin/tourism/mediaGallery`,
                    JSON.stringify(payload),
                    config
                  );

                  fetchMediaGallerySections();
                  onClose();
                } catch (error) {
                  console.error("Error submitting data:", error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="space-y-6">
                    <div className="border-b border-gray-900/10 pb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Edit Card Details
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-y-6">
                        {/* Title Input */}
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Location
                          </label>
                          <Field
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Enter a location..."
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                          />
                          <ErrorMessage
                            name="description"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>

                        {/* Image Upload Input */}
                        <div>
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Upload Image
                          </label>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              if (file && file.size > 5 * 1024 * 1024) {
                                alert("File size must be less than 5MB");
                                event.target.value = null;
                                return;
                              }
                              setFieldValue("image", file);
                              setImagePreview(
                                file
                                  ? URL.createObjectURL(file)
                                  : selectedCard?.image
                              );
                            }}
                          />
                          <p className="text-[12px] text-[#353535] mt-1">
                            (Image size: 500x700, Max size: 5MB)
                          </p>
                          <ErrorMessage
                            name="image"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />

                          {/* Image Preview */}
                          {imagePreview && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">
                                Image Preview:
                              </p>
                              <div className="relative">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="mt-2 h-24 w-24 object-cover rounded-md border"
                                />
                                {imageUploading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                    <Spinner />
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("image", null);
                                  setImagePreview(null);
                                }}
                                className="mt-2 block rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus:outline-none"
                              >
                                Remove Image
                              </button>
                            </div>
                          )}
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
                      className="rounded-md bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1570EF] focus:outline-none"
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
}
