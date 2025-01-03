import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { setFormOpen } from "../../redux/tournament/addTournament";
import { showForm } from "../../redux/Venue/addVenue";

const NotCreated = ({ message, buttonText, type }) => {
  const dispatch = useDispatch();
  const handleAddTournament = () => {
    if (type === "tournament") {
      dispatch(setFormOpen());
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
