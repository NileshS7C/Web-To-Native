import { useDispatch } from "react-redux";
import { ADMIN_NAVIGATION, menus } from "../../Constant/app";
import { setNavigation } from "../../redux/NavBar/navSlice";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
export const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies("userRole");

  const naviagtionBar =
    cookies.userRole === "SUPER_ADMIN" ? ADMIN_NAVIGATION : menus;

  return (
    <div className="grid grid-rows-6 gap-2 auto-rows-[60px] justify-items-start px-[10px] text-md font-normal text-[#232323] bg-[#FFFFFF]">
      {naviagtionBar.map((menu, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 py-[15px] px-[16px] ${
            menu.dropdown ? "justify-between" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <img src={menu.icon} alt={menu.name.toLowerCase()} />
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
