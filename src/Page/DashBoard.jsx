import { dashboardIcon } from "../Assests";
import { dashboardBg } from "../Assests";
import { useNavigate } from "react-router-dom";
const  Dashboard=()=>{
    const navigate = useNavigate();
    return (
      <div className="w-[100%] h-[100%] relative">
        <div className="flex flex-col items-center justify-center gap-y-2 lg:gap-y-3 xl:gap-y-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 -mt-6">
          <img
            src={dashboardIcon}
            alt="Dashboard"
            className="w-[200px] h-[200px] z-10 md:w-[230px] md:h-[230px] 2xl:w-[300px] 2xl:h-[300px] "
          />
          <h2 className="text-md md:text-lg xl:text-xl xl:text-2xl text-richBlue-600 font-semibold font-sans-serif w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] 2xl:w-[30%] z-10 text-center -mt-2">
            Game on! Manage your tournament like a pro right from here.
          </h2>
          <button
            className="text-white bg-richBlue-5 text-sm md:text-md 2xl:text-xl font-medium px-6 py-2 2xl:px-8 2xl:py-3 rounded-md z-10"
            onClick={() => {
              navigate("/tournaments");
            }}
          >
            Manage Tournaments
          </button>
        </div>
        {/* Added image at the bottom of outer div */}
        <img
          src={dashboardBg}
          alt="bottom-image"
          className="absolute bottom-16 left-0 w-full object-cover z-5 scale-125 rotate-[4deg]  md:scale-100 md:rotate-[-5deg] md:bottom-6"
        />
      </div>
    );

}
export default Dashboard;
