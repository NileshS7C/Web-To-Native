import { Formik, Form, Field, useFormikContext } from "formik";
import Card from "../../Common/Card";
import { Input } from "../../Common/Input";
import { Page } from "../../Common/PageTitle";
import Button from "../../Common/Button";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";
import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "../../Common/Modal";
import DataTable from "../../Common/DataTable";
import { Toast } from "../../Common/Toast";

import { CiEdit } from "react-icons/ci";
import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";
import PropTypes from "prop-types";
import SwitchToggle from "../HomePage/SwitchToggle";
import { TrashIcon } from "@heroicons/react/24/outline";

const columns = [
  {
    header: "Name",
    key: "name",
    render: (item) => {
      return <p>{item.name}</p>;
    },
  },
  {
    header: "Designation",
    key: "designation",
    render: (item) => {
      return <p>{item.designation}</p>;
    },
  },
  {
    header: "Details",
    key: "details",
    render: (item) => {
      return <p>{item.details}</p>;
    },
  },

  {
    header: "Image",
    key: "image",
    render: (item) => {
      return <img src={item.image} alt="team member" width={50} height={50} />;
    },
  },

  {
    header: "Action",
    key: "action",
    render: (item, index, currentPage, onClick, onDelete) => {
      return (
        <div className="flex items-center space-x-3">
          <button onClick={() => onClick(item)}>
            <CiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              onDelete(item);
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
  name: "",
  designation: "",
  details: "",
  image: "",
};

const TeamSection = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const {
    handleFileUpload,
    isUploading,
    uploadError,
    previewURL,
    uploadSuccess,
  } = useImageUpload();

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();

  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "ourTeam" }),
    isSubmitted
  );
  const [isVisible, setIsVisible] = useState(data ? data[0]?.isVisible : false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let updatedTeamMember;

    if (selectedMember) {
      updatedTeamMember = {
        ourTeam: data[0]?.ourTeam.map((item) =>
          item.position === selectedMember.position
            ? { ...values, position: selectedMember.position }
            : item
        ),
      };
    } else {
      const nextPosition = (data[0]?.ourTeam?.length || 0) + 1;
      updatedTeamMember = {
        ourTeam: [
          ...(data[0]?.ourTeam || []),
          { ...values, position: nextPosition },
        ],
      };
    }

    await submitFormData(
      submitAboutUsForm({
        type: "ourTeam",
        body: updatedTeamMember,
      })
    );
    setSubmitting(false);
    setOpenModal(false);
    resetForm();
  };

  const handleAddMember = () => {
    setOpenModal(true);
    setInitialState(initialValues);
    setEditButtonClicked(false);
  };

  const handleEdit = (data) => {
    setSelectedMember(data);
    setOpenModal(true);
    setInitialState((prev) => ({
      ...prev,
      image: data.image,
      name: data.name,
      designation: data.designation,
      details: data.details,
    }));
    setEditButtonClicked(true);
  };

  const handleDelete = async (item) => {
    setSelectedMember(item);

    const updatedTeam = data[0]?.ourTeam?.filter(
      (member) => member.position !== item.position
    );

    const reindexedTeam = updatedTeam.map((member, index) => ({
      ...member,
      position: index + 1,
    }));

    const payload = {
      ...data[0],
      ourTeam: reindexedTeam,
    };

    const { _id, sectionType, updatedAt, ...cleanedPayload } = payload;

    await submitFormData(
      submitAboutUsForm({
        type: "ourTeam",
        body: cleanedPayload,
      })
    );

    setSelectedMember(null);
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialState(initialValues);
    setSelectedMember(null);
    setEditButtonClicked(false);
  };

  useEffect(() => {
    if (uploadSuccess || success || isSubmitted) {
      setShowToast(true);
      const message = uploadSuccess
        ? "File uploaded successfully!"
        : success
        ? "Data Fetched successfully!"
        : "Data Submitted Successfully!";

      setToastMessage(message);
      setIsError(false);
    }
  }, [uploadSuccess, success, isSubmitted]);

  useEffect(() => {
    if (error || uploadError || submissionError) {
      setShowToast(true);
      setToastMessage(errorMessage || uploadError || submissionError);
      setIsError(true);
    }
  }, [error, uploadError, submissionError]);

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
        type: "ourTeam",
        body: updatedValues,
      })
    );
  };

  const handleCancel = () => {
    setConfirmationModalOpen(false);
    setIsCancelled(true);
  };

  return (
    <div>
      <div className="flex flex-col">
        <Page title="Meet The Team" />
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
              onClick={handleAddMember}
            >
              Add Team Member
            </Button>
          </div>
        </div>
      </div>
      <TeamMemberTable
        data={data}
        currentPage={1}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={
          editButtonClicked
            ? "Update the team member"
            : "Add the new team member"
        }
      >
        <TeamSectionForm
          initialState={initialState}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          previewURL={previewURL}
          openModal={openModal}
          edit={editButtonClicked}
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

const TeamMemberTable = ({ data, currentPage, handleEdit, handleDelete }) => {
  return (
    <DataTable
      data={data ? data[0]?.ourTeam : []}
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

const TeamSectionForm = ({
  initialState,
  handleSubmit,
  handleFileUpload,
  isUploading,
  previewURL,
  openModal,
  edit,
}) => {
  return (
    <Formik
      initialValues={initialState}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        const handleRemoveImage = () => {
          setFieldValue("image", "");
        };

        return (
          <Card>
            <Form>
              <Name />
              <Designation />
              <TeamMemberDetails />
              <ImageUpload
                handleImageChange={handleFileUpload}
                isUploading={isUploading}
                handleRemoveImage={handleRemoveImage}
                previewURL={previewURL}
                openModal={openModal}
                edit={edit}
              />

              <div className="flex justify-end mt-3">
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600 text-white hover:bg-gray-400"
                  type="submit"
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </Form>
          </Card>
        );
      }}
    </Formik>
  );
};

const Name = () => {
  return (
    <Field type="text" name="name" id="name">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="name">Name</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const Designation = () => {
  return (
    <Field type="text" name="designation" id="designation">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="designation">Designation</label>
          <Input {...field} value={field.value} />
        </div>
      )}
    </Field>
  );
};

const TeamMemberDetails = () => {
  return (
    <Field type="text" name="details" id="details">
      {({ field }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="details">Details</label>
          <textarea
            {...field}
            className="w-full px-4 py-2 border border-[#DFEAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </Field>
  );
};

const ImageUpload = ({
  handleRemoveImage,
  handleImageChange,
  isUploading,
  previewURL,
  edit,
  openModal,
}) => {
  const { setFieldValue } = useFormikContext();
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

      setFieldValue(fileTypeKey, previewURL);
    }
  }, [previewURL]);

  useEffect(() => {
    if (openModal && !edit) {
      setFieldValue("image", "");
    }
  }, [openModal, edit]);
  return (
    <Field name="image" id="image" type="file" accept="image/*">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="image">Left Side Image</label>
          <div className="flex items-center gap-4 relative">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
              }}
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
              <ImSpinner5 className="absolute top-1/2 -right-2 w-[20px] h-[20px] animate-spin" />
            )}
            {field.value && (
              <button onClick={handleRemoveImage} type="button">
                <IoMdTrash className="absolute top-1/2" />
              </button>
            )}
          </div>
        </div>
      )}
    </Field>
  );
};

TeamMemberTable.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

TeamSectionForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  previewURL: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  openModal: PropTypes.bool.isRequired,
};

ImageUpload.propTypes = {
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  previewURL: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  openModal: PropTypes.bool.isRequired,
};

export default TeamSection;
