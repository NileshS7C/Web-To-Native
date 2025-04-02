import { Formik, Form, Field } from "formik";
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
    render: (item, index, currentPage, onClick) => {
      return (
        <button onClick={() => onClick(item)}>
          <CiEdit className="w-6 h-6" />
        </button>
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <Page title="Meet The Team" />
        <Button
          className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
          onClick={handleAddMember}
        >
          Add Team Member
        </Button>
      </div>
      <TeamMemberTable data={data} currentPage={1} handleEdit={handleEdit} />
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
        />
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

const TeamMemberTable = ({ data, currentPage, handleEdit }) => {
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
    />
  );
};

const TeamSectionForm = ({
  initialState,
  handleSubmit,
  handleFileUpload,
  isUploading,
  previewURL,
}) => {
  return (
    <Formik
      initialValues={initialState}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        const handleImageUpload = async (event, file) => {
          await handleFileUpload(event, file);
          if (previewURL) {
            setFieldValue("image", previewURL);
          }
        };

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
                handleImageChange={handleImageUpload}
                isUploading={isUploading}
                values={values}
                handleRemoveImage={handleRemoveImage}
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
  values,
  handleRemoveImage,
  handleImageChange,
  isUploading,
}) => {
  console.log(" values", values);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="image">Team Member Image</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files[0];
            handleImageChange(event, file);
          }}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-gray-50 file:text-gray-700
            hover:file:bg-gray-100"
        />
        {values.image && (
          <div className="w-[100px] relative">
            <img
              src={values.image}
              alt="preview team member"
              width="100px"
              height="100px"
              className="rounded-lg object-cover"
            />
            {isUploading && (
              <ImSpinner5 className="absolute top-0 -right-10 w-[20px] h-[20px] animate-spin" />
            )}
            <button
              onClick={handleRemoveImage}
              type="button"
              className="absolute top-0 -right-4 text-red-500 hover:text-red-700"
            >
              <IoMdTrash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

TeamSectionForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

ImageUpload.propTypes = {
  values: PropTypes.string.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};

export default TeamSection;
