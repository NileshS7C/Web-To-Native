import { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function DestinationDinkModal({ data, isOpen, onClose }) {

    const validationSchema = Yup.object({
        link: Yup.string().url("Invalid URL format").required("Link is required"),
        DesktopBannerImage: Yup.string().required("Desktop Banner Image is required"),
        MobileBannerImage: Yup.string().required("Mobile Banner Image is required")
    })

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen flex items-center justify-center p-4">
                <DialogPanel className="relative bg-white rounded-lg p-6 shadow-xl w-full max-w-lg">
                    <Formik
                        initialValues={{
                            isVisible: data?.isVisible || false,
                            DesktopBannerImage: "",
                            MobileBannerImage: "",
                            link: ""
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            console.log("Submitted Data:", values);
                            const myHeaders = new Headers({
                                "Content-Type": "application/json",
                            });
                            // Send API request
                            const response = await fetch("http://localhost:1234/api/admin/homepage-sections/destinationDink", {
                                method: "PATCH",
                                headers: myHeaders,
                                body: JSON.stringify(values),
                            });
                
                            const result = await response.json();
                            console.log("Response:", result);
                            // fetchHomepageSections();
                            onClose();
                        }}
                    >
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Desktop Banner Image</label>
                                <Field name="DesktopBannerImage" type="text" className="w-full rounded-md border px-3 py-2" />
                                <ErrorMessage name="DesktopBannerImage" component="p" className="text-sm text-red-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Mobile Banner Image</label>
                                <Field name="MobileBannerImage" type="text" className="w-full rounded-md border px-3 py-2" />
                                <ErrorMessage name="MobileBannerImage" component="p" className="text-sm text-red-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Link</label>
                                <Field name="link" type="url" className="w-full rounded-md border px-3 py-2" />
                                <ErrorMessage name="link" component="p" className="text-sm text-red-600" />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-900 hover:underline">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Save</button>
                            </div>
                        </Form>
                    </Formik>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
