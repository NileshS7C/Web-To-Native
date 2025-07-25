import { ChevronDownIcon } from "@heroicons/react/16/solid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function Tabs({ options, onChange, hasLink = false }) {
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(options[0]?.name || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentTab) {
      setSelectedTab(currentTab);
    } else {
      setSelectedTab(options[0]?.name.toLowerCase() || "Overview");
    }
  }, [selectedTab, currentTab]);

  const handleChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", value);
    navigate(`${currentPath}?${searchParams?.toString()}`, { replace: true });
  };

  return (
    <div>
      <div className="grid grid-cols-1 items-center justify-start max-w-full w-full md:max-w-fit sm:hidden">
        <select
          value={currentTab?.toLowerCase()}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#1570EF]"
          onChange={(e) => {
            handleChange(e.target.value);
            onChange(e.target.value);
          }}
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
      <div className="hidden sm:block">
        <nav
          aria-label="Tabs"
          className="flex flex-1 flex-wrap max-w-fit justify-between xl:flex-nowrap "
        >
          {options.map((tab) =>
            !hasLink ? (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "bg-[#1570EF] text-[#FFFFFF]"
                    : "text-gray-500 hover:text-gray-700",
                  "rounded-[4px] px-3 py-2 text-sm font-medium w-[250px] h-[40px]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(tab.name);
                }}
              >
                {tab.name}
              </a>
            ) : (
              <Link
                key={tab.name}
                to={{ pathname: tab.path, search: tab.search }}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.name.toLowerCase() === selectedTab
                    ? "bg-[#1570EF] text-[#FFFFFF]"
                    : "text-gray-500 hover:text-gray-700",
                  "rounded-[4px] px-3 py-2 text-sm font-medium w-[100px] lg:w-[250px] h-[40px]"
                )}
                onClick={(e) => {
                  onChange?.(tab.name);
                }}
              >
                {tab.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </div>
  );
}

Tabs.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  hasLink: PropTypes.bool,
};
export default Tabs;
