import { Field, Form, Formik } from "formik";
import { Input } from "../../../Common/Input";
import { useState, useEffect } from "react";
import Button from "../../../Common/Button";

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

export const JournalForm = ({ handleSubmit, selectedJournal }) => {
  const [initialState, setInitialState] = useState(initialValues);

  useEffect(() => {
    if (selectedJournal) {
      setInitialState(selectedJournal);
    }
  }, [selectedJournal]);

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
            <WriterImage />
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

const WriterImage = () => {
  return (
    <Field name="writerImage" id="writerImage" type="file">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="writerImage">Writer Image</label>
          <Input {...field} />
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
