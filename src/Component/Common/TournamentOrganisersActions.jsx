import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TournamentOrganiserActionButtons } from "../../Constant/app";
import { ActionButtons } from "./ActionButtons";
import { showConfirmation } from "../../redux/Confirmation/confirmationSlice";

export const TournamentOrganiserActions = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlers = {
    edit: () => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("organiserId", id);
      navigate(`/tournament-organisers?${newSearchParams.toString()}`);
    },
    delete: () => {
      dispatch(
        showConfirmation({
          message:
            "Deleting this organiser will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Organiser",
          id,
        })
      );
    },
  };
  return (
    <ActionButtons
      actions={TournamentOrganiserActionButtons}
      actionHandlers={handlers}
      data={id}
    />
  );
};
