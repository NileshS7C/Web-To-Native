import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { uploadImage } from "../../../../utils/uploadImage";
import axiosInstance from "../../../../Services/axios";

export default function WhyChooseEditDataModal({ data, selectedCard, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(selectedCard.image || null);

    console.log('data', data)
    console.log('sele', selectedCard)
    // Validation Schema
    const validationSchema = Yup.object().shape({
        heading: Yup.string().required("Heading is required"),
        subHeading: Yup.string().required("Subheading is required"),
        image: Yup.mixed().required("Image is required"),
    });

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <Formik
                            initialValues={{
                                heading: selectedCard.heading || "",
                                subHeading: selectedCard.subHeading || "",
                                image: selectedCard.image || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    let uploadedImageUrl = imagePreview;
                                    console.log('uploadedImageUrl',uploadedImageUrl)
                                    if (values.image instanceof File) {
                                        
                                        const uploadResponse = await uploadImage(values.image);
                                        console.log("uploadResponse",uploadResponse)
                                        if (uploadResponse?.url) {
                                            uploadedImageUrl = uploadResponse.url;
                                        }
                                    }

                                    const updatedSteps =
                                    {
                                        heading: values.heading,
                                        subHeading: values.subHeading,
                                        image: uploadedImageUrl,
                                        position: selectedCard.position,
                                    }

                                    console.log('data',data);
                                    const updatedFeatures = data.steps.map((feature) =>
                                        feature.position === selectedCard.position ? updatedSteps : data?.steps
                                    );
                                    const payload = {
                                        sectionTitle: data.sectionTitle,
                                        isVisible: data.isVisible,
                                        steps: updatedFeatures,
                                    };
                                    const config = {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    };
                                    await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/whyChoosePicklebay`, JSON.stringify(payload), config);
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
                                                            setImagePreview(file ? URL.createObjectURL(file) : selectedCard?.image);
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
