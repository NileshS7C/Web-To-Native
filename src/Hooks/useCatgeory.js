import { useMutation } from "@tanstack/react-query";
import {
  createHybridFixture,
  deleteHybridFixture,
  updateHybridFixture,
} from "../api/Category";

export const useCreateHybridFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, payload }) => {
      return createHybridFixture(tournamentId, categoryId, payload);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateHybridFixture = () => {
  return useMutation({
    mutationFn: ({ tournamentId, categoryId, fixtureId, payload }) => {
      updateHybridFixture(tournamentId, categoryId, fixtureId, payload);
    },
    onSuccess: (data) => {
      console.log(data);
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
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
