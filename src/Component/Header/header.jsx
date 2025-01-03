import {
  notificationIcon,
  profileIcon,
  pickleBayLogo,
  downArrow,
} from "../../Assests";

const Header = () => {
  return (
    <div className="flex items-center justify-between  pt-[20px] pb-[31px] px-[32px]">
      <div className="">
        <img src={pickleBayLogo} alt="pickle bay" />
      </div>
      <div className="flex items-center gap-5">
        <img src={notificationIcon} alt="notification icon" />
        <img src={profileIcon} alt="profile" />
        <img src={downArrow} alt="downward arrow icon" />
      </div>
    </div>
  );
};

export default Header;
