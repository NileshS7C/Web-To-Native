import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Authentication = ({ children }) => {
  const [cookies, setCookies] = useCookies(["userRole"]);
  const { userRole } = useSelector((state) => state.auth);

  if (cookies?.userRole || userRole) {
    return children;
  }

  return <Navigate to="/login" replace={true} />;
};

export default Authentication;
