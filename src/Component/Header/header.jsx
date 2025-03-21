import { useDispatch } from "react-redux";
import { userProfileIcon, pickleBayLogo } from "../../Assests";
import { userLogout } from "../../redux/Authentication/authActions";
import { useCookies } from "react-cookie";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [cookies] = useCookies();
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
    <div className="flex items-center justify-between bg-[#FFFFFF]  pt-[20px] pb-[31px] px-[32px] sticky top-0">
      <div className="">
        <img src={pickleBayLogo} alt="pickle bay" />
      </div>
      <div className="flex items-center gap-5">
        <p>{cookies.name || ""}</p>
        <div className="relative" ref={detailRef}>
          <button className="list-none" onClick={toggleDropDown}>
            <img src={userProfileIcon} alt="profile" />
          </button>
          {isOpen && (
            <nav>
              <ul className="absolute right-[100%] bg-[#FFFFFF] shadow-lg max-w-fit rounded-lg">
                {/* <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">
                Profile
              </li>
              <li className="px-4 py-2 cursor-pointer hover:bg-slate-400">
                Settings
              </li> */}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
