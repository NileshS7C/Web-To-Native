import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../Services/axios';
import ContentFAQ from '../../../Component/CMS/HomePage/FAQS/ContentFAQ';
import AddFAQ from '../../../Component/CMS/HomePage/FAQS/AddFAQ';

export default function FAQS() {
    const [faqsData, setFaqsData] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchHomePageFAQData = async () => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/users/admin/homepage-sections?section=faqs`, config);
            const data = response.data.data[0];
            setFaqsData(data)
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchHomePageFAQData();
    }, [])
    return (
        <div className="">
            <div className="mx-auto max-w-7xl bg-white p-4 pt-0">
                <div className="mx-auto max-w-4xl">
                    <div className='flex justify-between'>
                        <h2 className="font-semibold tracking-tight text-gray-900 text-base">
                            Frequently asked questions
                        </h2>
                        <button
                            type="button"
                            className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Card
                        </button>
                    </div>
                    <ContentFAQ faqsData={faqsData} fetchHomepageSections={fetchHomePageFAQData} />
                </div>
            </div>
            {isModalOpen &&
                <AddFAQ
                    data={faqsData}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    fetchHomepageSections={fetchHomePageFAQData}
                />
            }
        </div>
    )
}
