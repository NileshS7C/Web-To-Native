import { useMutation } from "@tanstack/react-query";
import { updateGroupName, updateRoundName } from "../api/fixtures";

export const useUpdateGroupName = () => {
  return useMutation({
    mutationFn: ({ tournamentID, categoryId, fixtureId, groupObj }) =>
      updateGroupName({ tournamentID, categoryId, fixtureId, groupObj }),

    onSuccess: () => {
      console.log("✅ Group name updated successfully");
    },
    onError: (error) => {
      console.error("❌ Error updating group name:", error);
    },
  });
};

export const useUpdateRoundName = () => {
  return useMutation({
    mutationFn: ({ tournamentID, categoryId, fixtureId, roundObj }) =>
      updateRoundName({ tournamentID, categoryId, fixtureId, roundObj }),

    onSuccess: () => {
      console.log("✅ Group name updated successfully");
    },
    onError: (error) => {
      console.error("❌ Error updating group name:", error);
    },
  });
};
