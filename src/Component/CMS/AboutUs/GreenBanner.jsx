import { useEffect, useState } from "react";
import { Field, Formik, Form } from "formik";
import PropTypes from "prop-types";

import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";

import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";

import { Input } from "../../Common/Input";
import Button from "../../Common/Button";
import Card from "../../Common/Card";
import { Toast } from "../../Common/Toast";

import { CiEdit } from "react-icons/ci";

const initialValues = {
  heading: "",
  subHeading: "",
};

const GreenBannerWrapper = () => {
  const [initialState, setInitialState] = useState(initialValues);
  const [editButtonClicked, setEditButtonClicked] = useState(false);
  const [disableForms, setDisableForms] = useState({
    heading: true,
    subHeading: true,
  });
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();

  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "greenBanner" }),
    isSubmitted
  );

  useEffect(() => {
    if (error || submissionError) {
      setShowToast(true);
      setToastMessage(errorMessage || submissionError);
      setIsError(true);
    }
  }, [error, submissionError]);

  useEffect(() => {
    if (success || isSubmitted) {
      setShowToast(true);
      setToastMessage(
        isSubmitted
          ? "Data submitted successfully!"
          : "Data Fetched successfully!"
      );
      setIsError(false);
    }
  }, [success, isSubmitted]);

  useEffect(() => {
    if (data?.length > 0) {
      setInitialState((prev) => ({
        ...prev,
        heading: data[0].heading,
        subHeading: data[0].subHeading,
      }));
    } else {
      setInitialState(initialValues);
    }
  }, [data]);

  const handleEdit = () => {
    setEditButtonClicked((prev) => !prev);
    setDisableForms({
      heading: editButtonClicked,
      subHeading: editButtonClicked,
    });
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    await submitFormData(
      submitAboutUsForm({
        type: "greenBanner",
        body: values,
      })
    );
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="w-10/12">
      <BannerSectionForm
        initialState={initialState}
        handleSubmit={handleSubmit}
        handleEdit={handleEdit}
        disableForms={disableForms}
        editButtonClicked={editButtonClicked}
        data={data}
      />

      {showToast && <Toast successMessage={toastMessage} error={isError} />}
    </div>
  );
};

const BannerSectionForm = ({
  initialState,
  handleSubmit,
  handleEdit,
  disableForms,
  editButtonClicked,
  data,
}) => {
  return (
    <Formik
      initialValues={initialState}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ resetForm, isSubmitting }) => (
        <Card>
          {data?.length > 0 && (
            <div className="flex justify-end">
              <button onClick={handleEdit}>
                <span>
                  <CiEdit />
                </span>
              </button>
            </div>
          )}

          <Form>
            <div className="flex flex-col gap-2.5">
              <Heading disabled={disableForms.heading} />
              <SubHeading disabled={disableForms.subHeading} />
              <div className="flex justify-between mt-3">
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200"
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  disabled={!editButtonClicked}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600  text-white hover:bg-gray-400 active:bg-gray-200"
                  disabled={!editButtonClicked || isSubmitting}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      )}
    </Formik>
  );
};

const Heading = ({ disabled }) => {
  console.log(" disablesd", disabled);
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

Heading.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
SubHeading.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

BannerSectionForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  disableForms: PropTypes.object.isRequired,
  editButtonClicked: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
};

export default GreenBannerWrapper;
