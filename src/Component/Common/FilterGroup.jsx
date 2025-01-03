import PropTypes from "prop-types";

function FilterGroup({
  title,
  options,
  selectedValue,
  onChange,
  defaultValue,
  name = "filter-options",
  className = "",
}) {
  return (
    <fieldset className={`flex items-center gap-10 ${className}`}>
      <p className="text-sm text-[#667085]">{title}</p>
      <div className=" space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
        {options.map((options) => (
          <div key={options.id} className="flex items-center">
            <input
              defaultChecked={options.id === defaultValue}
              id={options.id}
              name={name}
              type="radio"
              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
              checked={selectedValue === options.id}
              onChange={onChange}
            />
            <label
              htmlFor={options.id}
              className="ml-3 block text-sm/6 font-medium text-[#718EBF]"
            >
              {options.title}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
FilterGroup.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.array,
  selectedValue: PropTypes.string,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
};

export default FilterGroup;
