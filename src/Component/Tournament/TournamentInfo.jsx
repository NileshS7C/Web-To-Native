import { imageUpload, uploadIcon, calenderIcon } from "../../Assests";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../Common/Button";
import DatePicker from "react-datepicker";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  FieldArray,
} from "formik";
import * as yup from "yup";
import TextError from "../Error/formError";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFiles,
  updateFiles,
  setSponserName,
  addSponserRow,
  deleteRow,
  editRow,
  stepReducer,
} from "../../redux/tournament/addTournament";
import { saveFormData } from "../../redux/tournament/formSlice";
import { BiX } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";

const validationSchema = yup.object({
  organizerName: yup.string().required("Name is required"),
  tournamentName: yup.string().required("Please provide a tournament name."),
  description: yup.string(),
  tournamentStartDate: yup
    .date()
    .required("Please provide the tournament start date.")
    .min(new Date(), "Tournament start date must be today or later."),

  tournamentEndDate: yup
    .date()
    .nullable()
    .required("Please provide the tournament End date.")
    .test(
      "is-after-today",
      "Tournament end date must be today or later.",
      (value) => !value || value >= new Date()
    )
    .min(
      yup.ref("tournamentStartDate"),
      "Tournament end date must be equal to or after the start date."
    ),

  bannerImage: yup.object().shape({
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

  sponserImage: yup
    .mixed()
    .test("file-size", "Sponser banner image is too large", (value) => {
      if (!value) return true;
      return value.size <= 100 * 1024; // 100 KB
    })
    .test(
      "file-type",
      "Sponser banner image should be of valid image type",
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }
    ),

  bookingStartDate: yup
    .date()
    .nullable()
    .required("Booking end date is required.")
    .min(new Date(), "Start date should be today or later"),
  bookingEndDate: yup
    .date()
    .nullable()
    .required("Booking end date is required.")
    .min(
      yup.ref("bookingStartDate"),
      "End date must be equal to or after the start date"
    ),
  sponserName: yup.string(),
});

const initialValues = {
  organizerName: "Pickle Paddle & Co.",
  tournamentName: "",
  description: "",
  tournamentStartDate: null,
  tournamentEndDate: null,
  bannerImage: {
    desktop: "",
    mobile: "",
  },
  sponserImage: "",
  bookingStartDate: null,
  bookingEndDate: null,
  sponserName: "",
  rows: [],
};

export const TournamentInfo = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.Tournament);
  console.log(" form data after saving the form", formData);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        dispatch(saveFormData(values));
      }}
    >
      <Form>
        <div className="flex flex-col gap-[30px] bg-[#FFFFFF] text-[#232323]">
          <TournamentBasicInfo />
          <TournamentDescription />
          <TournamentDates />
          <TournamentFileUpload />
          <TournamentSponserTable />
          <TournamentBookingDates />
          <Button
            className="w-[150px] h-[60px] bg-[#1570EF] ml-auto rounded-[8px]"
            type="submit"
            onClick={() => dispatch(stepReducer("basic info"))}
          >
            Next
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

const TournamentBasicInfo = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="organizerName">
          Tournament Organizer Name
        </label>
        <Field
          placeholder="Pickle Paddle & Co."
          id="organizerName"
          name="organizerName"
          disabled
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="organizerName" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="tournamentName">
          Tournament Name
        </label>
        <Field
          placeholder="Enter Tournament Name"
          id="tournamentName"
          name="tournamentName"
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ErrorMessage name="tournamentName" component={TextError} />
      </div>
    </div>
  );
};

const TournamentDescription = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <label
        className="text-xs text-[#232323] justify-self-start"
        htmlFor="description"
      >
        Description
      </label>
      <Field
        id="description"
        name="description"
        placeholder="Enter Tournament Description"
        className=" px-[19px] pt-[16px] h-[170px] border-[1px] border-[#DFEAF2] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        as="textarea"
      />
    </div>
  );
};

const TournamentFileUpload = () => {
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
            Click to upload{" "}
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

const TournamentSponserTable = () => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();
  const { sponserFiles, spnonserTable, isEditClicked, editRowIndex } =
    useSelector((state) => state.Tournament);

  const handleAddSponsor = (push) => {
    push({
      sponsorName: values.sponserName,
      sponsorImage: values.sponserImage,
    });
    dispatch(setSponserName(values.sponserName));
    dispatch(addSponserRow(values.sponserName));
    setFieldValue("sponserName", "");
    setFieldValue("sponserImage", "");
  };

  const handleDeleteRow = (remove, index, name) => {
    remove(index);
    dispatch(deleteRow(name));
  };

  return (
    <FieldArray name="rows">
      {({ push, remove, form }) => (
        <div className="grid grid-cols-1  gap-2.5">
          <p className="text-base text-[#232323] justify-self-start">
            Sponsers
          </p>
          <table className="border-[1px] border-[#EAECF0] rounded-[8px] table-auto">
            <thead>
              <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b-[1px] h-[44px] ">
                <th className="text-left p-2">S.No.</th>
                <th className="text-left p-2">Sponsor Logo</th>
                <th className="text-left p-2">Sponser Name</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {form.values.rows.map((row, index) => (
                <tr className="text-sm text-[#667085] " key={`{index}.sponser`}>
                  <td className="text-left p-2">{index + 1}</td>
                  <td className=" text-left p-2">
                    <div className=" flex relative ">
                      <img
                        src={row.sponsorImage}
                        alt="sponsor logo"
                        className=" w-8 h-8 "
                      />
                    </div>
                  </td>
                  <td className="text-left p-2">
                    {isEditClicked && editRowIndex === index ? (
                      <Field name={`rows.${index}.sponsorName`}>
                        {({ field }) => (
                          <input
                            {...field}
                            id={`rows.${index}.sponsorName`}
                            name={`rows.${index}.sponsorName`}
                            placeholder="Edit Sponsor Name"
                            className="w-[80%] px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </Field>
                    ) : (
                      <Field name={`rows.${index}.sponsorName`}>
                        {({ form, field }) => {
                          return (
                            <input
                              {...field}
                              id={`rows.${index}.sponsorName`}
                              name={`rows.${index}.sponsorName`}
                              placeholder="Enter Sponsor Name"
                              className="appearance-none border-none focus:outline-none focus:ring-0 cursor-default"
                              value={form.values.rows[index].sponsorName}
                              readOnly
                            />
                          );
                        }}
                      </Field>
                    )}
                  </td>
                  <td className="text-left p-2">
                    <div className="flex gap-4">
                      <RiDeleteBin6Line
                        className="w-4 h-4 cursor-pointer"
                        onClick={() =>
                          handleDeleteRow(remove, index, row.sponsorName)
                        }
                      />
                      <MdOutlineModeEditOutline
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          dispatch(editRow(index));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="text-sm text-[#667085] ">
                <td className="text-left p-2 ">{spnonserTable.length + 1}</td>
                <td className=" text-left p-2">
                  <div className=" flex relative ">
                    <img
                      src={!sponserFiles.length ? imageUpload : sponserFiles}
                      alt="sponsor logo"
                      className="w-8 h-8 "
                    />
                    <Field name="sponserImage">
                      {({ form, field }) => (
                        <input
                          {...field}
                          id="sponserImage"
                          name="sponserImage"
                          onChange={(e) => {
                            const files = e.target.files[0];

                            const url = window.URL.createObjectURL(files);

                            dispatch(
                              updateFiles({ name: url, source: "sponsor" })
                            );
                            form.setFieldValue("sponserImage", url ? url : "");
                          }}
                          value=""
                          type="file"
                          className="absolute  w-8 h-8  inset-0 opacity-0 cursor-pointer top-0 left-0 transform -translate-y-2"
                          multiple={false}
                        />
                      )}
                    </Field>
                  </div>

                  <ErrorMessage name="sponserName" component={TextError} />
                </td>
                <td className="text-left p-2">
                  <Field
                    id="sponserName"
                    name="sponserName"
                    placeholder="Enter Sponsor Name"
                    className="w-[80%] px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="text-left p-2">
                  <Button
                    className="w-[60px] h-[40px] rounded-[8px]"
                    type="button"
                    disabled={!sponserFiles.length || !values.sponserName}
                    onClick={() => handleAddSponsor(push)}
                  >
                    ADD
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </FieldArray>
  );
};

const TournamentDates = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="tournamentStartDate">
          Tournament Start Date
        </label>
        <div className="relative">
          <Field name="tournamentStartDate">
            {({ field, form }) => (
              <>
                <DatePicker
                  id="tournamentStartDate"
                  name="tournamentStartDate"
                  placeholderText="Select date"
                  toggleCalendarOnIconClick
                  selected={field.value}
                  className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(date) =>
                    form.setFieldValue("tournamentStartDate", date)
                  }
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage name="tournamentStartDate" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="tournamentEndDate">
          Tournament End Date
        </label>
        <div className="relative">
          <Field name="tournamentEndDate">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="tournamentEndDate"
                  name="tournamentEndDate"
                  placeholderText="Select date"
                  selected={field.value}
                  toggleCalendarOnIconClick
                  className=" w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(date) =>
                    form.setFieldValue("tournamentEndDate", date)
                  }
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage name="tournamentEndDate" component={TextError} />
      </div>
    </div>
  );
};

const TournamentBookingDates = () => {
  return (
    <div className="grid grid-cols-2 gap-[30px]">
      <div className="flex flex-col items-start gap-2.5 ">
        <label className="text-xs text-[#232323]" htmlFor="bookingStartDate">
          Booking Start Date
        </label>

        <div className="relative">
          <Field name="bookingStartDate">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="bookingStartDate"
                  name="bookingStartDate"
                  placeholderText="Select date"
                  startDate=""
                  toggleCalendarOnIconClick
                  className="w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  selected={field.value}
                  onChange={(date) =>
                    form.setFieldValue("bookingStartDate", date)
                  }
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage name="bookingStartDate" component={TextError} />
      </div>
      <div className="flex flex-col items-start gap-2.5">
        <label className="text-xs text-[#232323]" htmlFor="bookingEndDate">
          Booking End Date
        </label>
        <div className="relative">
          <Field name="bookingEndDate">
            {({ form, field }) => (
              <>
                <DatePicker
                  id="bookingEndDate"
                  name="bookingEndDate"
                  placeholderText="Select date"
                  startDate=""
                  toggleCalendarOnIconClick
                  className=" w-full z-10 px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  selected={field.value}
                  onChange={(date) =>
                    form.setFieldValue("bookingEndDate", date)
                  }
                />
                <img
                  src={calenderIcon}
                  alt="calenderIcon"
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </>
            )}
          </Field>
        </div>
        <ErrorMessage name="bookingEndDate" component={TextError} />
      </div>
    </div>
  );
};
