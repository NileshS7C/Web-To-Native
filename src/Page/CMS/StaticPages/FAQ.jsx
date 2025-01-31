import { useState } from "react";
import { PlusIcon, MinusIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import FAQModal from "../../../Component/CMS/StaticPages/FAQModal";


export default function FAQ(){
  const [faqs, setFaqs] = useState([
    { id: 1, question: "What is React?", answer: "React is a JavaScript library for building UI." },
    { id: 2, question: "What is Tailwind CSS?", answer: "Tailwind CSS is a utility-first CSS framework." },
  ]);
  const [expandedId, setExpandedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: null, question: "", answer: "" });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleOpenModal = (faq = { id: null, question: "", answer: "" }) => {
    setCurrentFaq(faq);
    setIsModalOpen(true);
  };

  const handleSave = (updatedFaq) => {
    if (updatedFaq.id) {
      setFaqs(faqs.map(faq => (faq.id === updatedFaq.id ? updatedFaq : faq)));
    } else {
      setFaqs([...faqs, { ...updatedFaq, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg min-h-[60vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleEditMode}>{isEditing ? "Done" : "Edit"}</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => handleOpenModal()}>Add</button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <p>No FAQs are added</p>
      ) : (
        faqs.map((faq) => (
          <div key={faq.id} className="border-b py-2">
            <div className="flex justify-between items-center" onClick={() => toggleExpand(faq.id)}>
              <p className="font-medium">{faq.question}</p>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <PencilIcon className="w-5 h-5 cursor-pointer" onClick={() => handleOpenModal(faq)} />
                    <TrashIcon className="w-5 h-5 cursor-pointer text-red-500" onClick={() => handleDelete(faq.id)} />
                  </>
                ) : (
                  <>{expandedId === faq.id ? <MinusIcon className="w-5 h-5 cursor-pointer" /> : <PlusIcon className="w-5 h-5 cursor-pointer"  />}</>
                )}
              </div>
            </div>
            {expandedId === faq.id && !isEditing && <p className="mt-2 text-gray-700">{faq.answer}</p>}
          </div>
        ))
      )}

      <FAQModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} faq={currentFaq} onSave={handleSave} />
    </div>
  );
};


