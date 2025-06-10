import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/Profile";

export const useGetProfile=()=>{
    return useQuery({
        queryKey:["profile"],
        queryFn:getProfile,
        enabled:true
    })
}

