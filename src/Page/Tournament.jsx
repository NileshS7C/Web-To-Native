import React from "react";
import NotCreated from "../Component/Common/NotCreated";
import TournamentNavBar from "../Component/Tournament/TournamentNav";
import { useDispatch, useSelector } from "react-redux";

function Tournament() {
  const dispatch = useDispatch();
  const { tounrnaments, error, isLoading, currentStep } = useSelector(
    (state) => state.Tournament
  );

  return <TournamentNavBar />;
}

export default Tournament;
