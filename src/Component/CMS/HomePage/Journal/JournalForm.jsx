import { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";

import { useImageUpload } from "../../../../Hooks/CMS/useImageUpload";

import { Input } from "../../../Common/Input";
import Button from "../../../Common/Button";

import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";

const initialValues = {
  blogName: "",
  description: "",
  featureImage: "",
  handle: "",
  tags: [],
  writerImage: "",
  writerName: "",
  writerShortname: "",
};

export const JournalForm = ({
  handleSubmit,
  selectedJournal,
  setUploadError,
  setUploadSuccess,
}) => {
  const [initialState, setInitialState] = useState(initialValues);
  const {
    handleFileUpload,
    isUploading,
    uploadError,
    previewURL,
    uploadSuccess,
  } = useImageUpload();
  useEffect(() => {
    if (selectedJournal) {
      setInitialState(selectedJournal);
    }
  }, [selectedJournal]);

  useEffect(() => {
    if (previewURL) {
      setInitialState({ ...initialState, writerImage: previewURL });
    }
  }, [previewURL]);
  useEffect(() => {
    if (uploadError) {
      setUploadError(uploadError);
    }
  }, [uploadError]);

  useEffect(() => {
    if (uploadSuccess) {
      setUploadSuccess(uploadSuccess);
    }
  }, [uploadSuccess]);

  return (
    <Formik
      initialValues={initialState}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-col gap-4 mt-3">
            <BlogName />
            <Description />
            <FeatureImage />
            <Handle />
            <Tags />
            <ImageUpload
              handleFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadError={uploadError}
              uploadSuccess={uploadSuccess}
            />
            <WriterName />
            <WriteShortName />

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
      )}
    </Formik>
  );
};

const BlogName = () => {
  return (
    <Field name="blogName" id="blogName" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="blogName">Blog Name</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const Description = () => {
  return (
    <Field name="description" id="description" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="description">Description</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const FeatureImage = () => {
  return (
    <Field name="featureImage" id="featureImage" type="file">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="featureImage">Feature Image</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const Handle = () => {
  return (
    <Field name="handle" id="handle" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="handle">Handle</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const Tags = () => {
  return (
    <Field name="tag" id="tag" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="tag">Tags</label>
          <Input {...field} />
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
    <Field name="writerImage" id="writerImage" type="file" accept="image/*">
      {({ field, form }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="writerImage">Writer Image</label>
          <div className="flex flex-col justify-start items-center gap-4 relative">
            <input
              type="file"
              id="writerImage"
              accept="image/*"
              onChange={handleFileUpload}
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
              <ImSpinner5 className="absolute top-1/2 right-1/3 w-6 h-6 animate-spin" />
            )}
            <button onClick={handleRemoveImage} type="button">
              {field.value && (
                <IoMdTrash className="absolute top-1/2 right-0 w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      )}
    </Field>
  );
};

const WriterName = () => {
  return (
    <Field name="writerName" id="writerName" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="writerName">Writer Name</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const WriteShortName = () => {
  return (
    <Field name="writerShortname" id="writerShortname" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="writerShortname">Writer Short Name</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

JournalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  selectedJournal: PropTypes.object,
  setUploadError: PropTypes.func.isRequired,
  setUploadSuccess: PropTypes.func.isRequired,
};

ImageUpload.propTypes = {
  disabled: PropTypes.bool,
  handleFileUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadError: PropTypes.string,
  handleRemoveImage: PropTypes.func,
};
