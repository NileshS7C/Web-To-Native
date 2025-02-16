import { useEffect } from "react";
import { getSingle_TO } from "../redux/tournament/tournamentActions";
import { useDispatch, useSelector } from "react-redux";
import { UserProfile } from "../Component/Profile/userProfile";

function ProfilePage() {
  const dispatch = useDispatch();
  const { singleTournamentOwner } = useSelector((state) => state.GET_TOUR);

  useEffect(() => {
    dispatch(getSingle_TO("TOURNAMENT_OWNER"));
  }, [dispatch]);

  return <UserProfile onwerDetails={singleTournamentOwner} />;
}

export default ProfilePage;
