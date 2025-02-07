import { useDispatch } from "react-redux";
import {
  ADMIN_NAVIGATION,
  TOURNAMENT_OWNER_NAVIGATION,
  VENUE_OWNER_NAVIGATION,
} from "../../Constant/app";
import { setNavigation } from "../../redux/NavBar/navSlice";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { ChevronRightIcon } from "@heroicons/react/20/solid";


import { useEffect, useState } from "react";


export const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["userRole"]);

  const [expandedMenus, setExpandedMenus] = useState({});

 
  
   const [navigationBar, setNavigationBar] = useState(null);

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
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const renderMenuItems = (menuItems, parentPath = "") =>
    menuItems.map((menu, index) => {
      const currentPath = `${parentPath}/${menu.name.toLowerCase().replace(/\s+/g, "-")}`; // Create a hierarchical path
      return (
        <div key={index} className="w-full">
          <div
            className={`flex items-center gap-2 py-[15px] px-[16px] w-full ${
              menu.children ? "justify-between" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {menu.icon && <img src={menu.icon} alt={menu.name.toLowerCase()} />}
              <button
                onClick={() => {
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
              {renderMenuItems(menu.children, currentPath)} {/* Pass the current path to children */}
            </div>
          )}
        </div>
      );
    });
  

  return (
    <div className="grid grid-rows-6 gap-2 auto-rows-[60px] justify-items-start px-[10px] text-md font-normal text-[#232323] bg-[#FFFFFF]">
      {renderMenuItems(navigationBar)}
    </div>
  );
};
