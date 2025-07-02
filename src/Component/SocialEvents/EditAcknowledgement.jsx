import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateEvent } from '../../Hooks/SocialEventsHooks';
import { checkRoles } from '../../utils/roleCheck';
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from '../../Constant/Roles';
import Button from '../Common/Button';
import { ConfirmationModalEvent } from './ConfirmEventModal';
import { EventSuccessPopUp } from './EventSuccessPopUp';
import { ErrorModal } from '../Common/ErrorModal';
import { useSelector } from 'react-redux';

const EditAcknowledgement = ({ isEdit }) => {
  const navigate = useNavigate();
  const { mutate: updateEvent, isLoading } = useUpdateEvent();
  const { eventId } = useParams();
  const ownerId = useSelector((state) => state.user.id);

  const [initialValues, setInitialValues] = useState({
    step: 2,
    eventId: "",
    ownerUserId: "",
    acknowledgment: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessPop, setShowSuccessPop] = useState(false);

  useEffect(() => {
    const newValues = {
      step: 2,
      eventId,
      ownerUserId: ownerId,
      acknowledgment: isChecked,
    };

    setInitialValues(newValues);
  }, [eventId, ownerId, isChecked]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = () => {
    try {
      if (!eventId || !ownerId || !initialValues.acknowledgment) {
        return;
      }

      setShowSuccessPop(false);

      updateEvent(initialValues, {
        onSuccess: (data) => {
          setShowSuccessPop(true);
          setTimeout(() => {
            navigate("/social-events", { replace: true });
          }, 2000);
        },
        onError: (err) => {
          if (process.env.NODE_ENV === "development") {
            console.log("Error occurred in submitting the final form", err);
          }
          setIsOpen(false);
        }
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log("Error occurred in submitting the final form", err);
      }
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    handleSubmit();
  };

  const getButtonText = () => {
    if (checkRoles(ADMIN_ROLES)) {
      return "Publish Event";
    } else if (checkRoles(EVENT_OWNER_ROLES)) {
      return "Submit for Review";
    }
    return "Submit";
  };

  const getConfirmationMessage = () => {
    if (checkRoles(ADMIN_ROLES)) {
      return "Are you sure you want to publish this event? Once published, it will be visible to all users.";
    } else if (checkRoles(EVENT_OWNER_ROLES)) {
      return "After submission changes are not allowed by the event owner.";
    }
    return "Are you sure you want to submit this event?";
  };

  return (
    <div className="flex flex-col gap-[50px] pt-[50px]">
      <div className="flex items-start gap-[16px]">
        <input
          type="checkbox"
          name="Acknowledgement"
          id="Acknow"
          value="Acknowledgement"
          className="w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none align-top"
          checked={isChecked}
          onChange={(e) => {
            setIsChecked(!isChecked);
            setInitialValues((prev) => ({
              ...prev,
              acknowledgment: e.target.checked,
            }));
          }}
          disabled={!isEdit}
        />
        <label
          htmlFor="Acknow"
          className="text-left text-base font-normal text-customColor leading-[19.36px]"
        >
          I hereby acknowledge that all the information I have provided in this
          Social Event registration form is accurate and complete to
          the best of my knowledge, and I agree to adhere to all terms and
          conditions.
        </label>
      </div>

      <ErrorModal />

      <ConfirmationModalEvent
        isOpen={isOpen}
        isLoading={isLoading}
        setIsOpen={setIsOpen}
        onConfirm={handleConfirm}
        message={getConfirmationMessage()}
      />

      <EventSuccessPopUp open={showSuccessPop} />

      <Button
        className="text-[18px] font-[500] text-[#FFFFFF] leading-[21.78px] w-[190px] h-[50px] rounded-[10px] bg-[#1570EF] ml-auto"
        type="button"
        onClick={handleClick}
        disabled={!isEdit || !isChecked}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default EditAcknowledgement;