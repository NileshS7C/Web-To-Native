import {
  Formik,
  ErrorMessage,
  Field,
  Form,
  FieldArray,
  useFormikContext,
} from "formik";
import TextError from "../Error/formError";
import { AvailableDays } from "../../Constant/tournament";
import { Amenities, Equipment } from "../../Constant/venue";
import { AiFillQuestionCircle } from "react-icons/ai";
import { uploadIcon, venueUploadImage } from "../../Assests";
import Button from "../Common/Button";
import * as yup from "yup";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addVenue } from "../../redux/Venue/venueActions";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters long.")
    .max(50, "Name cannot exceed 50 characters."),
  location: yup.object().shape({
    type: yup
      .string()
      .oneOf(["Point"], "Location type must be 'Point'.")
      .required("Location type is required."),
    coordinates: yup
      .array()
      .of(yup.number().required("Each coordinate must be a number."))
      .length(2, "Coordinates must contain exactly two numbers.")
      .required("Coordinates are required."),
  }),
  address: yup.object().shape({
    line1: yup.string().required("Line 1 is required."),
    line2: yup.string().notRequired(),
    city: yup.string().required("City is required."),
    state: yup.string().required("State is required."),
    postalCode: yup
      .string()
      .required("Postal Code is required.")
      .matches(/^\d{6}$/, "Postal Code must be 6 digits."),
  }),
  description: yup
    .string()
    .required("Description is required.")
    .max(500, "Description cannot exceed 500 characters."),
  availableDays: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([
          "All",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ])
    )
    .min(1, "At least one day must be selected.")
    .required("Available days are required."),
  openingTime: yup
    .string()
    .required("Opening time is required.")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Opening time must be in the format 'HH:MM AM/PM'."
    ),
  closingTime: yup
    .string()
    .required("Closing time is required.")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Closing time must be in the format 'HH:MM AM/PM'."
    ),
  amenities: yup
    .array()
    .of(yup.string())
    .min(1, "At least one amenity must be provided."),
  equipments: yup
    .array()
    .of(yup.string())
    .min(1, "At least one equipment item must be provided."),
  bannerImages: yup
    .array()
    .min(1, "At least one banner image must be uploaded."),

  layoutImages: yup
    .array()
    .min(1, "At least one layout image must be uploaded."),
  rating: yup.array().of(yup.number().min(0).max(5)),
  comments: yup.array().of(yup.string()),
});

const initialValues = {
  name: "",
  location: {
    type: "Point",
    coordinates: [-73.9667, 40.78],
  },
  address: {
    line1: "123 Main St",
    line2: "Suite 200",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
  },
  description: "",
  availableDays: [],
  openingTime: "",
  closingTime: "",
  amenities: [],
  equipments: [],
  bannerImages: [],
  layoutImages: [],
  rating: [],
  comments: [],
};

const VenueInfo = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.Venue);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);
    try {
      await dispatch(addVenue(values)).unwrap(); // Dispatch the thunk and unwrap the result
      resetForm(); // Reset the form on success
      alert("Venue created successfully!");
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323] rounded-3xl py-[50px] px-[48px]">
          <VenueBasicInfo />
          <VenueAddress />
          <VenueDescription />
          <VenueAvailableDays />
          <OpeningAndClosingTime />
          <VenueAmenities />
          <VenueEquipments />
          <VenueBannerImage />
          <VenueLayoutImage />
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

const VenueBasicInfo = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px] ">
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="name"
        >
          Venue Name
        </label>
        <Field
          placeholder="Enter Venue Name"
          id="name"
          name="name"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="name" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label
          className=" text-[#232323] text-base leading-[19.36px]"
          htmlFor="location"
        >
          Google Map
        </label>
        <Field
          placeholder="Enter Venue Location"
          id="location"
          name="location"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="location" component={TextError} />
      </div>
    </div>
  );
};

const VenueAddress = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-base leading-[19.36px] text-[#232323]">
        Venue Address
      </p>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.line1">
            Line 1
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="address.line1"
            name="address.line1"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="address.line1" component={TextError} />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.line2">
            Line 2
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="address.line2"
            name="address.line2"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="address.line2" component={TextError} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.city">
            City
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="address.city"
            name="address.city"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="address.city" component={TextError} />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <label className="text-xs text-[#232323]" htmlFor="address.state">
            State
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="address.state"
            name="address.state"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="address.state" component={TextError} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5">
          <label
            className="text-xs text-[#232323]"
            htmlFor="address.postalCode"
          >
            Pincode
          </label>
          <Field
            placeholder="Enter Venue Address"
            id="address.postalCode"
            name="address.postalCode"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name="address.postalCode" component={TextError} />
        </div>
      </div>
    </div>
  );
};

const VenueDescription = () => {
  return (
    <div className="grid grid-cols-1  gap-2">
      <p className=" text-[#232323] text-base leading-[19.36px] justify-self-start">
        Description
      </p>
      <Field
        id="description"
        name="description"
        placeholder="Enter Venue Description"
        className=" px-[19px] pt-[16px] h-[170px] border-[1px] border-[#DFEAF2] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        as="textarea"
      />
      <ErrorMessage name="description" component={TextError} />
    </div>
  );
};

const VenueAvailableDays = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className=" text-[#232323] text-base leading-[19.36px]">
        AvailableDays
      </p>

      <FieldArray name="availableDays">
        {({ form }) => {
          const handleSelectAll = (checked) => {
            if (checked) {
              form.setFieldValue("availableDays", [...AvailableDays]);
            } else {
              form.setFieldValue("availableDays", []);
            }
          };

          return (
            <div className="grid grid-cols-8 gap-2 w-full border rounded-[10px] border-[#DFEAF2] p-[20px]">
              {AvailableDays.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 text-[15px] leading-[18.15px] text-[#232323]"
                >
                  <Field
                    type="checkbox"
                    name="availableDays"
                    value={day}
                    checked={form.values.availableDays.includes(day)}
                    className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      const updatedValues = checked
                        ? [...form.values.availableDays, value]
                        : form.values.availableDays.filter((d) => d !== value);

                      if (value === "All") {
                        handleSelectAll(checked);
                      } else if (
                        form.values.availableDays.includes("All") &&
                        !checked
                      ) {
                        form.setFieldValue(
                          "availableDays",
                          updatedValues.filter((d) => d !== "All")
                        );
                      } else {
                        form.setFieldValue("availableDays", updatedValues);
                      }
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
          );
        }}
      </FieldArray>
      <ErrorMessage name="availableDays" component={TextError} />
    </div>
  );
};

const OpeningAndClosingTime = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5 w-full">
        <div className="flex flex-col items-start gap-2.5 w-full">
          <label
            className="text-[16px] leading-[19.3px] text-[#232323]"
            htmlFor="openingTime"
          >
            Opening Time
          </label>
          <Field
            placeholder="Select Opening Time"
            type="time"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="openingTime"
            id="openingTime"
          />
        </div>
        <ErrorMessage name="openingTime" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <div className="flex flex-col items-start gap-2.5 w-full">
          <label
            className="text-[16px] leading-[19.3px] text-[#232323]"
            htmlFor="closingTime"
          >
            Closing Time
          </label>
          <Field
            placeholder="Select Closing Time"
            type="time"
            className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="closingTime"
            id="closingTime"
          />
        </div>
        <ErrorMessage name="closingTime" component={TextError} />
      </div>
    </div>
  );
};

const VenueAmenities = () => {
  const { values } = useFormikContext();

  return (
    <div className="flex flex-col items-start gap-2.5">
      <div className="flex gap-[10px]">
        <p className="text-xs text-[#232323] ">Amenities</p>
        <AiFillQuestionCircle />
      </div>

      <FieldArray name="amenities">
        {({ push, remove, form }) => (
          <div className="grid grid-cols-5 p-[20px] gap-[20px] w-full border rounded-[10px] border-[#DFEAF2]">
            {Amenities.map((value, index) => {
              return (
                <label
                  className="text-[15px] text-[#232323] leading-[18px] flex items-center gap-[10px]"
                  key={`value-${index}`}
                >
                  <Field
                    type="checkbox"
                    name="amenities"
                    value={value}
                    checked={values.amenities.includes(value)}
                    className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none checked:bg-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        push(value);
                      } else {
                        const idx = values.amenities.indexOf(value);
                        if (idx !== -1) remove(idx);
                      }
                    }}
                  />
                  {value}
                </label>
              );
            })}
          </div>
        )}
      </FieldArray>
      <ErrorMessage name="amenities" component={TextError} />
    </div>
  );
};

const VenueEquipments = () => {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <div className="flex gap-[10px]">
        <p className="text-xs text-[#232323] ">Equipments</p>
        <AiFillQuestionCircle />
      </div>

      <FieldArray name="equipments">
        {({ form }) => (
          <div className="grid grid-cols-5 gap-2 w-full border rounded-[10px] border-[#DFEAF2]">
            {Equipment.map((value, index) => {
              return (
                <div
                  key={value}
                  className="flex gap-[10px] items-center p-[17px]"
                >
                  <Field
                    type="checkbox"
                    name="equipments"
                    checked={form.values.equipments.includes(value)}
                    value={value}
                    className=" w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none"
                  />
                  <label className="text-[15px] text-[#232323] leading-[18.15px]">
                    {value}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </FieldArray>
      <ErrorMessage name="equipments" component={TextError} />
    </div>
  );
};

const VenueBannerImage = () => {
  const { values, setFieldValue } = useFormikContext();
  const [previews, setPreviews] = useState([]);

  const handleRemoveImage = (index) => {
    const newBannerImages = values.bannerImages.filter((_, i) => i !== index);
    setFieldValue("bannerImages", newBannerImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };
  return (
    <div className=" flex flex-col items-start gap-2.5">
      <p className="text-xs text-[#232323]">Upload Image</p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] h-[133px]">
        <div className="flex flex-wrap gap-2.5 h-[133px] overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`venueImage-${index}`}
            >
              <img
                key={index}
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded h-full w-[223px]"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px]">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <FieldArray name="bannerImages">
              {({ form, field, meta, push }) => (
                <input
                  {...field}
                  id="bannerImages"
                  name="bannerImages"
                  onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) => {
                      return {
                        url: window.URL.createObjectURL(file),
                      };
                    });
                    const newPreviews = Array.from(e.target.files)
                      .filter((file) => file && file.type.startsWith("image/"))
                      .map((file) => ({
                        preview: window.URL.createObjectURL(file),
                        file,
                      }));
                    setPreviews((prev) => [...prev, ...newPreviews]);
                    form.setFieldValue("bannerImages", files);
                    e.target.value = "";
                  }}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                  multiple={true}
                />
              )}
            </FieldArray>
          </div>

          <ErrorMessage name="bannerImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
const VenueLayoutImage = () => {
  const { values, setFieldValue } = useFormikContext();
  const [previews, setPreviews] = useState([]);
  const handleRemoveImage = (index) => {
    const newBannerImages = values.layoutImages.filter((_, i) => i !== index);
    setFieldValue("layoutImages", newBannerImages);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };
  return (
    <div className="flex flex-col items-start gap-2.5">
      <p className="text-xs text-[#232323]">Venue Layout</p>

      <div className="grid grid-cols-[1fr_auto] gap-[30px] h-[133px]">
        <div className="flex flex-wrap gap-2.5 h-[133px] overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="relative flex h-[133px]"
              key={`layoutImage-${index}`}
            >
              <img
                key={index}
                src={previews[index]?.preview || venueUploadImage}
                alt={`Venue upload ${index + 1}`}
                className=" object-scale-down rounded h-full w-[223px]"
              />
              {previews[index]?.preview && (
                <IoIosCloseCircleOutline
                  className="absolute right-0 w-6 h-6 z-100 text-black  cursor-pointer "
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-start gap-2.5 w-[223px] h-[133px]">
          <div className="flex flex-col items-center justify-center border-[1px] border-dashed border-[#DFEAF2] rounded-[6px] h-[150px] w-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <img src={uploadIcon} alt="upload" className="w-8 h-8 mb-2" />

            <p className="text-sm text-[#5B8DFF]">
              Click to upload{" "}
              <span className="text-sm text-[#353535] "> or drag and drop</span>
            </p>

            <p className="text-xs text-[#353535] mt-1">(Max. File size: 5MB)</p>
            <FieldArray name="layoutImages">
              {({ form, field, meta }) => (
                <input
                  {...field}
                  id="layoutImages"
                  name="layoutImages"
                  onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) => {
                      return {
                        url: window.URL.createObjectURL(file),
                      };
                    });
                    const newPreviews = Array.from(e.target.files).map(
                      (file) => ({
                        preview: window.URL.createObjectURL(file),
                        file,
                      })
                    );
                    setPreviews((prev) => [...prev, ...newPreviews]);
                    form.setFieldValue("layoutImages", files);
                  }}
                  value=""
                  type="file"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-[150px]"
                  multiple={true}
                />
              )}
            </FieldArray>
          </div>

          <ErrorMessage name="layoutImages" component={TextError} />
        </div>
      </div>
    </div>
  );
};
export default VenueInfo;
