import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Authentication = ({ children }) => {
  const [cookies, setCookies] = useCookies(["userRoles"]);
  const { userRoles } = useSelector((state) => state.auth);
  if (cookies?.userRoles?.length > 0 || userRoles?.length > 0) {
    return children;
  }

  return <Navigate to="/login" replace={true} />;
};

export default Authentication;
