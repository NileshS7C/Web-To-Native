import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const Authentication = ({ children }) => {
 const cookiesRoles=cookies.get("userRoles");
  const { userRoles } = useSelector((state) => state.auth);
  if (cookiesRoles?.length > 0 || userRoles?.length > 0) {
    return children;
  }

  return <Navigate to="/login" replace={true} />;
};

export default Authentication;
