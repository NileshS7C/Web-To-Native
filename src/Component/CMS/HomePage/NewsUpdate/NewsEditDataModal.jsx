import { useState, useEffect } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uploadImage } from "../../../../utils/uploadImage";
import axiosInstance from "../../../../Services/axios";

export default function NewsEditDataModal({ data, selectedCard, isOpen, onClose, fetchHomepageSections }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    useEffect(() => {
        if (selectedCard?.image) {
            setImagePreview(selectedCard.image);
        }
    }, [selectedCard]);
    // Validation Schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        date: Yup.date().required("Date is required"),
        link: Yup.string().url("Invalid URL format").required("Link is required"),
        image: Yup.mixed().required("Image is required")
    });

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-auto max-h-[80vh] rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <Formik
                            initialValues={{
                                title: selectedCard.title || "",
                                description: selectedCard.description || "",
                                date: selectedCard.date || new Date(),
                                link: selectedCard.link || "",
                                image: selectedCard.image || null
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                try {
                                    let finalImageUrl = values.image;
                                    if (values.image instanceof File) {
                                        let image = await uploadImage(values.image);
                                        finalImageUrl = image.url;
                                    }
                                    let formattedDate;
                                    if(values.date != selectedCard.date){
                                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                                    formattedDate = values.date.toLocaleDateString('en-GB', options);
                                    }
                                    const newsCard = {
                                        "title": values.title,
                                        "description": values.description,
                                        "date": formattedDate || values.date,
                                        "image": finalImageUrl,
                                        "link": values.link,
                                        "position": data.news.length + 1
                                    };

                                    // Remove the existing card from data.news
                                    const updatedNews = data.news.filter(card => card.title !== selectedCard.title); // Assuming `id` exists

                                    // Append the new card
                                    updatedNews.push(newsCard);

                                    const payload = {
                                        "sectionTitle": data.sectionTitle,
                                        "isVisible": data.isVisible,
                                        "news": updatedNews
                                    };
                                    const config = {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    };
                                    // Send API request
                                    const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/news`, JSON.stringify(payload), config);
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
                                            <h2 className="text-lg font-semibold text-gray-900">Add News</h2>

                                            <div className="mt-6 grid grid-cols-1 gap-y-6">
                                                {/* Title Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Title</label>
                                                    <Field name="title" type="text" placeholder="Enter title" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="title" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Description Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Description</label>
                                                    <Field name="description" type="text" placeholder="Enter description" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Date Picker */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Date</label>
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={(date) => {
                                                            setStartDate(date);
                                                            setFieldValue("date", date);
                                                        }}
                                                        dateFormat="dd-MM-yyyy"
                                                        className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
                                                    />
                                                    <ErrorMessage name="date" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Link Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-900">Link</label>
                                                    <Field name="link" type="url" placeholder="https://example.com" className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base" />
                                                    <ErrorMessage name="link" component="p" className="mt-1 text-sm text-red-600" />
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
