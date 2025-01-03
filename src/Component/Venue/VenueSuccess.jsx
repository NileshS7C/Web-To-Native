import { TiTick } from "react-icons/ti";
import PropTypes from "prop-types";
export const VenueCreatedSuccessPopUp = ({ message }) => {
  return (
    <div className="flex flex-col gap-2.5 items-center bg-customColor rounded-[15px] py-[30px] px-[50px] w-[590px] h-[200px]">
      <TiTick width="24px" height="36px" />
      <p className="font-normal text-base text-customColor leading-[19.36px]">
        {message}
      </p>
    </div>
  );
};

VenueCreatedSuccessPopUp.propTypes = {
  message: PropTypes.string,
};
