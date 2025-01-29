import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header/header";
import { NavBar } from "./SideNavBar/NavBar";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { getPageTitle } from "../Constant/titles";
import { notHaveBackButton, ROLES } from "../Constant/app";
import { useCookies } from "react-cookie";
import { FiEdit3 } from "react-icons/fi";
import { setTournamentEditMode } from "../redux/tournament/getTournament";
import { handleTournamentDecision } from "../redux/tournament/tournamentActions";
import { approvalBody } from "../Constant/tournament";
import { showConfirmation } from "../redux/Confirmation/confirmationSlice";
import Button from "./Common/Button";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { venue } = useSelector((state) => state.getVenues);
  const { tournament } = useSelector((state) => state.GET_TOUR);
  const { changingDecision } = useSelector((state) => state.Tournament);

  const [cookies, setCookies] = useCookies();
  const userRole = cookies["userRole"];

  const currentTitle = getPageTitle(
    location.pathname,
    { id },
    { venue, tournament }
  );

  return (
    <div className="flex flex-col max-h-screen">
      <Header />
      <div className="flex flex-1 bg-[#F5F7FA]">
        <div className="w-[250px] h-auto bg-[#FFFFFF]">
          <NavBar />
        </div>
        <div className="flex-1 p-[50px] overflow-auto">
          <div className="flex gap-2.5 items-center mb-4 ">
            {!notHaveBackButton.includes(currentTitle) && (
              <button onClick={() => navigate(-1)}>
                <ArrowLeftIcon width="24px" height="24px" color="#343C6A" />
              </button>
            )}

            <div className="flex items-center justify-between w-full">
              <p className="text-[#343C6A] font-semibold text-[22px]">
                {currentTitle}
              </p>

              {currentTitle === "Tournaments" && (
                <Button
                  onClick={() => {
                    navigate("/tournaments/add");
                  }}
                  disable={false}
                  className=" flex px-4 py-2 rounded-lg text-[#FFFFFF] "
                >
                  Add New Tournament
                </Button>
              )}

              {currentTitle?.startsWith("Edit Tournament") && (
                <div className="flex items-center gap-2 justify-end ml-auto">
                  <button
                    className="flex items-center justify-center gap-3 w-[200px] h-[60px] bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700"
                    type="button"
                    onClick={() => dispatch(setTournamentEditMode())}
                  >
                    <span>Edit Tournament</span>
                    <FiEdit3 />
                  </button>

                  {ROLES.slice(0, 2).includes(userRole) && (
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center justify-center gap-3 w-[200px] h-[60px] bg-white text-black shadow-lg ml-auto rounded-[8px] hover:bg-gray-100"
                        type="button"
                        onClick={() =>
                          dispatch(
                            handleTournamentDecision({
                              actions: approvalBody,
                              id,
                            })
                          )
                        }
                        loading={changingDecision}
                      >
                        Accept Tournament
                      </button>
                      <button
                        className="flex items-center justify-center gap-3 w-[200px] h-[60px] bg-red-700 text-white shadow-lg ml-auto rounded-[8px] hover:bg-red-600"
                        type="button"
                        onClick={() => {
                          dispatch(
                            showConfirmation({
                              message:
                                "Are you sure you want to reject this tournament? This action cannot be undone.",
                              type: "Tour",
                            })
                          );
                        }}
                      >
                        Reject Tournament
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
