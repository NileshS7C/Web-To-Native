import PropTypes from "prop-types";

export const Input = ({
  className,
  type,
  id,
  name,
  ref,
  onChange,
  value,
  disabled,
  ...props
}) => {
  console.log(" name", name)
  return (
    <input
      type={type}
      id={id}
      name={name}
      className={` ${
        type === "file"
          ? "file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          : "w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500  "
      }`}
      ref={ref}
      onChange={onChange}
      value={type === "file" ? "" : value}
      disabled={disabled}
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
