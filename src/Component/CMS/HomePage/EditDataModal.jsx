import { useState, useEffect } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function EditDataModal({ data, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(null);
    console.log('data', data)
    useEffect(() => {
        if (data?.image) {
            setImagePreview(data.image);
        }
    }, [data]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        redirect: Yup.string().url("Invalid URL format").required("Redirect URL is required"),
        image: Yup.mixed().required("Image is required"),
    });

    const uploadImage = async (file) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OWNjZjc2N2Y4MmRjOTI5MjkxMzdmNSIsInBob25lIjoiOTk1MzA1MDc2OSIsIm5hbWUiOiJQaWNrbGViYXkgUGxheWVyIiwiaWF0IjoxNzM4MzI5OTc1LCJleHAiOjE3MzgzNDA3NzV9.FUCwl6NXPMwkonZiURcOrNsXvI5fxlZCIC6pRlcU7dU");

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
            return result?.data?.url; 
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
                                title: data?.title || "",
                                description: data?.subtitle || "",
                                redirect: data?.link || "",
                                image: data?.link || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    let finalImageUrl = values.image;

                                    if (values.image instanceof File) {
                                        finalImageUrl = await uploadImage(values.image);
                                    }

                                    console.log("Final Submitted Data:", {
                                        ...values,
                                        image: finalImageUrl,
                                    });
                                    const myHeaders = new Headers({
                                        "Content-Type": "application/json",
                                    });
                                    const newFeature = {
                                        title: values.title,
                                        subtitle: values.description,
                                        image: finalImageUrl,
                                        link: values.redirect,
                                        position: data.position,
                                    };
                                    console.log(newFeature,'newFeature')
                                   
                                    const payload = {
                                        sectionTitle: data.sectionTitle,
                                        isVisible: data.isVisible,
                                        features: newFeature,
                                    };

                                    console.log("Payload:", payload);

                                    // Send API request
                                    const response = await fetch("http://localhost:1234/api/admin/homepage-sections/explore", {
                                        method: "PATCH",
                                        headers: myHeaders,
                                        body: JSON.stringify(payload),
                                    });

                                    const result = await response.json();
                                    fetchHomepageSections();
                                    // Perform your API update logic here
                                    onClose();
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
                                                Edit Tournament Details
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Provide details about the tournament below.
                                            </p>

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
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
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
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
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
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
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
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files[0];
                                                            setFieldValue("image", file);
                                                            setImagePreview(file ? URL.createObjectURL(file) : data?.image);
                                                        }}
                                                    />
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
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
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
