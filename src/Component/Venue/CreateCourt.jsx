import { Formik, Form, ErrorMessage, Field, useFormikContext } from "formik";
import * as yup from "yup";
import TextError from "../Error/formError";
import { useDispatch, useSelector } from "react-redux";
import { uploadIcon } from "../../Assests";
import { BiX } from "react-icons/bi";
import { removeFiles, updateFiles } from "../../redux/tournament/addTournament";
import Button from "../Common/Button";
import { courtFeatures } from "../../Constant/venue";
import { createCourt } from "../../redux/Venue/venueActions";
import { useParams } from "react-router-dom";
import { ErrorModal } from "../Common/ErrorModal";
import { showError } from "../../redux/Error/errorSlice";
const validationSchema = {
  courtName: yup
    .string()
    .required()
    .min(3, "Name must be at least 3 characters long.")
    .max(50, "Name cannot exceed 50 characters."),

  courtNumber: yup
    .number()
    .required()
    .min(1, "Court Number should be greater than 0"),
  features: yup.array().min(1, "At least feature should be selected"),
  price: yup.number().required().min(1, "Price should be greater than 1"),
  bannerImages: yup.object().shape({
    desktop: yup
      .mixed()
      .test("file-size", "Desktop banner image is too large", (value) => {
        if (!value) return true;

        return !value || (value && value?.size <= 100 * 1024); // 100 KB
      })
      .test(
        "file-type",
        "Desktop banner image should be of valid image type",
        (value) => {
          if (!value) return true;
          return (
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value?.type)
          );
        }
      ),

    mobile: yup
      .mixed()
      .test("file-size", "Mobile banner image is too large", (value) => {
        if (!value) return true;
        return !value || value.size <= 100 * 1024; // 100kb
      })
      .test(
        "file-type",
        "Mobile banner image should be of valid image type",
        (value) => {
          if (!value) return true;
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        }
      ),
  }),
};

const initialValues = {
  courtName: "",
  courtNumber: Number(1),
  features: [],
  price: 1,
  bannerImages: [
    {
      url: "https://example.com/banner1.jpg",
    },
    {
      url: "https://example.com/banner2.jpg",
    },
  ],
};

export const CourtCreation = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isLoading } = useSelector((state) => state.addCourt);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    try {
      await dispatch(createCourt({ formData: values, id: id })).unwrap();
    } catch (err) {
      console.log(" err", err);
      dispatch(
        showError({
          message: err.data.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    }
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323] rounded-3xl py-[50px] px-[48px]">
          <CourtDetails />
          <CourtFileUpload />
          <CourtFeatures />
          <CourtPrice />
          <ErrorModal message="There has been an occured while creating the court." />
          <Button
            className="w-[150px] h-[60px] bg-[#1570EF] ml-auto rounded-[8px] text-[#FFFFFF]"
            type="submit"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

const CourtDetails = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] ">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="courtName"
        >
          CourtName
        </label>
        <Field
          placeholder="Enter Venue Name"
          id="courtName"
          name="courtName"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="courtName" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="courtNumber"
        >
          Court No.
        </label>
        <Field
          placeholder="Enter Venue Location"
          id="courtNumber"
          name="courtNumber"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="courtNumber" component={TextError} />
      </div>
    </div>
  );
};

const CourtFileUpload = () => {
  const dispatch = useDispatch();
  const { selectedFiles, bannerMobileFiles } = useSelector(
    (state) => state.Tournament
  );

  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className=" relative flex flex-col items-start gap-2.5 ">
        <label className="text-xs text-[#232323]" htmlFor="bannerImage">
          Banner Image (Desktop)
        </label>

        <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
          <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

          <p className="text-sm text-[#5B8DFF]">
            Click to upload{" "}
            <span className="text-sm text-[#353535] "> or drag and drop</span>
          </p>

          <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
          <Field name="bannerImage.desktop">
            {({ form, field, meta }) => (
              <input
                {...field}
                id="bannerImage.desktop"
                name="bannerImage.desktop"
                onChange={(e) => {
                  const files = e.target.files[0];
                  if (selectedFiles.length >= 1) return;
                  const url = window.URL.createObjectURL(files);
                  dispatch(updateFiles({ name: url, source: "desktop" }));
                  form.setFieldValue("bannerImage.desktop", files);
                }}
                value=""
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                multiple={false}
              />
            )}
          </Field>
        </div>
        {selectedFiles.map((file, index) => {
          return (
            <div
              className="flex bg-[#eaeaea] rounded-[20px] items-center p-[3px] justify-center"
              key={`${file}. ${index}`}
            >
              <div className=" text-xs ">{file}</div>

              <BiX
                className="w-4 h-4 cursor-pointer"
                key={`${index}.icon`}
                onClick={() => {
                  dispatch(removeFiles(file, "desktop"));
                }}
              />
            </div>
          );
        })}
        <ErrorMessage name="bannerImage.desktop" component={TextError} />
      </div>

      <div className="relative flex flex-col items-start gap-2.5 ">
        <label className="text-xs text-[#232323]" htmlFor="bannerImage_M">
          Banner Image (Mobile)
        </label>

        <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
          <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

          <p className="text-sm text-[#5B8DFF]">
            Click to upload
            <span className="text-sm text-[#353535] "> or drag and drop</span>
          </p>

          <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
          <Field name="bannerImage.mobile">
            {({ form, field }) => (
              <input
                {...field}
                id="bannerImage.mobile"
                name="bannerImage.mobile"
                onChange={(e) => {
                  const files = e.target.files[0];
                  if (bannerMobileFiles.length >= 1) return;
                  dispatch(updateFiles({ name: files.name, source: "mobile" }));
                  form.setFieldValue("bannerImage.mobile", files);
                }}
                value=""
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                multiple=""
              />
            )}
          </Field>
        </div>
        {bannerMobileFiles.map((file, index) => {
          return (
            <div
              className="flex bg-[#eaeaea] rounded-[20px] items-center p-[3px] justify-center"
              key={`${file}. ${index}`}
            >
              <div className=" text-xs ">{file}</div>

              <BiX
                className="w-4 h-4 cursor-pointer"
                key={`${index}.icon`}
                onClick={() => {
                  dispatch(removeFiles(file, "mobile"));
                }}
              />
            </div>
          );
        })}
        <ErrorMessage name="bannerImage.mobile" component={TextError} />
      </div>
    </div>
  );
};

const CourtFeatures = () => {
  const { form } = useFormikContext();
  return (
    <div className="flex justify-between">
      {courtFeatures.map((feature) => (
        <label
          key={feature}
          className="flex items-center gap-2 text-[15px] leading-[18.15px] text-[#232323]"
          htmlFor="features"
        >
          <Field
            type="checkbox"
            name="features"
            id="features"
            value={feature}
            checked={form?.values.features.includes(feature)}
            className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
          />
          {feature}
        </label>
      ))}
    </div>
  );
};

const CourtPrice = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <label
        className=" text-[#232323] text-base leading-[19.36px]"
        htmlFor="price"
      >
        Rate (Per Hour)
      </label>
      <Field
        placeholder="Enter court price"
        id="price"
        name="price"
        className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
      />
      <ErrorMessage name="price" component={TextError} />
    </div>
  );
};
