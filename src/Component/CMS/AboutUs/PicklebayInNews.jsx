import { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage, useFormikContext } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";

import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";

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
import SwitchToggle from "../HomePage/SwitchToggle";
import DatePicker from "react-datepicker";
import { TrashIcon } from "@heroicons/react/24/outline";

const columns = [
  {
    key: "title",
    header: "Title",
    render: (data) => {
      return data.title;
    },
  },
  {
    key: "date",
    header: "Date",
    render: (data) => {
      return data.date
        ? new Date(data.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";
    },
  },
  {
    key: "link",
    header: "Link",
    render: (data) => {
      return (
        <a href={data.link} target="_blank" rel="noreferrer">
          {data.link}
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

const validationSchema = Yup.object().shape({
  link: Yup.string()
    .required("Link is required")
    .url("Please enter a valid URL")
    .matches(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      "Please enter a valid URL"
    ),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().nullable().required("Date is required"),
});

const initialValues = {
  link: "",
  title: "",
  description: "",
  date: null,
};

const PicklebayInNews = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedPicklebayInNews, setSelectedPicklebayInNews] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();
  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "aboutUsNews" }),
    isSubmitted
  );
  const [isVisible, setIsVisible] = useState(data ? data[0]?.isVisible : false);

  useEffect(() => {
    if (isError || submissionError) {
      setShowToast(true);
      setToastMessage(errorMessage || submissionError);
      setIsError(true);
    }
  }, [error, submissionError]);

  useEffect(() => {
    if (success || isSubmitted) {
      setShowToast(true);
      setIsError(false);

      const message = success
        ? "Data fetched successfully!"
        : "Data submitted successfully!";

      setToastMessage(message);
    }
  }, [success, isSubmitted]);

  const handleEdit = (data) => {
    setSelectedPicklebayInNews(data);
    setOpenModal(true);
    setInitialState((prev) => ({
      ...prev,
      link: data.link,
      title: data.title,
      description: data.description,
      date: data.date,
    }));
  };

  const handleDelete = async (item) => {
    setSelectedPicklebayInNews(item);

    const updatedNews = data[0]?.aboutUsNews?.filter(
      (newsItem) => newsItem.position !== item.position
    );

    const reindexedNews = updatedNews.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    const payload = {
      ...data[0],
      aboutUsNews: reindexedNews,
    };

    const { _id, sectionType, updatedAt, ...cleanedPayload } = payload;

    await submitFormData(
      submitAboutUsForm({
        type: "aboutUsNews",
        body: cleanedPayload,
      })
    );

    setSelectedPicklebayInNews(null);
    setOpenModal(false);
  };

  const handleAddNew = () => {
    setOpenModal(true);
    setInitialState(initialValues);
    setSelectedPicklebayInNews(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialState(initialValues);
    setSelectedPicklebayInNews(null);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(values?.date).toLocaleDateString("en-GB", options);
    const formattedValues = {
      ...values,
      date: formattedDate,
    }; 
    setSubmitting(true);
    let updatedPicklebayInNews;
    if (selectedPicklebayInNews) {
      updatedPicklebayInNews = data[0]?.aboutUsNews.map((item) =>
        item.position === selectedPicklebayInNews.position
          ? { ...formattedValues, position: selectedPicklebayInNews.position }
          : item
      );
    } else {
      const nextPosition = (data[0]?.aboutUsNews?.length || 0) + 1;
      updatedPicklebayInNews = [
        ...(data[0]?.aboutUsNews || []),
        { ...formattedValues, position: nextPosition },
      ];
    }
    await submitFormData(
      submitAboutUsForm({
        type: "aboutUsNews",
        body: { aboutUsNews: updatedPicklebayInNews },
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
        type: "aboutUsNews",
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
        <Page title="Picklebay in News" />
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
        <PicklebayInNewsForm
          initialState={initialState}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <PicklebayInNewsTable
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

const PicklebayInNewsTable = ({
  data,
  currentPage,
  handleEdit,
  handleDelete,
}) => {
  return (
    <DataTable
      data={data ? data[0]?.aboutUsNews : []}
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
const PicklebayInNewsForm = ({ initialState, handleSubmit }) => {
  return (
    <Formik
      initialValues={initialState}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, errors }) => {
        return (
          <Card>
            <Form>
              <div className="flex flex-col gap-2.5">
                <LinkInput />
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    className="px-4 py-2 rounded-lg shadow-md bg-gray-600 text-white hover:bg-gray-400 active:bg-gray-200"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
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

const LinkInput = () => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <Field name="link" id="link">
      {({ field, meta }) => {
        return (
          <div>
            {/* Title Field */}
            <div className="flex flex-col gap-2.5">
              <label>Title</label>
              <Field name="title">
                {({ field, meta }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Title"
                      className={
                        meta.touched && meta.error ? "border-red-500" : ""
                      }
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>
            </div>

            {/* Description Field */}
            <div className="flex py-2 flex-col gap-2.5">
              <label>Description</label>
              <Field name="description">
                {({ field, meta }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="Description"
                      className={
                        meta.touched && meta.error ? "border-red-500" : ""
                      }
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>
            </div>

            {/* Date Field */}
            <div className="flex py-2 flex-col gap-2.5">
              <label htmlFor="date">Date</label>
              <Field name="date">
                {({ field, meta, form }) => (
                  <>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null} // Convert stored value to Date object
                      onChange={(date) =>
                        form.setFieldValue(
                          "date",
                          date ? date.toISOString() : ""
                        )
                      } // Store as ISO format
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-MM-yyyy"
                      className={`w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        meta.touched && meta.error
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>
            </div>

            {/* Link Field */}
            <div className="flex py-2 flex-col gap-2.5">
              <label htmlFor="link">Link</label>
              <Field name="link">
                {({ field, meta }) => (
                  <>
                    <Input
                      {...field}
                      placeholder="https://example.com"
                      className={
                        meta.touched && meta.error ? "border-red-500" : ""
                      }
                    />
                    <ErrorMessage
                      name="link"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>
            </div>
          </div>
        );
      }}
    </Field>
  );
};

PicklebayInNewsTable.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

PicklebayInNewsForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default PicklebayInNews;
