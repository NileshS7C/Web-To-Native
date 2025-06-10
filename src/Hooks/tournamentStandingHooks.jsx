import { useQuery } from "@tanstack/react-query";
import { getFixtureId, getTournamentStanding } from "../api/TournamentStanding";

export const useGetFixtureId = ({ tournamentId, categoryId ,type}) => {
  return useQuery({
    queryKey: ["tournamentStanding", tournamentId, categoryId,type],
    queryFn: () => getFixtureId({tournamentId, categoryId,type}),
    enabled: !!tournamentId && !!categoryId,
  })
}

export const useGetTournamentStanding = ({ tournamentId, categoryId, fixtureId ,type}) => {
  return useQuery({
    queryKey: ["tournamentStanding", tournamentId, categoryId, fixtureId,type],
    queryFn: () => getTournamentStanding({tournamentId, categoryId, fixtureId,type}),
    enabled: !!tournamentId && !!categoryId &&!!fixtureId,
  })
}
