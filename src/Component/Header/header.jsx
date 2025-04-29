import { useDispatch, useSelector } from "react-redux";
import { userProfileIcon, pickleBayLogo } from "../../Assests";
import { userLogout } from "../../redux/Authentication/authActions";
import { useCookies } from "react-cookie";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hamburger from "../Hamburg/Hamburger";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cookies] = useCookies();
  const userEmail = useSelector((state) => state.user.email);

  const handleUserLogout = async () => {
    const result = await dispatch(userLogout()).unwrap();
    if (result) {
      navigate("/login", {
        replace: true,
      });
    }
  };

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-[#FFFFFF]  py-[20px] px-[15px] md:px-[32px] sticky top-0 z-30">
      <div>
        <img src={pickleBayLogo} alt="pickle bay" />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative" ref={detailRef}>
          <button className="list-none" onClick={toggleDropDown}>
            <img src={userProfileIcon} alt="profile" />
          </button>
          {isOpen && (
            <nav>
              <ul className="absolute right-[-45px] md:right-[100%] bg-[#FFFFFF] shadow-lg rounded-lg py-[10px] top-[55px] z-100">
                {/* <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">Profile</li>
                <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">Settings</li> */}
                {userEmail && <li className="flex items-center gap-2 bg-[#F5F7FA] py-2 px-2">
                  <span>Email: </span>
                  {userEmail}</li>
                }

                <li className="px-1 py-1 cursor-pointer bg-[#3b82f6] w-[80px] m-auto mt-[10px] rounded-[10px] text-white" onClick={handleUserLogout} onKeyDown={(e) => e.key === "Enter" && handleUserLogout} role="button" tabIndex="0">Logout</li>
              </ul>
            </nav>
          )}
        </div>
        <div className="lg:hidden">
          <Hamburger />
        </div>
      </div>
    </div>
  );
};

export default Header;
