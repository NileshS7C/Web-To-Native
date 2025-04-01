import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { Input } from "../../Common/Input";
import Card from "../../Common/Card";
import Button from "../../Common/Button";
import { useState } from "react";
import { getAboutUsPageData } from "../../../redux/AboutUs/aboutUsActions";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import DataTable from "../../Common/DataTable";

const initialValues = {
  heading: "",
  subHeading: "",
  image: "",
};

const missionVisionColumns = [
  {
    key: "heading",
    header: "Heading",
    render: (item) => {
      return <p>{item.heading}</p>;
    },
  },
  {
    key: "subHeading",
    header: "Sub Heading",
    render: (item) => {
      return <p>{item.subHeading}</p>;
    },
  },
  {
    key: "image",
    header: "Image",
    render: (item) => {
      return <img src={item.image} alt="missionVision" width={50} height={50} />;
    },
  },
];

const validationSchema = Yup.object().shape({
  heading: Yup.string().min(3),

  subHeading: Yup.string().min(3),
  image: Yup.string(),
});

const MissionAndVisionWrapper = () => {
  const { data, error, loading, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "missionVision" }),
    false
  );

  console.log("data", data);
  return (
    <>
      <DataTable
        data={data[0]?.missionVision ?? []}
        columns={missionVisionColumns}
      />
    </>
  );
};

const MissionAndVision = () => {
  const [initialState, setInitialState] = useState(initialValues);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    console.log(" values", values);
  };
  return (
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <Card>
            <div className="flex flex-col gap-2.5">
              <Heading />
              <SubHeading />
              <ImageUpload />
              <div className="flex justify-between mt-3">
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200"
                  type="button"
                >
                  Clear
                </Button>
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600  text-white hover:bg-gray-400"
                  type="submit"
                  loading={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
};
const Heading = () => {
  return (
    <Field type="text" name="heading" id="heading">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="heading">Heading</label>
          <Input {...field} />
        </div>
      )}
    </Field>
  );
};

const SubHeading = () => {
  return (
    <Field type="text" name="subHeading" id="subHeading">
      {({ field, meta }) => (
        <div className="flex flex-col gap-1 items-start ">
          <label htmlFor="subHeading">Sub Heading</label>
          <Input {...field} value={field.value} />
        </div>
      )}
    </Field>
  );
};

const ImageUpload = () => {
  return <Field as={Input} type="file" name="image" id="image" />;
};

export default MissionAndVisionWrapper;
