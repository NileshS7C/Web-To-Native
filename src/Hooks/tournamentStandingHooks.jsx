import { useQuery } from "@tanstack/react-query";
import { getFixtureId, getTournamentStanding } from "../api/TournamentStanding";

export const useGetFixtureId = ({ tournamentId, categoryId }) => {
  return useQuery({
    queryKey: ["tournamentStanding", tournamentId, categoryId],
    queryFn: () => getFixtureId({tournamentId, categoryId}),
    enabled: !!tournamentId && !!categoryId,
  })
}

export const useGetTournamentStanding = ({ tournamentId, categoryId, fixtureId }) => {
  return useQuery({
    queryKey: ["tournamentStanding", tournamentId, categoryId, fixtureId],
    queryFn: () => getTournamentStanding({tournamentId, categoryId, fixtureId}),
    enabled: !!tournamentId && !!categoryId &&!!fixtureId,
  })
}
