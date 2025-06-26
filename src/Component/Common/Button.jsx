import React from "react";
import PropTypes from "prop-types";
import { ImSpinner2 } from "react-icons/im";

const Button = (props) => {
  const { onClick, className, loading, children, disabled, type } = props;
  console.log("button", props);
  const buttonClasses = `
    ${className} 
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
    ${loading ? "relative" : ""} 
    bg-[#1570EF]   hover:bg-blue-700 active:bg-blue-800 transition-colors 
    focus:outline-none focus:ring-2 focus:ring-blue-300
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      type={type || "text"}
    >
      {loading ? (
        <ImSpinner2 className="animate-spin w-8 h-8 m-auto" />
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
  type: PropTypes.string,
};

export default Button;
