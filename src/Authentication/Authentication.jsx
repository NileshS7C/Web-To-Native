import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const Authentication = ({ children }) => {
  const [cookies, setCookies] = useCookies(["userRole"]);

  if (cookies?.userRole) {
    return children;
  }

  return <Navigate to="/login" replace={true} />;
};

export default Authentication;
