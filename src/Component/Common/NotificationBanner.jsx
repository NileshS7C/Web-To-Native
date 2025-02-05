import PropTypes from "prop-types";
import { infoIcon } from "../../Assests";

export default function NotificationBanner({
  message,
  messageStyle,
  wrapperStyle,
}) {
  return (
    <div className={wrapperStyle}>
      <img src={infoIcon} alt="info icon" className="px-4" />
      <p className={messageStyle}>{message}</p>
    </div>
  );
}

NotificationBanner.propTypes = {
  message: PropTypes.string,
  messageStyle: PropTypes.messageStyle,
  wrapperStyle: PropTypes.wrapperStyle,
};
