import { useState, useCallback, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";

import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";

import { Input } from "../../Common/Input";
import Card from "../../Common/Card";
import Button from "../../Common/Button";
import { Modal } from "../../Common/Modal";
import DataTable from "../../Common/DataTable";
import { Toast } from "../../Common/Toast";
import { Page } from "../../Common/PageTitle";

import { CiEdit } from "react-icons/ci";
import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";
import SwitchToggle from "../HomePage/SwitchToggle";
import { TrashIcon } from "@heroicons/react/24/outline";
const initialValues = {
  heading: "",
  subHeading: "",
  image: "",
};

const missionVisionColumns = [
  {
    key: "heading",
    header: "Heading",
    render: (item) => {
      return <p>{item.heading}</p>;
    },
  },
  {
    key: "subHeading",
    header: "Sub Heading",
    render: (item) => {
      return <p>{item.subHeading}</p>;
    },
  },
  {
    key: "image",
    header: "Image",
    render: (item) => {
      return (
        <img src={item.image} alt="missionVision" width={50} height={50} />
      );
    },
  },
  {
    key: "action",
    header: "Action",
    render: (item, index, currentPage, onClick, onDelete) => {
      return (
        <div className="flex items-center space-x-3">
          <button onClick={() => onClick(item.position)}>
            <CiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              onDelete(item.position);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      );
    },
  },
];

const validationSchema = Yup.object().shape({
  heading: Yup.string().min(3),
  subHeading: Yup.string().min(3),
  image: Yup.string(),
});

const MissionAndVisionWrapper = () => {
  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();
  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "missionVision" }),
    isSubmitted
  );
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMissionVision, setSelectedMissionVision] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(data ? data[0]?.isVisible : false);

  const handleEdit = useCallback(
    (id) => {
      const selectedMissionVision = data[0]?.missionVision?.find(
        (item) => item.position === id
      );
      setSelectedMissionVision(selectedMissionVision);

      setInitialState({
        heading: selectedMissionVision?.heading || "",
        subHeading: selectedMissionVision?.subHeading || "",
        image: selectedMissionVision?.image || "",
      });
      setOpenModal(true);
    },
    [data, openModal]
  );

  const handleDelete = async (position) => {
    const updatedMissionVision = data[0]?.missionVision?.filter(
      (missionItem) => missionItem.position !== position
    );
  
    const reindexedMissionVision = updatedMissionVision.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  
    const payload = {
      ...data[0],
      missionVision: reindexedMissionVision,
    };
  
    const { _id, sectionType, updatedAt, ...cleanedPayload } = payload;
  
    await submitFormData(
      submitAboutUsForm({
        type: "missionVision",
        body: cleanedPayload,
      })
    );
  
    setSelectedMissionVision(null);
    setOpenModal(false);
  };
  
  const { handleFileUpload, isUploading, uploadError, previewURL } =
    useImageUpload();

  useEffect(() => {
    if (previewURL) {
      setInitialState((prev) => ({ ...prev, image: previewURL }));
    }
  }, [previewURL]);

  useEffect(() => {
    if (uploadError) {
      setToastMessage(uploadError);
      setIsError(true);
      setShowToast(true);
    }
  }, [uploadError]);

  useEffect(() => {
    if (error || submissionError) {
      setToastMessage(errorMessage || submissionError);
      setIsError(true);
      setShowToast(true);
    }
  }, [error, submissionError, errorMessage]);

  useEffect(() => {
    if (success || isSubmitted) {
      setToastMessage(
        isSubmitted ? "Submitted Successfully!" : "Data fetched successfully!"
      );
      setIsError(false);
      setShowToast(true);
    }
  }, [success, isSubmitted]);

  const handleRemoveImage = () => {
    setInitialState({ ...initialState, image: "" });
  };

  const handleAddMission = () => {
    setSelectedMissionVision(null);
    setInitialState(initialValues);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMissionVision(null);
    setInitialState(initialValues);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    let updatedMissionVision;
    if (selectedMissionVision) {
      updatedMissionVision = data[0]?.missionVision.map((item) =>
        item.position === selectedMissionVision.position
          ? { ...values, position: selectedMissionVision.position }
          : item
      );
    } else {
      const nextPosition = (data[0]?.missionVision?.length || 0) + 1;
      updatedMissionVision = [
        ...(data[0]?.missionVision || []),
        { ...values, position: nextPosition },
      ];
    }

    await submitFormData(
      submitAboutUsForm({
        type: "missionVision",
        body: { missionVision: updatedMissionVision },
      })
    );

    setOpenModal(false);
    setInitialState(initialValues);
    setSelectedMissionVision(null);
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
        type: "missionVision",
        body: updatedValues,
      })
    );
  };

  const handleCancel = () => {
    setConfirmationModalOpen(false);
    setIsCancelled(true);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-md font-semibold">Current Section Visibility</p>
          <SwitchToggle enabled={isVisible} onChange={() => {}} />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
            onClick={handleToggleVisibility}
          >
            Toggle Visibility
          </Button>
          <Button
            className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
            onClick={handleAddMission}
          >
            Add Mission
          </Button>
        </div>
      </div>

      <MissionAndVisionTable data={data} handleEdit={handleEdit} handleDelete={handleDelete}/>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={
          selectedMissionVision
            ? "Edit Mission & Vision"
            : "Add Mission & Vision"
        }
      >
        <MissionAndVisionForm
          initialState={initialState}
          handleSubmit={handleSubmit}
          handleRemoveImage={handleRemoveImage}
          handleImageChange={handleFileUpload}
          isUploading={isUploading}
        />
      </Modal>

      <Modal
        open={confirmationModalOpen}
        onClose={() => {
          setConfirmationModalOpen(false);
          setIsConfirmed(false);
        }}
      >
        <div className="flex flex-col gap-5">
          <p>
            {" "}
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

const MissionAndVisionTable = ({ data, currentPage, handleEdit, handleDelete }) => {
  return (
    <DataTable
      data={data ? data[0]?.missionVision : []}
      columns={missionVisionColumns}
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

const MissionAndVisionForm = ({
  initialState,
  handleSubmit,
  handleRemoveImage,
  handleImageChange,
  isUploading,
}) => {
  return (
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <Card>
            <div className="flex flex-col gap-2.5">
              <Heading />
              <SubHeading />
              <ImageUpload
                values={values}
                handleRemoveImage={handleRemoveImage}
                handleImageChange={handleImageChange}
                isUploading={isUploading}
              />
              <div className="flex justify-between mt-3">
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200"
                  type="button"
                >
                  Clear
                </Button>
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600  text-white hover:bg-gray-400"
                  type="submit"
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
};
const Heading = () => {
  return (
    <Field type="text" name="heading" id="heading">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="heading">Heading</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const SubHeading = () => {
  return (
    <Field type="text" name="subHeading" id="subHeading">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="subHeading">Sub Heading</label>
          <Input {...field} value={field.value} />
        </div>
      )}
    </Field>
  );
};

const ImageUpload = ({
  values,
  handleRemoveImage,
  handleImageChange,
  isUploading,
}) => {
  return (
    <>
      <Field
        as={Input}
        type="file"
        name="image"
        id="image"
        onChange={handleImageChange}
      />
      {values.image && (
        <div className="w-[100px] relative">
          <img
            src={values.image}
            alt="preview top section figure"
            width="100px"
            height="100px"
          />
          {isUploading && (
            <ImSpinner5 className="absolute top-0 -right-10 w-[20px] h-[20px] animate-spin" />
          )}
          <button onClick={handleRemoveImage} type="button">
            <IoMdTrash className="absolute top-0 -right-4" />
          </button>
        </div>
      )}
    </>
  );
};

MissionAndVisionTable.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

MissionAndVisionForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};

ImageUpload.propTypes = {
  values: PropTypes.object.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};

export default MissionAndVisionWrapper;
