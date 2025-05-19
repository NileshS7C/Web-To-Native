import { ChevronDownIcon } from "@heroicons/react/16/solid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function RoundTabs({ options, selected, onChange }) {
  const classNames = (...classes) => classes.filter(Boolean).join(" ");
  const [selectedTab, setSelectedTab] = useState(
    selected?.toLowerCase() || options[0]?.name.toLowerCase()
  );

  useEffect(() => {
    setSelectedTab(selected?.toLowerCase() || options[0]?.name.toLowerCase());
  }, [selected, options]);

  const handleTabChange = (name) => {
    setSelectedTab(name.toLowerCase());
    onChange(name);
  };

  return (
    <div>
      {/* Mobile Select */}
      <div className="grid grid-cols-1 items-center justify-start max-w-full w-full md:max-w-fit sm:hidden">
        <select
          value={selectedTab}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#1570EF]"
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {options.map((tab) => (
            <option key={tab.name} value={tab.name.toLowerCase()}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <nav
          aria-label="Tabs"
          className="flex flex-1 flex-wrap max-w-fit justify-between xl:flex-nowrap"
        >
          {options.map((tab) => (
            <button
              type="button"
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={classNames(
                "relative px-3 py-2 text-sm font-medium w-[100px] lg:w-[250px] h-[40px]",
                tab.name.toLowerCase() === selectedTab
                  ? "text-[#1570EF] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:border-b-2 after:border-[#1570EF]"
                  : "text-gray-500 hover:text-gray-700 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:border-b-2 after:border-transparent hover:after:border-gray-300"
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

RoundTabs.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func, 
};

export default RoundTabs;
