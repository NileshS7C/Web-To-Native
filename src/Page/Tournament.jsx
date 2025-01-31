import React from "react";
import NotCreated from "../Component/Common/NotCreated";
import TournamentCreationForm from "../Component/Tournament/TournamentNav";
import { useDispatch, useSelector } from "react-redux";

function Tournament() {
  const dispatch = useDispatch();
  const { tounrnaments, error, isLoading, currentStep } = useSelector(
    (state) => state.Tournament
  );

  return <TournamentCreationForm />;
}

export default Tournament;
