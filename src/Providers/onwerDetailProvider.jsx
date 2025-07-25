import { createContext, useContext, useMemo, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from "react-redux";
import { getAll_TO, getSingle_TO } from "../redux/tournament/tournamentActions";
import { userLogout } from "../redux/Authentication/authActions";
import { ADMIN_ROLES, TOURNAMENT_OWNER_ROLES } from "../Constant/Roles";

const OnwerDetailsContext = createContext(null);

export const useOwnerDetailsContext = () => useContext(OnwerDetailsContext);

const generateRolesAccess = (userRoles = []) => {
  return userRoles?.reduce(
    (access, role) => {
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        access.tournament = "ADMIN";
        access.venue = "ADMIN";
        access.event = "ADMIN";
        access.CMS = "ADMIN";
      } else if (role === "TOURNAMENT_OWNER") {
        access.tournament = "TOURNAMENT_OWNER";
      } else if (role === "TOURNAMENT_BOOKING_OWNER") {
        access.tournament = "TOURNAMENT_BOOKING_OWNER";
      } else if (role === "VENUE_OWNER") {
        access.venue = "VENUE_OWNER";
      } else if (role === "EVENT_OWNER") {
        access.event = "EVENT_OWNER";
      }
      return access;
    },
    {
      tournament: null,
      venue: null,
      event: null,
      CMS: null,
    }
  );
};

export const OwnerDetailContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cookieRoles = Cookies.get("userRoles");
  const parsedRoles = useMemo(() => {
    try {
      return cookieRoles ? JSON.parse(cookieRoles) : null;
    } catch (e) {
      console.error("Failed to parse roles from cookies:", e.message);
      return null;
    }
  }, [cookieRoles]);

  const { userRoles: reduxRoles } = useSelector((state) => state.auth);
  const { singleTournamentOwner } = useSelector((state) => state.GET_TOUR);
  const { tournamentOwners } = useSelector((state) => state.Tournament);

  const userRoles = useMemo(() => {
    return reduxRoles?.length ? reduxRoles : parsedRoles || [];
  }, [reduxRoles, parsedRoles]);


  const rolesAccess = useMemo(() => {
    return generateRolesAccess(userRoles);
  }, [userRoles]);

  useEffect(() => {
    if (!userRoles?.length) {
      dispatch(userLogout());
      return;
    }

    const role = rolesAccess?.tournament;
    if (!role) return;

    if (ADMIN_ROLES.includes(role)) {
      dispatch(getAll_TO({ currentPage: 1, limit: 100 }));
    } else if (TOURNAMENT_OWNER_ROLES.includes(role)) {
      dispatch(getSingle_TO(role));
    }
  }, [dispatch, userRoles, rolesAccess?.tournament]);

  const value = useMemo(
    () => ({
      singleTournamentOwner: singleTournamentOwner || {},
      tournamentOwners,
      tournamentOwnerUserId: singleTournamentOwner?.id,
      rolesAccess,
    }),
    [singleTournamentOwner, tournamentOwners, rolesAccess]
  );

  return (
    <OnwerDetailsContext.Provider value={value}>
      {children}
    </OnwerDetailsContext.Provider>
  );
};