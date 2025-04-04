import React, { useEffect, useState } from "react";
import JournalSectionInfo from "../../../Component/CMS/HomePage/Journal/JournalSectionInfo";
import JournalContentTable from "../../../Component/CMS/HomePage/Journal/JournalContentTable";
import JournalAddDataModal from "../../../Component/CMS/HomePage/Journal/JournalAddDataModal";
import axiosInstance from "../../../Services/axios";
import { Modal } from "../../../Component/Common/Modal";
import { JournalForm } from "../../../Component/CMS/HomePage/Journal/JournalForm";
import { Toast } from "../../../Component/Common/Toast";

export default function Journal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalData, setJournalData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const fetchJournalSection = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/users/admin/homepage-sections?section=journal`,
        config
      );
      setJournalData(response.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchJournalSection();
  }, []);

  const handleEdit = (data) => {
    setSelectedJournal(data);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      setMessage(null);

      const { _id, handle, createdAt, updatedAt, ...updatedData } = values;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/users/admin/blogs/${
          selectedJournal?.blogID?.handle
        }`,
        JSON.stringify({ ...updatedData }),
        config
      );

      if (response?.data?.responseCode === 0) {
        setSuccess(true);
        setMessage(response?.data?.message);
        fetchJournalSection();
        setIsEditModalOpen(false);
      } else {
        setError(true);
        setMessage(response?.data?.message || "Failed to update journal");
      }
      resetForm();
      setSubmitting(false);
    } catch (err) {
      console.error("Error occurred while updating the journal", err);
      setError(true);
      setMessage("Something went wrong while updating the journal");
      setSubmitting(false);
    } finally {
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (error || uploadError) {
      setShowToast(true);
      setToastMessage(message || uploadError);
      setIsError(true);
    }
  }, [error, uploadError]);

  useEffect(() => {
    if (success || uploadSuccess) {
      setShowToast(true);
      const response = success ? message : "Image uploaded successfully!";
      setToastMessage(response);
      setIsError(false);
    }
  }, [success, uploadSuccess]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col gap-4">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold text-gray-900">
            The Picklebay Journal
          </h1>
        </div>
        <div className="flex items-end justify-between w-full">
          <JournalSectionInfo sectionInfo={journalData} />
          <div className="flex justify-end">
            <button
              type="button"
              className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
              onClick={() => setIsModalOpen(true)}
            >
              Add Journal
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full w-full py-2 align-middle sm:px-6 lg:px-8 ">
            <JournalContentTable
              data={journalData.journals}
              fetchHomepageSections={fetchJournalSection}
              handleEdit={handleEdit}
            />
          </div>
        </div>
      </div>

      {/* 
       Modal for editing the journal
      
      */}

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Journal Details"
      >
        <JournalForm
          handleSubmit={handleSubmit}
          selectedJournal={selectedJournal?.blogID ?? null}
          setUploadError={setUploadError}
          setUploadSuccess={setUploadSuccess}
        />
      </Modal>

      {/* Pass isOpen and onClose to AddDataModal */}
      <JournalAddDataModal
        data={journalData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchHomepageSections={fetchJournalSection}
      />

      {showToast && (
        <Toast
          successMessage={!isError ? toastMessage : null}
          error={isError ? toastMessage : null}
        />
      )}
    </div>
  );
}
