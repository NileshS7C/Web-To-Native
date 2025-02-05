import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function WhyChooseEditDataModal({ data, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(data.image || null);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        heading: Yup.string().required("Heading is required"),
        subHeading: Yup.string().required("Subheading is required"),
        image: Yup.mixed().required("Image is required"),
    });

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("uploaded-file", file);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/upload-file`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <Formik
                            initialValues={{
                                heading: data.heading || "",
                                subHeading: data.subHeading || "",
                                image: null,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    let uploadedImageUrl = imagePreview;

                                    if (values.image) {
                                        const uploadResponse = await uploadImage(values.image);
                                        if (uploadResponse?.data?.url) {
                                            uploadedImageUrl = uploadResponse.data.url;
                                        }
                                    }

                                    const updatedSteps = [
                                        {
                                            heading: values.heading,
                                            subHeading: values.subHeading,
                                            image: uploadedImageUrl,
                                            position: data.position,
                                        }
                                    ]

                                    const payload = {
                                        sectionTitle: data.sectionTitle,
                                        isVisible: data.isVisible,
                                        steps: updatedSteps,
                                    };

                                    await fetch(`${import.meta.env.VITE_BASE_URL}/admin/homepage-sections/whyChoosePicklebay`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    fetchHomepageSections();
                                    onClose();
                                } catch (error) {
                                    console.error("Error submitting data:", error);
                                }
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">Edit Data</h2>
                                            <p className="mt-1 text-sm text-gray-600">Modify the details below.</p>

                                            <div className="mt-6 grid grid-cols-1 gap-y-6">
                                                {/* Heading Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Heading</label>
                                                    <Field name="heading" type="text" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="heading" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Subheading Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Subheading</label>
                                                    <Field name="subHeading" type="text" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="subHeading" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Image Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Upload Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files[0];
                                                            setFieldValue("image", file);
                                                            if (file) {
                                                                setImagePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                    />
                                                    <ErrorMessage name="image" component="p" className="mt-1 text-sm text-red-600" />

                                                    {imagePreview && (
                                                        <div className="mt-3 flex items-center gap-4">
                                                            <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFieldValue("image", null);
                                                                    setImagePreview(null);
                                                                }}
                                                                className="rounded-md bg-red-500 px-3 py-2 text-sm text-white shadow-sm hover:bg-red-400"
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
                                        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-900 hover:underline">Cancel</button>
                                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-500">Save</button>
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
