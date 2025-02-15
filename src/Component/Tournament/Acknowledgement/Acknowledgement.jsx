import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setIsConfirmed } from "../../../redux/tournament/addTournament";
import { submitFinalTournament } from "../../../redux/tournament/tournamentActions";
import { showError } from "../../../redux/Error/errorSlice";

import Button from "../../Common/Button";
import { ConfirmationModalTour } from "../ConfimTournament";
import { TournamentSuccessPopUp } from "../SuccessPopUp";
import { ErrorModal } from "../../Common/ErrorModal";

export const AcknowledgementText = ({ ownerUserId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    step: 2,
    tournamentId: "",
    ownerUserId: "",
    acknowledgment: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessPop, setShowSuccessPop] = useState(false);
  const { isConfirmed } = useSelector((state) => state.Tournament);
  const { tournamentId } = useParams();
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setInitialValues((prev) => ({
      ...prev,
      tournamentId,
      ownerUserId,
      acknowledgment: isChecked,
    }));
  }, [tournamentId, ownerUserId]);

  const handleSubmit = async () => {
    try {
      if (!tournamentId || !ownerUserId || !initialValues.acknowledgment) {
        return;
      }

      setShowSuccessPop(false);

      const result = await dispatch(
        submitFinalTournament(initialValues)
      ).unwrap();

      if (!result.responseCode) {
        setShowSuccessPop(true);
        setTimeout(() => {
          navigate("/tournaments", { replace: true });
        }, [2000]);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(" error occured in submtting the final form", err);
      }

      setIsOpen(false);
      dispatch(
        showError({
          message: err?.data?.message || "Something went wrong!",
          onClose: "hideError",
        })
      );
    } finally {
      dispatch(setIsConfirmed(false));
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      handleSubmit();
    }
  }, [isConfirmed]);

  return (
    <div className="flex flex-col gap-[50px] pb-[50px]">
      <div className="flex items-start gap-[16px]">
        <input
          type="checkbox"
          name="Acknowledgement"
          id="Acknow"
          value="Acknowledgement"
          className=" w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none align-top"
          checked={isChecked}
          onChange={(e) => {
            setIsChecked(!isChecked);
            setInitialValues((prev) => ({
              ...prev,
              acknowledgment: e.target.checked,
            }));
          }}
        />
        <label
          htmlFor="Acknow"
          className="text-left text-base font-normal text-customColor leading-[19.36px]"
        >
          I hereby acknowledge that all the information I have provided in this
          Pickleball Tournament registration form is accurate and complete to
          the best of my knowledge, and I agree to adhere to all terms and
          conditions.
        </label>
      </div>

      <ErrorModal />

      <ConfirmationModalTour
        isOpen={isOpen}
        isLoading={false}
        setIsOpen={setIsOpen}
        message="after submission changes are not allowed by the tournament owner."
      />

      <TournamentSuccessPopUp open={showSuccessPop} />

      <Button
        className="text-[18px] font-[500]  text-[#FFFFFF] leading-[21.78px] w-[190px] h-[50px] rounded-[10px] bg-[#1570EF] ml-auto"
        type="button"
        onClick={handleClick}
        disabled={!initialValues.acknowledgment}
      >
        Submit for Review
      </Button>
    </div>
  );
};

AcknowledgementText.propTypes = {
  ownerUserId: PropTypes.string,
};
