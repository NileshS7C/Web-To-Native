import { UserProfile } from "../Component/Profile/userProfile";
import { useGetProfile } from "../Hooks/useProfile";
import { ErrorMessage } from "formik";
import Spinner from "../Component/Common/Spinner";

function ProfilePage() {
  const {data:profileData,isLoading:isProfileLoading,isError:isProfileError}=useGetProfile()  
  if(isProfileLoading){
    return <Spinner/>
  }
  if(isProfileError){
    return <ErrorMessage messsage={isProfileError}/>
  }
  return <UserProfile onwerDetails={profileData} />;
}

export default ProfilePage;
