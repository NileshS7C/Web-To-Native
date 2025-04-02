import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
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

const columns = [
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
    render: (data, index, currentPage, onClick) => {
      return (
        <button onClick={() => onClick(data)}>
          <CiEdit className="w-6 h-6" />
        </button>
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
});

const initialValues = {
  link: "",
};

const PicklebayInNews = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedPicklebayInNews, setSelectedPicklebayInNews] = useState(null);

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();
  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "news" }),
    isSubmitted
  );

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
    }));
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
    setSubmitting(true);
    let updatedPicklebayInNews;
    if (selectedPicklebayInNews) {
      updatedPicklebayInNews = data[0]?.news.map((item) =>
        item.position === selectedPicklebayInNews.position
          ? { ...values, position: selectedPicklebayInNews.position }
          : item
      );
    } else {
      const nextPosition = (data[0]?.news?.length || 0) + 1;
      updatedPicklebayInNews = [
        ...(data[0]?.news || []),
        { ...values, position: nextPosition },
      ];
    }

    await submitFormData(
      submitAboutUsForm({
        type: "news",
        body: { news: updatedPicklebayInNews },
      })
    );

    setSubmitting(false);
    setOpenModal(false);
    resetForm();
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Page title="How It Works Section" />
        <Button
          className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200 active:bg-gray-300"
          onClick={handleAddNew}
        >
          Add New
        </Button>
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
      />

      {showToast && (
        <Toast
          successMessage={!isError ? toastMessage : null}
          error={isError ? toastMessage : null}
        />
      )}
    </div>
  );
};

const PicklebayInNewsTable = ({ data, currentPage, handleEdit }) => {
  return (
    <DataTable
      data={data ? data[0]?.news : []}
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
  return (
    <Field name="link" id="link">
      {({ field, meta }) => {
        console.log("meta", meta);
        return (
          <div className="flex flex-col gap-2.5">
            <label htmlFor="link">Link</label>
            <Input
              {...field}
              name="link"
              placeholder="https://example.com"
              className={`${
                meta.touched && meta.error ? "border-red-500" : ""
              }`}
            />
            {meta?.error && (
              <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            )}
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
};

PicklebayInNewsForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default PicklebayInNews;
