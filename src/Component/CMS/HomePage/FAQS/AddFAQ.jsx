import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../../../../Page/CMS/Spinner";
import axiosInstance from "../../../../Services/axios";

export default function AddFAQ({ data, isOpen, onClose, fetchHomepageSections }) {
    const [loading, setLoading] = useState(false);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
    });

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <Formik
                            initialValues={{
                                question: "",
                                answer: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                setLoading(true);
                                try {
                                    const newFAQ = {
                                        question: values.question,
                                        answer: values.answer,
                                        position: data.faqs.length + 1
                                    }
                                    const updatedFAQS = [...data.faqs, newFAQ];
                                    console.log(newFAQ)
                                    const payload = {
                                        isVisible: data.isVisible,
                                        faqs:updatedFAQS
                                    }
                                    console.log('payload',payload)
                                    const config = {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    };
                                    await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/faqs`, JSON.stringify(payload), config);
                                    fetchHomepageSections();
                                    onClose();
                                } catch (error) {
                                    console.error("Error submitting FAQ:", error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {() => (
                                <Form>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-900/10 pb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">Add FAQ</h2>

                                            <div className="mt-6 grid grid-cols-1 gap-y-6">
                                                {/* Question Input */}
                                                <div>
                                                    <label htmlFor="question" className="block text-sm font-medium text-gray-900">
                                                        Question
                                                    </label>
                                                    <Field
                                                        id="question"
                                                        name="question"
                                                        type="text"
                                                        placeholder="Enter your question"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage name="question" component="p" className="mt-1 text-sm text-red-600" />
                                                </div>

                                                {/* Answer Input */}
                                                <div>
                                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-900">
                                                        Answer
                                                    </label>
                                                    <Field
                                                        as="textarea"
                                                        id="answer"
                                                        name="answer"
                                                        rows={4}
                                                        placeholder="Enter the answer"
                                                        className="block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none sm:text-sm"
                                                    />
                                                    <ErrorMessage name="answer" component="p" className="mt-1 text-sm text-red-600" />
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
                                            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none"
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
        </Dialog >
    );
}