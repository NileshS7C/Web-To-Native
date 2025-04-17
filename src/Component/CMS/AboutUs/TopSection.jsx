import { useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  getAboutUsPageData,
  submitAboutUsForm,
} from "../../../redux/AboutUs/aboutUsActions";
import { useFetchData } from "../../../Hooks/CMS/useFetchData";
import { useSubmitForm } from "../../../Hooks/CMS/useSubmitData";
import { useImageUpload } from "../../../Hooks/CMS/useImageUpload";

import Card from "../../Common/Card";
import { Input } from "../../Common/Input";
import { Page } from "../../Common/PageTitle";
import { Toast } from "../../Common/Toast";
import Button from "../../Common/Button";

import TextError from "../../Error/formError";

import { CiEdit } from "react-icons/ci";
import { IoMdTrash } from "react-icons/io";
import { ImSpinner5 } from "react-icons/im";
import SwitchToggle from "../HomePage/SwitchToggle";

const checkValidURI = async (uri) => {
  try {
    new URL(uri);
    return true;
  } catch (_) {
    return false;
  }
};

const validators = {
  link: async (value) => {
    if (!value) return false;
    return await checkValidURI(value);
  },
  title: (value) => {
    return value && value.trim().length >= 3;
  },
  image: async (value) => {
    if (!value) return false;
    return await checkValidURI(value);
  },
};

export const TopSection = () => {
  const [form, setForm] = useState({
    title: "",
    image: "",
    link: "",
    isVisible: true,
  });

  const [editButtonClicked, setEditButtonClicked] = useState(null);
  const [hasValidationError, setHasValidationError] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    link: true,
    title: true,
    image: true,
  });

  const [disableForms, setDisableForms] = useState({
    link: false,
    image: false,
    title: false,
  });

  useEffect(() => {
    let newErrors;
    const validateForm = async () => {
      newErrors = { ...validationErrors };
      for (const field in validators) {
        if (form[field]) {
          newErrors[field] = await validators[field](form[field]);
        }
      }
      setValidationErrors(newErrors);
      const result =
        newErrors && Object.values(newErrors).some((value) => !value);
      setHasValidationError(result);
    };

    validateForm();
  }, [form]);

  const handleClick = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleClear = () => {
    const newFormValues = { ...form };
    for (const value in newFormValues) {
      newFormValues[value] = "";
    }
    setForm(newFormValues);
  };

  const handleEditButton = () => {
    setEditButtonClicked((prev) => !prev);
  };

  const { submitFormData, submissionError, isSubmitted, submitting } =
    useSubmitForm();

  const { data, error, loading, errorMessage, success } = useFetchData(
    getAboutUsPageData({ type: "topAboutUsSection" }),
    isSubmitted
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitFormData(
      submitAboutUsForm({
        type: "topAboutUsSection",
        body: form,
      })
    );
  };

  useEffect(() => {
    if (data?.length > 0) {
      setForm((prev) => ({
        ...prev,
        title: data[0]?.title ?? "",
        image: data[0]?.image ?? "",
        link: data[0]?.link ?? "",
        isVisible: data[0]?.isVisible ?? true,
      }));

      setDisableForms((prev) => ({
        ...prev,
        link: true,
        image: true,
        title: true,
      }));

      setEditButtonClicked(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.length > 0) {
      const newValues = { ...disableForms };
      for (const value in newValues) {
        newValues[value] = editButtonClicked;
      }
      setDisableForms(newValues);
    }
  }, [editButtonClicked]);

  /* 
   Image Uploading
  */

  const {
    handleFileUpload,
    isUploading,
    uploadError,
    previewURL,
    uploadSuccess,
  } = useImageUpload();

  useEffect(() => {
    if (previewURL) {
      setForm((prev) => ({ ...prev, image: previewURL }));
    }

    if (uploadError) {
      setValidationErrors((prev) => ({
        ...prev,
        image: false,
      }));
    }
  }, [uploadSuccess, uploadError, previewURL]);

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="w-full">
      <Page title={"Top Section"} />

      <div className="flex justify-center">
        {loading ? (
          <div className="w-1/2 h-[100px]  rounded-md p-4">
            <Skeleton
              count={3}
              height={20}
              width={"50%"}
              highlightColor="#add8e6"
              baseColor="#ffcccb"
            />
          </div>
        ) : (
          <Card>
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-md font-semibold line-clamp-4">
                  Toggle Visibility
                </p>
                <SwitchToggle
                  enabled={form?.isVisible}
                  onChange={() => {
                    if (editButtonClicked) return;
                    setForm((prev) => ({
                      ...prev,
                      isVisible: !prev.isVisible,
                    }));
                  }}
                />
              </div>

              {data?.length > 0 && (
                <button onClick={handleEditButton}>
                  <span>
                    <CiEdit className="w-6 h-6" />
                  </span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1 items-start ">
                  <label id="title">Heading</label>
                  <Input
                    id="title"
                    type={"text"}
                    name="title"
                    onChange={handleClick}
                    value={form.title}
                    disabled={disableForms.title}
                  />
                  {!validationErrors.title && (
                    <TextError>
                      <p>Heading must be greater than 3 character.</p>
                    </TextError>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <label id="link">Explore Now Link</label>
                  <Input
                    id="link"
                    type={"text"}
                    name="link"
                    onChange={handleClick}
                    value={form.link}
                    disabled={disableForms.link}
                  />
                  {!validationErrors.link && (
                    <TextError>
                      <p> Invalid URI</p>
                    </TextError>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start relative">
                  <label id="image">Upload Image</label>
                  <Input
                    id="image"
                    type={"file"}
                    name="image"
                    onChange={handleFileUpload}
                    disabled={disableForms.image}
                  />

                  {isUploading && (
                    <ImSpinner5 className="absolute right-1/2 w-[20px] h-[20px]" />
                  )}

                  {!validationErrors.image && (
                    <TextError>
                      <p>{uploadError}</p>
                    </TextError>
                  )}

                  {form.image && (
                    <div className="w-[100px]  relative">
                      <img
                        src={form.image}
                        alt="preview top section figure"
                        width="100px"
                        height="100px"
                        className=""
                      />
                      <button onClick={handleRemoveImage} type="button">
                        <IoMdTrash className="absolute top-0 -right-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-[#FFFFFF] hover:bg-gray-200"
                  type="button"
                  onClick={handleClear}
                  disabled={editButtonClicked}
                >
                  Clear
                </Button>
                <Button
                  className="px-4 py-2 rounded-lg shadow-md bg-gray-600  text-white hover:bg-gray-400"
                  type="submit"
                  loading={submitting}
                  disabled={editButtonClicked || hasValidationError}
                >
                  Save
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {success ||
        (isSubmitted && (
          <Toast
            successMessage={
              isSubmitted
                ? "Submitted Successfully!"
                : "Data fetched successfully!"
            }
          />
        ))}
      {error ||
        (submissionError && <Toast error={errorMessage || submissionError} />)}
    </div>
  );
};
