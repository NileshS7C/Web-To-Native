import axiosInstance from "../Services/axios";
import { API_END_POINTS } from "../Constant/routes";
export const getProfile= async()=>{
    const baseURl = import.meta.env.VITE_BASE_URL;
    const endpoint= `${baseURl}${API_END_POINTS.profile.GET.getProfile()}`
    let config={
        method:"GET",
        url:endpoint,
        withCredentials:true
    }
    try {       
        const response= await axiosInstance.request(config)
        return response?.data?.data || {};
    } catch (error) {
        console.error("🚀 ~ getProfile ~ error:", error)
        throw error.response?.data || error 
    }
}

