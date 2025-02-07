import PropTypes from "prop-types";
import { FaCircleInfo } from "react-icons/fa6";

export default function EmptyBanner({ message }) {
  return (
    <div className="sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
      <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-white px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4">
        <FaCircleInfo />
        <p className="text-sm/6 text-black">{message}</p>
      </div>
    </div>
  );
}

EmptyBanner.propTypes = {
  message: PropTypes.string,
};
