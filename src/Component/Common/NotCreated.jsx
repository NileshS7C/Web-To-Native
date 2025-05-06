import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleOrganiserModal } from "../../redux/tournament/tournamentOrganiserSlice";

const NotCreated = ({ message, buttonText, type, disable = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleRoutingThroughButton = () => {
    if (type === "tournament") {
      navigate("/tournaments/add");
    } else if (type === "venue") {
      navigate("/venues/new");
    } else if (type === "organizers") {
      console.log("Dispatching toggleOrganiserModal action");
      dispatch(toggleOrganiserModal());
      console.log("toggleOrganiserModal action dispatched");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="mb-30 text-[22px] font-normal">{message}</h1>
      {buttonText && (
        <Button
          onClick={handleRoutingThroughButton}
          disable={disable}
          className="px-4 py-2 rounded text-[#FFFFFF] disabled:bg-blue-200"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default NotCreated;
