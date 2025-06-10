import { useOwnerDetailsContext } from "../../../Providers/onwerDetailProvider";
import ErrorBanner from "../../Common/ErrorBanner";
import { tournamentFullAccessRoles } from "../../../Constant/event";
const EventAccessWrapper = ({ children }) => {
  const { rolesAccess } = useOwnerDetailsContext();
  const hasAccess = tournamentFullAccessRoles.includes(rolesAccess?.tournament);
  if (!hasAccess) {
    return <ErrorBanner message="You don't have access to this resource" />;
  }

  return <>{children}</>;
};

export default EventAccessWrapper;
