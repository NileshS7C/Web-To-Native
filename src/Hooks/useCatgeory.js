import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createHybridFixture,
  deleteChildFixture,
  deleteHybridFixture,
  getDoubleEliminationFinal,
  getFixtureById,
  updateHybridFixture,
} from "../api/Category";

export const useCreateHybridFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, payload}) => {
      return createHybridFixture(tournamentId, categoryId, payload);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateHybridFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, fixtureId, payload }) => {
      return updateHybridFixture(tournamentId, categoryId, fixtureId, payload);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteHybridFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, fixtureId }) =>
      deleteHybridFixture(tournamentId, categoryId, fixtureId),
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteChildFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, fixtureId }) =>
      deleteChildFixture(tournamentId, categoryId, fixtureId),
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetFixtureById=({tournamentId,categoryId,fixtureId})=>{
  return useQuery({
    queryKey: ["fixtureById", tournamentId, categoryId, fixtureId],
    queryFn: () => getFixtureById({ tournamentId, categoryId, fixtureId }),
    enabled: !!tournamentId && !!categoryId && !!fixtureId,
  });
}

export const useGetDEFinal = (
  { tournamentId, categoryId, fixtureId },
  options = {}
) => {
  return useQuery({
    queryKey: ["deFinal", tournamentId, categoryId, fixtureId],
    queryFn: () =>
      getDoubleEliminationFinal({ tournamentId, categoryId, fixtureId }),
    enabled:
      !!tournamentId &&
      !!categoryId &&
      !!fixtureId &&
      options.enabled !== false,
    retry: false,
    ...options,
  });
};
