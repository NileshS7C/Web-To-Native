import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkRoles } from "../../utils/roleCheck";
import { ADMIN_ROLES, EVENT_OWNER_ROLES } from "../../Constant/Roles";

import Button from "../Common/Button";
import { ConfirmationModalEvent } from "./ConfirmEventModal";
import { EventSuccessPopUp } from "./EventSuccessPopUp";
import { ErrorModal } from "../Common/ErrorModal";
import { useUpdateEvent } from "../../Hooks/SocialEventsHooks";

export const AcknowledgementText = ({ ownerUserId, disabled }) => {
  const navigate = useNavigate();
  const { mutate: updateEvent, isLoading } = useUpdateEvent();
  const { eventId } = useParams();

  console.log("🚀 ~ AcknowledgementText ~ Component Initialized", {
    eventId,
    ownerUserId,
    disabled
  });

  const [initialValues, setInitialValues] = useState({
    step: 2,
    eventId: "",
    ownerUserId: "",
    acknowledgment: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessPop, setShowSuccessPop] = useState(false);

  console.log("🚀 ~ AcknowledgementText ~ Using Owner User ID from Props", {
    ownerUserId,
    hasOwnerUserId: !!ownerUserId
  });

  const handleClick = () => {
    console.log("🚀 ~ AcknowledgementText ~ Handle Click - Opening Confirmation Modal", {
      isChecked,
      ownerUserId,
      eventId,
      initialValues
    });
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const newValues = {
      step: 2,
      eventId,
      ownerUserId: ownerUserId,
      acknowledgment: isChecked,
    };

    console.log("🚀 ~ AcknowledgementText ~ Initial Values Updated", {
      previousValues: initialValues,
      newValues,
      dependencies: { eventId, ownerUserId, isChecked }
    });

    setInitialValues(newValues);
  }, [eventId, ownerUserId, isChecked]);

  const handleSubmit = () => {
    console.log("🚀 ~ AcknowledgementText ~ Handle Submit - Starting Submission Process", {
      eventId,
      ownerUserId,
      acknowledgment: initialValues.acknowledgment,
      fullPayload: initialValues
    });

    try {
      if (!eventId || !ownerUserId || !initialValues.acknowledgment) {
        console.log("❌ ~ AcknowledgementText ~ Validation Failed", {
          eventId: !!eventId,
          ownerUserId: !!ownerUserId,
          acknowledgment: initialValues.acknowledgment
        });
        return;
      }

      console.log("✅ ~ AcknowledgementText ~ Validation Passed - Calling API", {
        payload: initialValues
      });

      setShowSuccessPop(false);

      updateEvent(initialValues, {
        onSuccess: (data) => {
          console.log("🎉 ~ AcknowledgementText ~ API Success", {
            responseData: data,
            userRole: checkRoles(ADMIN_ROLES) ? 'ADMIN' : checkRoles(EVENT_OWNER_ROLES) ? 'EVENT_OWNER' : 'UNKNOWN'
          });
          setShowSuccessPop(true);
          setTimeout(() => {
            console.log("🚀 ~ AcknowledgementText ~ Navigating to Social Events List");
            navigate("/social-events", { replace: true });
          }, 2000);
        },
        onError: (err) => {
          console.error("❌ ~ AcknowledgementText ~ API Error", {
            error: err,
            payload: initialValues
          });
          if (process.env.NODE_ENV === "development") {
            console.log("Error occurred in submitting the final form", err);
          }
          setIsOpen(false);
        }
      });
    } catch (err) {
      console.error("❌ ~ AcknowledgementText ~ Catch Block Error", {
        error: err,
        payload: initialValues
      });
      if (process.env.NODE_ENV === "development") {
        console.log("Error occurred in submitting the final form", err);
      }
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    console.log("🚀 ~ AcknowledgementText ~ Handle Confirm - User Confirmed Submission");
    setIsOpen(false);
    handleSubmit();
  };

  // Determine button text based on role
  const getButtonText = () => {
    if (checkRoles(ADMIN_ROLES)) {
      return "Publish Event";
    } else if (checkRoles(EVENT_OWNER_ROLES)) {
      return "Submit for Review";
    }
    return "Submit";
  };

  // Determine confirmation message based on role
  const getConfirmationMessage = () => {
    if (checkRoles(ADMIN_ROLES)) {
      return "Are you sure you want to publish this event? Once published, it will be visible to all users.";
    } else if (checkRoles(EVENT_OWNER_ROLES)) {
      return "After submission changes are not allowed by the event owner.";
    }
    return "Are you sure you want to submit this event?";
  };

  return (
    <div className="flex flex-col gap-[50px] pb-[50px]">
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
          disabled={disabled}
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
        disabled={disabled || !isChecked}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

AcknowledgementText.propTypes = {
  ownerUserId: PropTypes.string,
  disabled: PropTypes.bool,
};

const Acknowledgement = () => {
  return <AcknowledgementText />;
};

export default Acknowledgement;