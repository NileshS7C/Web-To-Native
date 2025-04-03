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

const columns = [
  {
    key: "heading",
    header: "Heading",
    render: (data) => {
      return <div>{data.heading}</div>;
    },
  },
  {
    key: "subHeading",
    header: "Sub Heading",
    render: (data) => {
      return <div>{data.subHeading}</div>;
    },
  },

  {
    key: "image",
    header: "Image",
    render: (data) => {
      return (
        <img
          src={data.image}
          alt="how it works picture"
          width={50}
          height={50}
        />
      );
    },
  },
  {
    key: "number",
    header: "Number",
    render: (data) => {
      return <div>{data.svg}</div>;
    },
  },
  {
    key: "action",
    header: "Action",
    render: (data, index, currentPage, onClick) => {
      return (
        <button onClick={() => onClick(data)}>
          <CiEdit />
        </button>
      );
    },
  },
];

const initialValues = {
  heading: "",
  subHeading: "",
  image: "",
  svg: "",
};

const HowItWorksWrapper = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedHowItWorks, setSelectedHowItWorks] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();
  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "howItWorks" }),
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
    setSelectedHowItWorks(data);
    setOpenModal(true);
    setInitialState((prev) => ({
      ...prev,
      image: data.image,
      heading: data.heading,
      subHeading: data.subHeading,
      svg: data.svg,
    }));
  };

  const handleAddNew = () => {
    setOpenModal(true);
    setInitialState(initialValues);
    setSelectedHowItWorks(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialState(initialValues);
    selectedHowItWorks(null);
  };

  const handleRemoveImage = () => {
    setInitialState((prev) => ({ ...prev, image: "" }));
  };
  useEffect(() => {
    if (previewURL) {
      const fileExtension = previewURL.split(".").pop().toLowerCase();
      let fileTypeKey;
      if (["svg"].includes(fileExtension)) {
        fileTypeKey = "svg";
      } else if (
        ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)
      ) {
        fileTypeKey = "image";
      }
      setInitialState((prev) => ({
        ...prev,
        [fileTypeKey]: previewURL,
      }));
    }
  }, [previewURL]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let updatedHowItWorks;
    if (selectedHowItWorks) {
      updatedHowItWorks = data[0]?.howItWorks.map((item) =>
        item.position === selectedHowItWorks.position
          ? { ...values, position: selectedHowItWorks.position }
          : item
      );
    } else {
      const nextPosition = (data[0]?.howItWorks?.length || 0) + 1;
      updatedHowItWorks = [
        ...(data[0]?.howItWorks || []),
        { ...values, position: nextPosition },
      ];
    }

    await submitFormData(
      submitAboutUsForm({
        type: "howItWorks",
        body: { howItWorks: updatedHowItWorks },
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
        type: "howItWorks",
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
        <Page title="How It Works Section" />
        <div className="flex justify-between items-center mb-3">
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
        <HowItWorksForm
          initialState={initialState}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadError={uploadError}
          handleRemoveImage={handleRemoveImage}
        />
      </Modal>

      <HowItWorksTable data={data} currentPage={1} handleEdit={handleEdit} />

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
        />
      )}
    </div>
  );
};

const HowItWorksTable = ({ data, currentPage, handleEdit }) => {
  return (
    <DataTable
      data={data ? data[0]?.howItWorks : []}
      columns={columns}
      currentPage={currentPage || 1}
      pathName="/venues"
      evenRowColor="[#FFFFFF]"
      oddRowColor="blue-100"
      alternateRowColors="true"
      rowPaddingY="3"
      onClick={handleEdit}
    />
  );
};
const HowItWorksForm = ({
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
      {({ isSubmitting }) => {
        return (
          <Card>
            <Form>
              <div className="flex flex-col gap-2.5">
                <Heading disabled={false} />
                <SubHeading disabled={false} />
                <ImageUpload
                  disabled={false}
                  handleFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  uploadError={uploadError}
                  handleRemoveImage={handleRemoveImage}
                />
                <NumberInput
                  disabled={false}
                  handleFileUpload={handleFileUpload}
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

const Heading = ({ disabled }) => {
  return (
    <Field name="heading" id="heading" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="heading">Heading</label>
          <Input {...field} disabled={disabled} />
        </div>
      )}
    </Field>
  );
};

const SubHeading = ({ disabled }) => {
  return (
    <Field name="subHeading" id="subHeading" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="subHeading">Sub Heading</label>
          <Input {...field} disabled={disabled} />
        </div>
      )}
    </Field>
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
          <label htmlFor="image">Left Side Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                handleFileUpload(e);
              }}
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
              <ImSpinner5 className="absolute top-0 -right-10 w-[20px] h-[20px] animate-spin" />
            )}
            <button onClick={handleRemoveImage} type="button">
              <IoMdTrash className="absolute top-0 -right-4" />
            </button>
          </div>
        </div>
      )}
    </Field>
  );
};

const NumberInput = ({ disabled, handleFileUpload }) => {
  return (
    <Field name="svg" id="svg" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="svg">Number (e.g., "01")</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="svg"
              accept=".svg"
              onChange={(e) => {
                handleFileUpload(e);
              }}
              disabled={disabled}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100"
            />
            {field.value && (
              <div className="w-12 h-12">
                <img
                  src={
                    typeof field.value === "string"
                      ? field.value
                      : URL.createObjectURL(field.value)
                  }
                  alt="SVG Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Field>
  );
};

Heading.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

SubHeading.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

ImageUpload.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

NumberInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

export default HowItWorksWrapper;
