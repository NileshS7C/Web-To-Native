import React, { useEffect, useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import EditFAQ from './EditFAQ';
import axiosInstance from '../../../../Services/axios';

export default function ContentFAQ({ faqsData, fetchHomepageSections }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [faqs, setFaqs] = useState([]);

    // Sync local state with faqsData changes
    useEffect(() => {
        setFaqs(faqsData?.faqs || []);
    }, [faqsData]); 

    const handleModifyData = (event, item) => {
        event.stopPropagation();
        setDeleteModal(true);
        setSelectedCard(item);
    };

    const handleDelete = async (event, faqToDelete) => {
        event.stopPropagation();
        try {
            const updatedFaqs = faqs.filter((faq) => faq.position !== faqToDelete.position);
    
            const payload = {
                isVisible: faqsData.isVisible, 
                faqs: updatedFaqs,  
            };
    
            await axiosInstance.post(
                `${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections/faqs`,
                JSON.stringify(payload),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            fetchHomepageSections(); 
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };
    
    return (
        <dl className="mt-16 divide-y divide-gray-900/10">
            {faqs?.map((faq, index) => (
                <Disclosure key={faq.id || `${faq.question}-${index}`} as="div" className="py-6 first:pt-0 last:pb-0">
                    {({ open }) => (
                        <>
                            <dt>
                                <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                                    <span className="text-base/7 font-semibold">{faq.question}</span>
                                    <span className="ml-6 flex h-7 items-center gap-4">
                                        <PlusSmallIcon aria-hidden="true" className={`size-6 ${open ? 'hidden' : 'block'}`} />
                                        <MinusSmallIcon aria-hidden="true" className={`size-6 ${open ? 'block' : 'hidden'}`} />
                                        <button 
                                            onClick={(e) => handleModifyData(e, faq)} 
                                            className="hover:text-blue-600"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, faq)} 
                                            className="hover:text-red-600"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </span>
                                </DisclosureButton>
                            </dt>
                            <DisclosurePanel as="dd" className="mt-2 pr-12">
                                <p className="text-base/7 text-gray-600 text-left">{faq.answer}</p>
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>
            ))}
            {deleteModal && (
                <EditFAQ
                    data={faqsData}
                    selectedCard={selectedCard}
                    isOpen={deleteModal}
                    onClose={() => setDeleteModal(false)}
                    fetchHomepageSections={fetchHomepageSections}
                />
            )}
        </dl>
    );
}