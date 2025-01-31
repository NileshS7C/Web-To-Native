import Button from "./Button";
import { setFormOpen } from "../../redux/tournament/addTournament";
import { showForm } from "../../redux/Venue/addVenue";
import { useNavigate } from "react-router-dom";

const NotCreated = ({ message, buttonText, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddTournament = () => {
    if (type === "tournament") {
      navigate("/tournaments/add");
    } else if (type === "venue") {
      dispatch(showForm());
    }
  };
  return (
    <div>
      <h1 className="mb-30 text-[22px] font-normal">{message}</h1>
      <Button
        onClick={handleAddTournament}
        disable={false}
        className="px-4 py-2 rounded text-[#FFFFFF]"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default NotCreated;
