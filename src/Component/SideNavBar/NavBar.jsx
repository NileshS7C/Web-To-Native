import { useDispatch, useSelector } from "react-redux";
import { ADMIN_NAVIGATION, TOURNAMENT_OWNER_NAVIGATION, VENUE_OWNER_NAVIGATION } from "../../Constant/app";
import { setNavigation } from "../../redux/NavBar/navSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";

export const NavBar = ({ handleOverlayClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookiesRoles=cookies?.get("userRoles");
  const location = useLocation();
  const { userRoles: roles } = useSelector((state) => state.auth);
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
    if (cookiesRoles?.length > 0  || roles?.length > 0) {
      const userRoles = cookiesRoles || roles;
      if (userRoles?.includes("SUPER_ADMIN") || userRoles?.includes("ADMIN")) {
        setNavigationBar(ADMIN_NAVIGATION);
      } else if (
        userRoles?.includes("TOURNAMENT_OWNER") ||
        userRoles?.includes("TOURNAMENT_BOOKING_OWNER")
      ) {
        setNavigationBar(TOURNAMENT_OWNER_NAVIGATION);
      } else if (userRoles?.includes("VENUE_OWNER")) {
        setNavigationBar(VENUE_OWNER_NAVIGATION);
      }

    }
  }, [roles]);

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
          (child) => child.name.toLowerCase() === currentMenu.toLowerCase()
        );
        return isActive || activeChild;
      };

      const shouldBeActive = !menu.children
        ? currentMenu.toLowerCase() === menu.name.toLowerCase()
        : checkIsChildrenActive();

      return (
        <div key={`${menu.name}`} className="w-full">
          <div
            className={`cursor-pointer flex items-center gap-2 py-[15px] px-[10px] w-full ${
              menu.children ? "justify-between" : ""
            } ${
              shouldBeActive ? "bg-[#5B8DFF1A] rounded-md text-blue-500" : ""
            }`}
            onClick={() => {
              setCurrentMenu(menu.name);
              if (menu.children) {
                // Toggle the menu if it has children
                toggleMenu(menu.name);

                if (menu.name === "CMS" && expandedMenus.CMS) {
                  navigate("/");
                }
              } else {
                // Navigate if it doesn't have children
                dispatch(setNavigation(menu.name));
                navigate(currentPath);
                if(typeof(handleOverlayClick) === 'function') {
                  handleOverlayClick();
                }
              }
            }}
          >
            <div className="flex items-center gap-2">
              {menu.icon && (
                <img
                  src={menu.icon}
                  alt={menu.name.toLowerCase()}
                  className="w-[20px] h-[20px]"
                />
              )}
                <span>{menu.name}</span>
            </div>
            {menu.children && (
              <ChevronRightIcon
                className={`w-5 h-5 text-gray-500 transform ${
                  expandedMenus[menu.name] ? "rotate-90" : ""
                }`}
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
    <div className="grid grid-rows-auto gap-2 auto-rows-[60px] justify-items-start px-[10px] text-md font-normal text-[#232323] bg-[#FFFFFF] ">
      {navigationBar && renderMenuItems(navigationBar)}
    </div>
  );
};
