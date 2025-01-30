import PropTypes from "prop-types";

export default function RejectionBanner({ message, title }) {
  return (
    <div className="sm:flex flex-col sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
      <div className="pointer-events-auto flex flex-col items-start justify-center gap-x-6 bg-white px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4">
        <p className="text-lg font-semibold text-red-500">{title}</p>
        <p className="text-md text-black">{message}</p>
      </div>
    </div>
  );
}

RejectionBanner.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};
