import PropTypes from "prop-types";

export const Input = ({ className, type, id, name, ref, ...props }) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      ref={ref}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.name,
  type: PropTypes.string,
  ref: PropTypes.any,
};
