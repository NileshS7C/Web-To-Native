import { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


export default function ExploreAddDataModal({ data, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(null);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        redirect: Yup.string().url("Invalid URL format").required("Redirect URL is required"),
        image: Yup.mixed().required("Image is required")
    });


    const uploadImage = async (file) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM2MGNlNTcyMDg4OTk1OThhZTgwMSIsInBob25lIjoiMjIyMjIyMjIyMiIsIm5hbWUiOiJQcmF0aGFtIiwiaWF0IjoxNzM4MzE4MDE1LCJleHAiOjE3Mzg0MDQ0MTV9.gOFdNH3a-xSFUpdiAT8E7SUXcCgGc4caUMtSSrQRF50");

        const formdata = new FormData();
        formdata.append("uploaded-file", file);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        try {
            const response = await fetch("http://localhost:1234/api/upload-file", requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error uploading image:", error);
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
                                title: "",
                                description: "",
                                redirect: "",
                                image: null
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    console.log("Submitted Data:", values);
                            
                                    // Upload image if provided
                                    const uploadImageUrl = values.image ? await uploadImage(values.image) : null;
                            
                                    if (uploadImageUrl) {
                                        const myHeaders = new Headers({
                                            "Content-Type": "application/json",
                                        });
                            
                                        // Construct the new feature object
                                        const newFeature = {
                                            title: values.title,
                                            subtitle: values.description,
                                            image: uploadImageUrl.data.url,
                                            link: values.redirect,
                                            position: data.features.length + 1, // Set next position
                                        };
                            
                                        // Construct the updated features array without `_id`
                                        const updatedFeatures = [...data.features, newFeature].map(({ _id, ...rest }) => rest);
                            
                                        const payload = {
                                            sectionTitle: data.sectionTitle,
                                            isVisible: data.isVisible,
                                            features: updatedFeatures,
                                        };
                            
                                        console.log("Payload:", payload);
                            
                                        // Send API request
                                        const response = await fetch("http://localhost:1234/api/admin/homepage-sections/explore", {
                                            method: "PATCH",
                                            headers: myHeaders,
                                            body: JSON.stringify(payload),
                                        });
                            
                                        const result = await response.json();
                                        console.log("Response:", result);
                                        fetchHomepageSections();
                                        onClose();
                                    }
                                } catch (error) {
                                    console.error("Error submitting data:", error);
                                }
                            }}
                            
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Add Tournament Details
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Provide details about the tournament below.
                                            </p>

                                            <div className="mt-6 grid grid-cols-1 gap-y-6">
                                                {/* Title Input */}
                                                <div>
                                                    <label
                                                        htmlFor="title"
                                                        className="block text-sm font-medium text-gray-900"
                                                    >
                                                        Title
                                                    </label>
                                                    <Field
                                                        id="title"
                                                        name="title"
                                                        type="text"
                                                        placeholder="Tournament Title"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage
                                                        name="title"
                                                        component="p"
                                                        className="mt-1 text-sm text-red-600"
                                                    />
                                                </div>

                                                {/* Description Input */}
                                                <div>
                                                    <label
                                                        htmlFor="description"
                                                        className="block text-sm font-medium text-gray-900"
                                                    >
                                                        Description
                                                    </label>
                                                    <Field
                                                        as="textarea"
                                                        id="description"
                                                        name="description"
                                                        rows={4}
                                                        placeholder="Tournament Description"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage
                                                        name="description"
                                                        component="p"
                                                        className="mt-1 text-sm text-red-600"
                                                    />
                                                </div>

                                                {/* Redirect Input */}
                                                <div>
                                                    <label
                                                        htmlFor="redirect"
                                                        className="block text-sm font-medium text-gray-900"
                                                    >
                                                        Redirect URL
                                                    </label>
                                                    <Field
                                                        id="redirect"
                                                        name="redirect"
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage
                                                        name="redirect"
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
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                        onChange={(event) => {
                                                            setFieldValue("image", event.currentTarget.files[0]);
                                                            setImagePreview(event.currentTarget.files[0] ? URL.createObjectURL(event.currentTarget.files[0]) : null);
                                                        }}
                                                    />
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
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-indigo-600"
                                        >
                                            Save
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
