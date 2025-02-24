import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/axios";

export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("uploaded-file", file);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/upload-file`,
        formData,
        config
      );

      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);

export const deleteUploadedImage = createAsyncThunk(
  "upload/deleteUploadedImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("existingUrl", file);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/upload-file`,
        formData,
        config
      );

      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);

export const getUploadedImages = createAsyncThunk(
  "upload/getUploadedImages",
  async ({ lastFileKey, limit }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let url;

      if (!lastFileKey) {
        url = `${import.meta.env.VITE_BASE_URL}/list-files?limit=${limit}`;
      } else {
        url = `${
          import.meta.env.VITE_BASE_URL
        }/list-files?lastFileKey=${lastFileKey}&limit=${limit}`;
      }
      const response = await axiosInstance.get(url, config);

      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          data: err.response.data,
          message: err.message,
        });
      } else {
        return rejectWithValue({
          message: err.message || "An unknown error occurred",
        });
      }
    }
  }
);
