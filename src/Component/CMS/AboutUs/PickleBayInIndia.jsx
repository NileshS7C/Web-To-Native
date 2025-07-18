import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import PropTypes from "prop-types";

import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";

import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";

import { Input } from "../../Common/Input";
import Card from "../../Common/Card";
import { Page } from "../../Common/PageTitle";
import Button from "../../Common/Button";
import { Modal } from "../../Common/Modal";
import { Toast } from "../../Common/Toast";
import DataTable from "../../Common/DataTable";

import { CiEdit } from "react-icons/ci";
import { ImSpinner5 } from "react-icons/im";
import { IoMdTrash } from "react-icons/io";
import SwitchToggle from "../HomePage/SwitchToggle";
import { TrashIcon } from "@heroicons/react/24/outline";

const columns = [
  {
    key: "image",
    header: "Image",
    render: (data) => {
      return <img src={data.image} alt="how it works" width={50} height={50} />;
    },
  },

  {
    key: "url",
    header: "Url",
    render: (data) => {
      return (
        <a href={data.image} target="_blank" rel="noopener noreferrer">
          {data.image}
        </a>
      );
    },
  },

  {
    key: "action",
    header: "Action",
    render: (data, index, currentPage, onClick, onDelete) => {
      return (
        <div className="flex items-center space-x-3">
          <button onClick={() => onClick(data)}>
            <CiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              onDelete(data);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      );
    },
  },
];

const initialValues = {
  image: "",
};

const PickleBayInIndia = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedPicklebayInIndia, setSelectedPicklebayInIndia] =
    useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();
  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "picklebayInIndia" }),
    isSubmitted
  );
  const [isVisible, setIsVisible] = useState(data ? data[0]?.isVisible : false);
  const {
    handleFileUpload,
    isUploading,
    uploadError,
    previewURL,
    uploadSuccess,
  } = useImageUpload();

  useEffect(() => {
    if (isError || uploadError || submissionError) {
      setShowToast(true);
      setToastMessage(errorMessage || uploadError || submissionError);
      setIsError(true);
    }
  }, [error, uploadError, submissionError]);

  useEffect(() => {
    if (uploadSuccess || success || isSubmitted) {
      setShowToast(true);
      setIsError(false);

      const message = uploadSuccess
        ? "Uploaded successfully!"
        : success
        ? "Data fetched successfully!"
        : "Data submitted successfully!";

      setToastMessage(message);
    }
  }, [uploadSuccess, success, isSubmitted]);

  const handleEdit = (data) => {
    setSelectedPicklebayInIndia(data);
    setOpenModal(true);
    setInitialState((prev) => ({
      ...prev,
      image: data.image,
    }));
  };

  const handleDelete = async (item) => {
    setSelectedPicklebayInIndia(item);
  
    const updatedPicklebayList = data[0]?.picklebayInIndia?.filter(
      (entry) => entry.position !== item.position
    );
  
    const reindexedList = updatedPicklebayList.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
  
    const payload = {
      ...data[0],
      picklebayInIndia: reindexedList,
    };
  
    const { _id, sectionType, updatedAt, ...cleanedPayload } = payload;
  
    await submitFormData(
      submitAboutUsForm({
        type: "picklebayInIndia",
        body: cleanedPayload,
      })
    );
  
    setSelectedPicklebayInIndia(null);
    setOpenModal(false);
  };
  

  const handleAddNew = () => {
    setOpenModal(true);
    setInitialState(initialValues);
    setSelectedPicklebayInIndia(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialState(initialValues);
    setSelectedPicklebayInIndia(null);
  };

  const handleRemoveImage = () => {
    setInitialState((prev) => ({ ...prev, image: "" }));
  };

  useEffect(() => {
    if (previewURL) {
      setInitialState((prev) => ({ ...prev, image: previewURL }));
    }
  }, [previewURL]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let updatedPicklebayInIndia;
    if (selectedPicklebayInIndia) {
      updatedPicklebayInIndia = data[0]?.picklebayInIndia.map((item) =>
        item.position === selectedPicklebayInIndia.position
          ? { ...values, position: selectedPicklebayInIndia.position }
          : item
      );
    } else {
      const nextPosition = (data[0]?.picklebayInIndia?.length || 0) + 1;
      updatedPicklebayInIndia = [
        ...(data[0]?.picklebayInIndia || []),
        { ...values, position: nextPosition },
      ];
    }

    await submitFormData(
      submitAboutUsForm({
        type: "picklebayInIndia",
        body: { picklebayInIndia: updatedPicklebayInIndia },
      })
    );

    setSubmitting(false);
    setOpenModal(false);
    resetForm();
  };

  useEffect(() => {
    setIsVisible(data ? data[0]?.isVisible : false);
  }, [data]);

  const handleToggleVisibility = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmationModalOpen(false);
    setIsConfirmed(true);

    const updatedMissionVision = {
      ...data[0],
      isVisible: !data[0].isVisible,
    };

    const { _id, sectionType, updatedAt, ...updatedValues } =
      updatedMissionVision;

    await submitFormData(
      submitAboutUsForm({
        type: "picklebayInIndia",
        body: updatedValues,
      })
    );
  };

  const handleCancel = () => {
    setConfirmationModalOpen(false);
    setIsCancelled(true);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <Page title="Picklebay In India " />
        <div className="flex flex-col items-start md:flex md:flex-row md:items-center justify-between mb-3">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-md font-semibold">Current Section Visibility</p>
            <SwitchToggle enabled={isVisible} onChange={() => {}} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
              onClick={handleToggleVisibility}
            >
              Toggle Visibility
            </Button>
            <Button
              className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
              onClick={handleAddNew}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal} title="Add New">
        <PickleBayInIndiaForm
          initialState={initialState}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadError={uploadError}
          handleRemoveImage={handleRemoveImage}
        />
      </Modal>

      <PickleBayInIndiaTable
        data={data}
        currentPage={1}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Modal
        open={confirmationModalOpen}
        onClose={() => {
          setConfirmationModalOpen(false);
          setIsConfirmed(false);
        }}
      >
        <div className="flex flex-col gap-5">
          <p>
            {`Are you sure you want to turn ${
              isVisible ? "off" : "on"
            } the visibility of the section?`}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="px-4 py-2 rounded-lg shadow-md bg-red-700 hover:bg-red-400 active:bg-red-500"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {showToast && (
        <Toast
          successMessage={!isError ? toastMessage : null}
          error={isError ? toastMessage : null}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

const PickleBayInIndiaTable = ({ data, currentPage, handleEdit, handleDelete }) => {
  return (
    <DataTable
      data={data ? data[0]?.picklebayInIndia : []}
      columns={columns}
      currentPage={currentPage || 1}
      pathName="/venues"
      evenRowColor="[#FFFFFF]"
      oddRowColor="blue-100"
      alternateRowColors="true"
      rowPaddingY="3"
      onClick={handleEdit}
      onDelete={handleDelete}
    />
  );
};
const PickleBayInIndiaForm = ({
  initialState,
  handleSubmit,
  handleFileUpload,
  isUploading,
  uploadError,
  handleRemoveImage,
}) => {
  return (
    <Formik
      initialValues={initialState}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => {
        return (
          <Card>
            <Form>
              <div className="flex flex-col gap-2.5">
                <ImageUpload
                  disabled={false}
                  handleFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  handleRemoveImage={handleRemoveImage}
                />

                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    className="px-4 py-2 rounded-lg shadow-md bg-gray-600 text-white hover:bg-gray-400 active:bg-gray-200"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        );
      }}
    </Formik>
  );
};

const ImageUpload = ({
  disabled,
  handleFileUpload,
  isUploading,
  uploadError,
  handleRemoveImage,
}) => {
  return (
    <Field name="image" id="image" type="file" accept="image/*">
      {({ field, form }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="image">Upload Image</label>
          <div className="flex flex-col justify-start items-center gap-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={disabled}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100"
            />
            {field.value && (
              <div className="w-32 h-32">
                <img
                  src={
                    typeof field.value === "string"
                      ? field.value
                      : URL.createObjectURL(field.value)
                  }
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            {isUploading && (
              <ImSpinner5 className="absolute top-1/2 right-1/3 w-6 h-6 animate-spin" />
            )}
            <button onClick={handleRemoveImage} type="button">
              {field.value && (
                <IoMdTrash className="absolute top-1/2 right-1/3 w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      )}
    </Field>
  );
};

PickleBayInIndiaForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadError: PropTypes.string.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

ImageUpload.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadError: PropTypes.string.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

PickleBayInIndiaTable.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PickleBayInIndia;
