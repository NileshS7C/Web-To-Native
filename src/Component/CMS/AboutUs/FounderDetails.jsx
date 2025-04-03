import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";

import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";

import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";

import Card from "../../Common/Card";
import { Page } from "../../Common/PageTitle";
import { Toast } from "../../Common/Toast";
import Button from "../../Common/Button";

import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";
import SwitchToggle from "../HomePage/SwitchToggle";

const initialValues = {
  image: "",
  isVisible: true,
};

const FounderSection = () => {
  const [initialState, setInitialState] = useState(initialValues);
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
    getAboutUsPageData({ type: "ourFounder" }),
    isSubmitted
  );

  useEffect(() => {
    if (previewURL) {
      setInitialState((prev) => ({ ...prev, image: previewURL }));
    }
  }, [previewURL]);

  useEffect(() => {
    if (data?.length > 0) {
      setInitialState({
        image: data[0].image || "",
        isVisible:
          typeof data[0]?.isVisible === "boolean" ? data[0].isVisible : true,
      });
    }
  }, [data]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    await submitFormData(
      submitAboutUsForm({
        type: "ourFounder",
        body: values,
      })
    );
    resetForm();
    setSubmitting(false);
  };

  const handleRemoveImage = () => {
    setInitialState({ ...initialState, image: "" });
  };

  useEffect(() => {
    if (success || isSubmitted || uploadSuccess) {
      setShowToast(true);
      setIsError(false);
      setToastMessage(
        uploadSuccess
          ? "Image uploaded successfully!"
          : success
          ? "Data fetched successfully!"
          : "Data submitted successfully!"
      );
    }
  }, [success, isSubmitted, uploadSuccess]);

  useEffect(() => {
    if (error || submissionError || uploadError) {
      setShowToast(true);
      setToastMessage(errorMessage || submissionError || uploadError);
      setIsError(true);
    }
  }, [error, submissionError, uploadError]);

  return (
    <div className="w-full">
      <Page title="Our Founder" />

      <div className="flex justify-center">
        <Card>
          <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting, setFieldValue }) => (
              <Form>
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-md font-semibold line-clamp-4">
                      Toggle Visibility
                    </p>
                    <SwitchToggle
                      enabled={values.isVisible}
                      onChange={() => {
                        setFieldValue("isVisible", !values.isVisible);
                      }}
                    />
                  </div>
                </div>
                <ImageUpload
                  values={values}
                  handleRemoveImage={handleRemoveImage}
                  handleImageChange={handleFileUpload}
                  isUploading={isUploading}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600 text-white hover:bg-gray-400 active:bg-gray-200"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
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

const ImageUpload = ({
  values,
  handleRemoveImage,
  handleImageChange,
  isUploading,
}) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      <label htmlFor="image">Founder Image</label>
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
              alt="preview"
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

ImageUpload.propTypes = {
  values: PropTypes.object.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};

export default FounderSection;
