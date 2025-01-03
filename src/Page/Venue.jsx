import NotCreated from "../Component/Common/NotCreated";
import VenueListing from "../Component/Venue/VenueListing";
import { useSelector } from "react-redux";
import VenueNavBar from "../Component/Venue/VenueNavBar";
import { useParams } from "react-router-dom";

function Venue() {
  const { venues } = useSelector((state) => state.getVenues);
  const { id = "" } = useParams();
  return (
    <div>
      <div className="rounded-3xl">
        {venues.length === 0 && (
          <NotCreated
            message="You haven't created any Venue yet! Start by adding a new Venue."
            buttonText="Add Venue"
            type="venue"
          />
        )}
        <VenueListing />
        {id && <VenueNavBar />}
      </div>
    </div>
  );
}

export default Venue;
