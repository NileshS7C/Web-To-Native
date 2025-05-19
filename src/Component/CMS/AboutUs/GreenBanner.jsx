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
import { Page } from "../../Common/PageTitle";
import SwitchToggle from "../HomePage/SwitchToggle";

const initialValues = {
  heading: "",
  subHeading: "",
  isVisible: true,
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
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const { submitFormData, submissionError, isSubmitted } = useSubmitForm();

  const { data, error, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "greenBanner" }),
    isSubmitted
  );

  useEffect(() => {
    if (error || submissionError) {
      setShowToast(true);
      setErrorToastMessage(errorMessage || submissionError);
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
        isVisible: data[0].isVisible,
      }));

      setDisableForms({
        heading: true,
        subHeading: true,
      });
      setEditButtonClicked(false);
    } else {
      setInitialState(initialValues);
      setDisableForms({
        heading: false,
        subHeading: false,
        isVisible: true,
      });
      setEditButtonClicked(true);
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
    <div className="w-auto">
      <Page title="Banner Section" />
      <BannerSectionForm
        initialState={initialState}
        handleSubmit={handleSubmit}
        handleEdit={handleEdit}
        disableForms={disableForms}
        editButtonClicked={editButtonClicked}
        data={data}
      />

      {showToast && (
        <Toast
          successMessage={toastMessage}
          error={isError ? errorToastMessage : null}
          onClose={() => setShowToast(false)}
        />
      )}
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
      {({ resetForm, isSubmitting, values, setFieldValue }) => {
        const hasAnyValue = Object.values(values).some((value) => value !== "");
        return (
          <Card>
            {data?.length > 0 && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-md font-semibold">
                    Toggle Section Visibility
                  </p>
                  <SwitchToggle
                    enabled={values.isVisible}
                    onChange={() => {
                      if (!editButtonClicked) return;
                      setFieldValue("isVisible", !values.isVisible);
                    }}
                  />
                </div>
                <button onClick={handleEdit}>
                  <span>
                    <CiEdit className="w-6 h-6" />
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
                    disabled={!hasAnyValue || !editButtonClicked}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 rounded-lg shadow-md bg-gray-600  text-white hover:bg-gray-400 active:bg-gray-200"
                    disabled={
                      data?.length > 0
                        ? !editButtonClicked
                        : !hasAnyValue || isSubmitting || !editButtonClicked
                    }
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
