import { useDispatch } from "react-redux";
import {
  ADMIN_NAVIGATION,
  TOURNAMENT_OWNER_NAVIGATION,
  VENUE_OWNER_NAVIGATION,
} from "../../Constant/app";
import { setNavigation } from "../../redux/NavBar/navSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";

export const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["userRole"]);
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState({});

  const [currentMenu, setCurrentMenu] = useState("Dashboard");

  const [navigationBar, setNavigationBar] = useState(null);

  useEffect(() => {
    const lastPathName = location.pathname?.substring(
      location.pathname.lastIndexOf("/") + 1
    );

    if (lastPathName) {
      const capitalizeFirstLetter = lastPathName
        .split("-")
        .map((path) => path.charAt(0).toUpperCase() + path.slice(1))
        .join(" ")
        .toString();

      setCurrentMenu(capitalizeFirstLetter);
    } else {
      setCurrentMenu("Dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (cookies?.userRole) {
      switch (cookies.userRole) {
        case "SUPER_ADMIN":
          setNavigationBar(ADMIN_NAVIGATION);
          break;
        case "ADMIN":
          setNavigationBar(ADMIN_NAVIGATION);
          break;
        case "TOURNAMENT_OWNER":
          setNavigationBar(TOURNAMENT_OWNER_NAVIGATION);
          break;
        case "VENUE_OWNER":
          setNavigationBar(VENUE_OWNER_NAVIGATION);
          break;
      }
    }
  }, [cookies?.userRole]);

  const toggleMenu = (menuName) => {
    setCurrentMenu(menuName);
    setExpandedMenus((prev) => {
      if (prev.CMS && menuName === "CMS") {
        const updateState = { ...prev };
        const keys = Object.keys(prev);
        keys.forEach((key) => {
          updateState[key] = false;
        });

        return updateState;
      }
      return {
        ...prev,
        [menuName]: !prev[menuName],
      };
    });
  };

  const renderMenuItems = (menuItems, parentPath = "") =>
    menuItems.map((menu, index) => {
      const currentPath =
        menu.name !== "Dashboard"
          ? `${parentPath}/${menu.name.toLowerCase().replace(/\s+/g, "-")}`
          : "/";

      const checkIsChildrenActive = () => {
        let isActive = currentMenu === menu.name;
        const activeChild = menu?.children?.some(
          (child) => child.name === currentMenu
        );

        return isActive || activeChild;
      };

      const shouldBeActive = !menu.children
        ? currentMenu === menu.name
        : checkIsChildrenActive();

      return (
        <div key={`${menu.name}`} className="w-full">
          <div
            className={`flex items-center gap-2 py-[15px] px-[10px] w-full ${
              menu.children ? "justify-between" : ""
            } ${
              shouldBeActive ? "bg-[#5B8DFF1A] rounded-md text-blue-500" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {menu.icon && (
                <img
                  src={menu.icon}
                  alt={menu.name.toLowerCase()}
                  className="w-[20px] h-[20px]"
                />
              )}
              <button
                onClick={() => {
                  setCurrentMenu(menu.name);
                  if (menu.children) {
                    // Toggle the menu if it has children
                    toggleMenu(menu.name);
                  } else {
                    // Navigate if it doesn't have children
                    dispatch(setNavigation(menu.name));
                    navigate(currentPath);
                  }
                }}
              >
                <span>{menu.name}</span>
              </button>
            </div>
            {menu.children && (
              <ChevronRightIcon
                className={`w-5 h-5 text-gray-500 transform ${
                  expandedMenus[menu.name] ? "rotate-90" : ""
                }`}
                onClick={() => toggleMenu(menu.name)}
              />
            )}
          </div>
          {menu.children && expandedMenus[menu.name] && (
            <div className="ml-4 border-l-2 border-gray-200">
              {renderMenuItems(menu.children, currentPath)}{" "}
              {/* Pass the current pat  h to children */}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="grid grid-rows-auto gap-2 auto-rows-[60px] justify-items-start px-[10px] text-md font-normal text-[#232323] bg-[#FFFFFF]">
      {navigationBar && renderMenuItems(navigationBar)}
    </div>
  );
};
