import { createContext, useContext, useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getSingle_TO } from "../redux/tournament/tournamentActions";

const OnwerDetailsContext = createContext(null);

export const useOwnerDetailsContext = () => {
  return useContext(OnwerDetailsContext);
};

export const OwnerDetailContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [cookies, setCookies] = useCookies(["name", "userRole"]);
  const { singleTournamentOwner } = useSelector((state) => state.GET_TOUR);

  useEffect(() => {
    const userRole = cookies.userRole;

    if (!userRole) {
      dispatch(userLogout());
    } else if (userRole === "TOURNAMENT_OWNER") {
      dispatch(getSingle_TO("TOURNAMENT_OWNER"));
    } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      dispatch(getSingle_TO("ADMIN"));
    }
  }, [cookies?.userRole]);
  const value = useMemo(
    () => ({
      singleTournamentOwner,
    }),
    [singleTournamentOwner]
  );

  return (
    <OnwerDetailsContext.Provider value={value}>
      {children}
    </OnwerDetailsContext.Provider>
  );
};
