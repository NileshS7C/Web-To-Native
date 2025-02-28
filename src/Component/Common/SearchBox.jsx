import PropTypes from "prop-types";
import { searchIcon } from "../../Assests";

export const SearchBox = ({ placeholder, onInputChange, value, onFocus }) => {
  return (
    <div className="relative">
      <img
        src={searchIcon}
        alt={placeholder}
        className="absolute left-[25px] top-1/2 transform -translate-y-1/2"
      />
      <input
        placeholder={placeholder}
        className="w-full px-[60px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={onInputChange}
        value={value}
        onFocus={onFocus}
      />
    </div>
  );
};

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  value: PropTypes.string,
  onFocus: PropTypes.func,
};
