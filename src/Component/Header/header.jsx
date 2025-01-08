import { useDispatch, useSelector } from "react-redux";
import {
  notificationIcon,
  userProfileIcon,
  pickleBayLogo,
  downArrow,
} from "../../Assests";
import { userLogout } from "../../redux/Authentication/authActions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedOut, isLoading } = useSelector((state) => state.auth);
  const handleUserLogout = () => {
    dispatch(userLogout());
    if (isLoggedOut) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-between  pt-[20px] pb-[31px] px-[32px]">
      <div className="">
        <img src={pickleBayLogo} alt="pickle bay" />
      </div>
      <div className="flex items-center gap-5">
        {/* <img src={notificationIcon} alt="notification icon" /> */}

        {/* <img src={downArrow} alt="downward arrow icon" /> */}
        <details className="relative">
          <summary className="list-none">
            <img src={userProfileIcon} alt="profile" />
          </summary>
          <nav>
            <ul className="absolute right-[100%] bg-[#FFFFFF] shadow-lg max-w-fit rounded-lg">
              <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">
                Profile
              </li>
              <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">
                Settings
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-slate-400"
                onClick={handleUserLogout}
                onKeyDown={(e) => e.key === "Enter" && handleUserLogout}
                role="button"
                tabIndex="0"
              >
                Logout
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </div>
  );
};

export default Header;
