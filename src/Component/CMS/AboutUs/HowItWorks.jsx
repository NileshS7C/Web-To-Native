import { Field, Formik, Form } from "formik";
import PropTypes from "prop-types";
import { Input } from "../../Common/Input";
import Card from "../../Common/Card";
import { Page } from "../../Common/PageTitle";
import Button from "../../Common/Button";
import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import { getAboutUsPageData } from "../../../redux/AboutUs/aboutUsActions";

const initialValues = {
  heading: "",
  subHeading: "",
  image: "",
  number: "",
};

const HowItWorksWrapper = () => {
  const { submitFormData, submissionError, isSubmitted, submitting } =
    useSubmitForm();
  const { data, error, loading, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "howItWorks" }),
    isSubmitted
  );

  console.log(" data", data);
  return (
    <div className="w-10/12">
      <Page title="How It Works Section" />
      <HowItWorksForm />
    </div>
  );
};

const HowItWorksForm = () => {
  return (
    <Formik initialValues={initialValues}>
      {({ isSubmitting, values }) => {
        return (
          <Card>
            <Form>
              <div className="flex flex-col gap-2.5">
                <Heading disabled={false} />
                <SubHeading disabled={false} />
                <ImageUpload disabled={false} />
                <NumberInput disabled={false} />
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

const ImageUpload = ({ disabled }) => {
  return (
    <Field name="image" id="image" type="file" accept="image/*">
      {({ field, form }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="image">Left Side Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                form.setFieldValue("image", file);
              }}
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
          </div>
        </div>
      )}
    </Field>
  );
};

const NumberInput = ({ disabled }) => {
  return (
    <Field name="number" id="number" type="text">
      {({ field }) => (
        <div className="flex flex-col gap-2 items-start">
          <label htmlFor="number">Number (e.g., "01")</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="numberSvg"
              accept=".svg"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                form.setFieldValue("numberSvg", file);
              }}
              disabled={disabled}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100"
            />
            {field.value && (
              <div className="w-12 h-12">
                <img
                  src={
                    typeof field.value === "string"
                      ? field.value
                      : URL.createObjectURL(field.value)
                  }
                  alt="Number SVG Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
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

ImageUpload.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

NumberInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

export default HowItWorksWrapper;
