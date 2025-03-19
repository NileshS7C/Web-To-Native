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
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("organiserId", id);
        return newParams;
      });
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
