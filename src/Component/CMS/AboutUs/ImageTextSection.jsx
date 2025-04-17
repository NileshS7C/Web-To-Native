import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import PropTypes from "prop-types";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";
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
import { Toast } from "../../Common/Toast";
import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";
import SwitchToggle from "../HomePage/SwitchToggle";

const initialValues = {
  image: "",
  heading: "",
  subHeading: "",
  link: "/contact-us",
  isVisible: true,
};

const ImageTextSection = () => {
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
    getAboutUsPageData({ type: "bottomAboutUsSection" }),
    isSubmitted
  );

  useEffect(() => {
    if (error || submissionError || uploadError) {
      setShowToast(true);
      setToastMessage(errorMessage || submissionError || uploadError);
      setIsError(true);
    }
  }, [error, submissionError, uploadError]);

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
    if (previewURL) {
      setInitialState((prev) => ({ ...prev, image: previewURL }));
    }
  }, [previewURL]);

  useEffect(() => {
    if (data?.length > 0) {
      setInitialState({
        image: data[0].image || "",
        heading: data[0].heading || "",
        subHeading: data[0].subHeading || "",
        link: data[0].link || "/contact-us",
        isVisible:
          typeof data[0]?.isVisible === "boolean" ? data[0].isVisible : true,
      });
    }
  }, [data]);

  const handleRemoveImage = () => {
    setInitialState((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    await submitFormData(
      submitAboutUsForm({
        type: "bottomAboutUsSection",
        body: values,
      })
    );
    setSubmitting(false);
    setOpenModal(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <Page title="Image & Text Section" />
      </div>

      <ImageTextSectionForm
        initialState={initialState}
        handleSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        isUploading={isUploading}
        handleRemoveImage={handleRemoveImage}
      />

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

const ImageTextSectionForm = ({
  initialState,
  handleSubmit,
  handleFileUpload,
  isUploading,
  handleRemoveImage,
}) => {
  return (
    <Formik
      initialValues={initialState}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        return (
          <Card>
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
            <Form className="flex flex-col gap-4">
              <ImageUpload
                handleImageChange={handleFileUpload}
                isUploading={isUploading}
                values={values}
                handleRemoveImage={handleRemoveImage}
              />
              <TextInput />
              <SubtextInput />
              <LinkInput />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600 text-white hover:bg-gray-400 active:bg-gray-200"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        );
      }}
    </Formik>
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
      <label htmlFor="image">Section Image</label>
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

const TextInput = () => {
  return (
    <Field name="heading" id="heading">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="heading">Heading</label>
          <Input {...field} placeholder="Enter main heading" />
        </div>
      )}
    </Field>
  );
};

const SubtextInput = () => {
  return (
    <Field name="subHeading" id="subHeading">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="subHeading">Subheading</label>
          <textarea
            {...field}
            className="w-full px-4 py-2 border border-[#DFEAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter subheading"
            rows="4"
          />
        </div>
      )}
    </Field>
  );
};

const LinkInput = () => {
  return (
    <Field
      name="link"
      id="link"
      validate={(value) => {
        if (!value) return undefined;

        try {
          if (!value.startsWith("http://") && !value.startsWith("https://")) {
            return "Link must start with http:// or https://";
          }

          const testUrl = new URL(value);

          if (testUrl.toString().includes(" ")) {
            return "Link cannot contain spaces";
          }

          const validUrlPattern =
            /^https?:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*$/i;
          if (!validUrlPattern.test(value)) {
            return "Invalid URL format. Please enter a valid URL";
          }

          return undefined;
        } catch (err) {
          return "Invalid URL format";
        }
      }}
    >
      {({ field, meta }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="link">Get in Touch Link</label>
          <Input
            {...field}
            placeholder="Enter link (e.g., https://example.com/contact-us)"
          />
          {meta?.error && (
            <span className="text-red-500 text-sm">{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  );
};

ImageTextSectionForm.propTypes = {
  initialState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

ImageUpload.propTypes = {
  values: PropTypes.object.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
};

export default ImageTextSection;
