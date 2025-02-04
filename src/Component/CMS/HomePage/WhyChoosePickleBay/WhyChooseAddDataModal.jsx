import { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function WhyChooseAddDataModal({ data, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(null);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        heading: Yup.string().required("Heading is required"),
        subheading: Yup.string().required("Subheading is required"),
        image: Yup.mixed().required("Image is required")
    });
    const uploadImage = async (file) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OWNjZjc2N2Y4MmRjOTI5MjkxMzdmNSIsInBob25lIjoiOTk1MzA1MDc2OSIsIm5hbWUiOiJQaWNrbGViYXkgUGxheWVyIiwiaWF0IjoxNzM4NjQ3ODM2LCJleHAiOjE3Mzg2NTg2MzZ9.ASxFRKMr2OpFrbkn88_Q7-kmQOLa-5SSkEch8hY9KVs");

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
                                heading: "",
                                subheading: "",
                                image: null
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    // Upload image if provided
                                    const uploadImageUrl = values.image ? await uploadImage(values.image) : null;

                                    if (uploadImageUrl) {
                                        const myHeaders = new Headers({
                                            "Content-Type": "application/json",
                                        });

                                        // Construct the new feature object
                                        const newStep = {
                                            heading: values.heading,
                                            subHeading: values.subheading,
                                            image: uploadImageUrl.data.url,
                                            position: data.steps.length + 1, // Set next position
                                        };

                                        // Construct the updated features array without `_id`
                                        const updatedFeatures = [...data.steps, newStep].map(({ _id, ...rest }) => rest);

                                        const payload = {
                                            sectionTitle: data.sectionTitle,
                                            isVisible: data.isVisible,
                                            steps: updatedFeatures,
                                        };

                                        console.log("Payload:", payload);

                                        // Send API request
                                        const response = await fetch("http://localhost:1234/api/admin/homepage-sections/whyChoosePicklebay", {
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
                            {({ setFieldValue }) => (
                                <Form>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">Add Data</h2>
                                            <p className="mt-1 text-sm text-gray-600">Provide the details below.</p>

                                            <div className="mt-6 grid grid-cols-1 gap-y-6">
                                                {/* Heading Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Heading</label>
                                                    <Field name="heading" type="text" placeholder="Enter heading" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="heading" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Subheading Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Subheading</label>
                                                    <Field name="subheading" type="text" placeholder="Enter subheading" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="subheading" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Image Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Upload Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
                                                        onChange={(event) => {
                                                            setFieldValue("image", event.currentTarget.files[0]);
                                                            setImagePreview(event.currentTarget.files[0] ? URL.createObjectURL(event.currentTarget.files[0]) : null);
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