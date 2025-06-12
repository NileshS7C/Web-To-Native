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

export default function ExploreEditDataModal({ data, selectedCard, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
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
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        redirect: Yup.string().required("Redirect URL is required"),
        image: Yup.mixed().required("Image is required"),
    });

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-auto max-h-[90vh] rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 overflow-y-auto">
                        <Formik
                            initialValues={{
                                title: selectedCard?.title || "",
                                description: selectedCard?.subtitle || "",
                                redirect: selectedCard?.link || "",
                                image: selectedCard?.image || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                setLoading(true);
                                try {
                                    let finalImageUrl = values.image;
                                    if (values.image instanceof File) {
                                        let image = await uploadImage(values.image);
                                        finalImageUrl = image.url;
                                    }

                                    const newFeature = {
                                        title: values.title,
                                        subtitle: values.description,
                                        image: finalImageUrl,
                                        link: values.redirect,
                                        position: selectedCard.position,
                                    };
                                    const hasChanged = Object.keys(newFeature).some(
                                        (key) => newFeature[key] !== selectedCard[key]
                                    );

                                    if (!hasChanged) {
                                        setLoading(false);
                                        return;
                                    }

                                    const updatedFeatures = data.features.map((feature) =>
                                        feature.position === selectedCard.position ? newFeature : feature
                                    );

                                    const payload = {
                                        sectionTitle: data.sectionTitle,
                                        isVisible: data.isVisible,
                                        features: updatedFeatures,
                                    };
                                    

                                    const config = {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    };

                                    // Send API request
                                    const response = await axiosInstance.post(
                                        `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/explore`,
                                        JSON.stringify(payload),
                                        config
                                    );

                                    fetchHomepageSections();
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
                                                    <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                                                        Title
                                                    </label>
                                                    <Field
                                                        id="title"
                                                        name="title"
                                                        type="text"
                                                        placeholder="Tournament Title"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Description Input */}
                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                                        Description
                                                    </label>
                                                    <Field
                                                        as="textarea"
                                                        id="description"
                                                        name="description"
                                                        rows={4}
                                                        placeholder="Tournament Description"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Redirect Input */}
                                                <div>
                                                    <label htmlFor="redirect" className="block text-sm font-medium text-gray-900">
                                                        Redirect URL
                                                    </label>
                                                    <Field
                                                        id="redirect"
                                                        name="redirect"
                                                        type="text"
                                                        placeholder="https://example.com"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-[#1570EF] focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage name="redirect" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Image Upload Input */}
                                                <div>
                                                    <label htmlFor="image" className="block text-sm font-medium text-gray-900">
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
                                                            if (file) {
                                                                // Check file size (5MB = 5 * 1024 * 1024 bytes)
                                                                const maxSize = 5 * 1024 * 1024;
                                                                if (file.size > maxSize) {
                                                                    setFieldValue("image", null);
                                                                    setImagePreview(null);
                                                                    event.target.value = null;
                                                                    alert("File size should not exceed 5MB");
                                                                    return;
                                                                }
                                                                setFieldValue("image", file);
                                                                setImagePreview(URL.createObjectURL(file));
                                                            } else {
                                                                setFieldValue("image", null);
                                                                setImagePreview(null);
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-[12px] text-[#353535] mt-1">(Image size: 500x700)</p>
                                                    <ErrorMessage name="image" component="p" className="mt-1 text-sm text-red-600" />

                                                    {/* Image Preview */}
                                                    {imagePreview && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-gray-600">Image Preview:</p>
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="mt-2 h-24 w-24 object-cover rounded-md border"
                                                            />
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
                                        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-900 hover:underline">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1570EF] focus:outline-none"
                                        >
                                            {loading ?
                                                <Spinner />
                                                : 'Save'}
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
