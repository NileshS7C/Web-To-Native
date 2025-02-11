import axiosInstance from "../Services/axios";

export const uploadImage = async (file) => {
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
        return { success: true, url: response.data.data.url };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Upload failed" };
    }
};
