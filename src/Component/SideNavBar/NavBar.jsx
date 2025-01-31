import { useDispatch } from "react-redux";
import {
  ADMIN_NAVIGATION,
  TOURNAMENT_OWNER_NAVIGATION,
  VENUE_OWNER_NAVIGATION,
} from "../../Constant/app";
import { setNavigation } from "../../redux/NavBar/navSlice";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { userLogout } from "../../redux/Authentication/authActions";
export const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies("userRole");
  let naviagtionBar;

  const userRole = cookies?.userRole;
  switch (userRole) {
    case "SUPER_ADMIN":
      naviagtionBar = ADMIN_NAVIGATION;
      break;
    case "ADMIN":
      naviagtionBar = ADMIN_NAVIGATION;
      break;
    case "TOURNAMENT_OWNER":
      naviagtionBar = TOURNAMENT_OWNER_NAVIGATION;
      break;
    case "VENUE_OWNER":
      naviagtionBar = VENUE_OWNER_NAVIGATION;
      break;
    default:
      dispatch(userLogout());
  }

  return (
    <div className="grid grid-rows-6 gap-2 auto-rows-[60px] justify-items-start px-[10px] text-md font-normal text-[#232323] bg-[#FFFFFF]">
      {naviagtionBar.map((menu, index) => (
        <div
          key={menu?.name}
          className={`flex items-center gap-2 py-[15px] px-[16px] ${
            menu?.dropdown ? "justify-between" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <img src={menu.icon} alt={menu.name.toLowerCase()} className="fill-black"/>
            <button
              onClick={() => {
                dispatch(setNavigation(menu.name));
                const routeEndPoint = `/${menu.name}`;
                navigate(routeEndPoint.toLowerCase());
              }}
            >
              <span>{menu.name}</span>
            </button>
          </div>
          {menu.dropdown && <img src={menu.dropdownIcon} alt="dropdown" />}
        </div>
      ))}
    </div>
  );
};
