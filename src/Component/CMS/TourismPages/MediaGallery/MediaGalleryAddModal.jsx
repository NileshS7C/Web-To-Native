import { useRef, useEffect, useState } from "react";
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
const MediaGalleryAddDataModal=({
  data,
  isOpen,
  onClose,
  fetchMediaGallerySections,
}) =>{
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    setImagePreview(null);
  }, [isOpen]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Location is required"),
    image: Yup.mixed().required("Image is required"),
  });
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative max-h-[90vh] transform overflow-y-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <Formik
              initialValues={{
                description: "",
                image: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  // Upload image if provided
                  const uploadImageUrl = values.image
                    ? await uploadImage(values.image)
                    : null;

                  if (uploadImageUrl.success) {
                    const myHeaders = new Headers({
                      "Content-Type": "application/json",
                    });

                    // Construct the new feature object
                    const newMediaGallery = {
                      description: values.description,
                      image: uploadImageUrl.url,
                      position: data.mediaGallery.length + 1, // Set next position
                    };

                    // Construct the updated features array without `_id`
                    const updatedMediaGallery = [
                      ...data.mediaGallery,
                      newMediaGallery,
                    ].map(({ _id, ...rest }) => rest);

                    const payload = {
                      sectionTitle: data.sectionTitle,
                      isVisible: data.isVisible,
                      mediaGallery: updatedMediaGallery,
                    };
                    const config = {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    };

                    // Send API request
                    const response = await axiosInstance.post(
                      `${
                        import.meta.env.VITE_BASE_URL
                      }/users/admin/tourism/mediaGallery`,
                      JSON.stringify(payload),
                      config
                    );
                    fetchMediaGallerySections();
                    onClose();
                  }
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
                        Add Card Details
                      </h2>

                      <div className="mt-6 grid grid-cols-1 gap-y-6">
                        {/* Title Input */}
                        <div>
                          <label
                            htmlFor="description"
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
                            ref={fileInputRef}
                            className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                            onChange={(event) => {
                              setFieldValue(
                                "image",
                                event.currentTarget.files[0]
                              );
                              setImagePreview(
                                event.currentTarget.files[0]
                                  ? URL.createObjectURL(
                                      event.currentTarget.files[0]
                                    )
                                  : null
                              );
                            }}
                          />
                          <p className="text-[12px] text-[#353535] mt-1">
                            (Image size: 500x700)
                          </p>
                          <ErrorMessage
                            name="image"
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />

                          {/* Image Preview + Remove Button */}
                          {imagePreview && (
                            <div className="mt-3 flex items-center gap-4">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-24 w-24 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("image", null);
                                  setImagePreview(null);
                                  fileInputRef.current.value = null;
                                }}
                                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus:outline-red-600"
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
                      className="rounded-md bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1570EF] focus:outline-[#1570EF]"
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

export default MediaGalleryAddDataModal;