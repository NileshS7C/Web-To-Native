import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useFormikContextFunction } from "../Providers/formikContext";

import { setTournamentEditMode } from "../redux/tournament/getTournament";
import { handleTournamentDecision } from "../redux/tournament/tournamentActions";
import { setApprovalBody } from "../redux/tournament/addTournament";

import { FiEdit3 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import Header from "./Header/header";
import { NavBar } from "./SideNavBar/NavBar";

import { getPageTitle } from "../Constant/titles";
import { notHaveBackButton, ROLES } from "../Constant/app";
import { backRoute } from "../utils/tournamentUtils";

import { showConfirmation } from "../redux/Confirmation/confirmationSlice";
import Button from "./Common/Button";
import { SuccessModal } from "./Common/SuccessModal";
import { ErrorModal } from "./Common/ErrorModal";
import { approvalBody, hideActionButtons } from "../Constant/tournament";
import { toggleOrganiserModal } from "../redux/tournament/tournamentOrganiserSlice";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { tournamentId, eventId, id } = useParams();
  const { venue } = useSelector((state) => state.getVenues);
  const { tournament, tournamentEditMode } = useSelector(
    (state) => state.GET_TOUR
  );

  const [approveButtonClicked, setApproveButtonClicked] = useState(false);
  const { changingDecision, verificationSuccess, approvalBody } = useSelector(
    (state) => state.Tournament
  );
  const { category } = useSelector((state) => state.event);
  const isTournament = window.location.pathname.includes("/tournaments");

  const [cookies, setCookies] = useCookies();
  const userRole = cookies["userRole"];

  const currentTitle = getPageTitle(
    location.pathname,
    { tournamentId },
    { venue, tournament, category }
  );

  useEffect(() => {
    if (
      approvalBody?.action === "APPROVE" &&
      approveButtonClicked &&
      tournamentId
    ) {
      dispatch(
        handleTournamentDecision({
          actions: approvalBody,
          id: tournamentId,
        })
      );

      setApproveButtonClicked(false);
    }
  }, [approvalBody, tournamentId, approveButtonClicked]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Define the custom route where the div should be hidden
  const hiddenRoutes = [
    "/cms/homepage/featured-tournaments",
    "/cms/homepage/featured-venues",
    "/cms/homepage/explore",
    "/cms/static-pages/help-&-faqs",
    "/cms/homepage/featured-week",
    "/cms/homepage/why-choose-picklebay",
    "/cms/homepage/destination-dink",
    "/cms/homepage/build-courts",
    "/cms/homepage/journal",
    "/cms/homepage/news-&-update",
    "/cms/homepage/faqs",
    "/cms/static-pages/picklebay-guidelines",
    "/cms/static-pages/privacy-policy",
    "/cms/static-pages/refunds-&-cancellation",
    "/cms/static-pages/terms-&-condition",
    "/cms/blogs/blog-posts",
    "/cms/blogs/blog-posts/new",
  ];
  const shouldHideTitleBar =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.match(/^\/cms\/blogs\/blog-posts\/[\w-]+$/);

  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex flex-1 bg-[#F5F7FA]">
        <div className="w-[250px] hidden lg:block h-auto bg-[#FFFFFF]">
          <NavBar />
        </div>
        <div className="flex-1 p-[50px] overflow-auto">
          <div className="flex gap-2.5 items-center mb-4 ">
            {!notHaveBackButton.includes(currentTitle) && (
              <button
                onClick={() =>
                  navigate(
                    backRoute(location, {
                      tournamentId,
                      id,
                      status: tournament?.status,
                    })
                  )
                }
              >
                <ArrowLeftIcon width="24px" height="24px" color="#343C6A" />
              </button>
            )}

            <ErrorModal />

            <SuccessModal />

            {!shouldHideTitleBar && (
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

                {currentTitle === "Venues" && (
                  <Button
                    type="button"
                    className="block rounded-md  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => navigate("/venues/new")}
                  >
                    Add New Venue
                  </Button>
                )}

                {currentTitle === "Tournament Organisers" && (
                  <TournamentOrganiserButtons dispatch={dispatch} />
                )}

                {isTournament &&
                  tournament?.status !== "DRAFT" &&
                  !hideActionButtons.includes(currentTitle) && (
                    <TournamentActionButton
                      dispatch={dispatch}
                      ROLES={ROLES}
                      userRole={userRole}
                      approvalBody={approvalBody}
                      tournament={tournament}
                      changingDecision={changingDecision}
                      setApproveButtonClicked={setApproveButtonClicked}
                      tournamentEditMode={tournamentEditMode}
                      eventId={eventId}
                    />
                  )}
              </div>
            )}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

const TournamentOrganiserButtons = ({ dispatch }) => {
  const { tournamentOwners } = useSelector((state) => state.Tournament);

  return (
    <>
      {tournamentOwners?.owners?.length > 0 && (
        <Button
          className="flex items-center justify-center gap-3 px-4 py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
          onClick={() => dispatch(toggleOrganiserModal())}
        >
          Create
        </Button>
      )}
    </>
  );
};

const TournamentActionButton = ({
  dispatch,
  ROLES,
  userRole,
  approvalBody,
  tournament,
  changingDecision,
  setApproveButtonClicked,
  tournamentEditMode,
  eventId,
}) => {
  return (
    <div className="flex items-center gap-2 justify-end ml-auto">
      {!eventId &&
        (!tournamentEditMode ? (
          <button
            className="flex items-center justify-center gap-3 px-4 py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
            type="button"
            onClick={() => dispatch(setTournamentEditMode())}
            disabled={
              !["ADMIN", "SUPER_ADMIN"].includes(userRole) &&
              tournament?.status !== "REJECTED"
            }
          >
            <span>Edit Tournament</span>
            <FiEdit3 />
          </button>
        ) : (
          <SaveAndCancelButton
            dispatch={dispatch}
            setTournamentEditMode={setTournamentEditMode}
          />
        ))}

      {ROLES.slice(0, 2).includes(userRole) && tournament?.status && (
        <div className="flex items-center gap-2">
          <Button
            className={`${
              tournament?.status === "PUBLISHED" ? "hidden" : "flex"
            } items-center justify-center gap-3 px-4 py-2 bg-white text-black shadow-lg ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-400`}
            type="button"
            onClick={() => {
              setApproveButtonClicked(true);
              const updatedBody = {
                ...approvalBody,
                action: "APPROVE",
                rejectionComments: "",
              };
              dispatch(setApprovalBody(updatedBody));
            }}
            loading={changingDecision && approvalBody.action === "APPROVE"}
          >
            Accept Tournament
          </Button>
          <Button
            className={`${
              tournament?.status === "PUBLISHED" ? "hidden" : "flex"
            } items-center justify-center gap-3 px-4 py-2 bg-red-700 text-white shadow-lg ml-auto rounded-[8px] hover:bg-red-600 disabled:bg-red-400`}
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
            loading={changingDecision && approvalBody.action !== "APPROVE"}
          >
            Reject Tournament
          </Button>
        </div>
      )}
    </div>
  );
};

const SaveAndCancelButton = ({ dispatch, setTournamentEditMode }) => {
  const { submitForm, isSubmitting } = useFormikContextFunction();
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        className="flex items-center justify-center gap-3 px-4 py-2 bg-white shadow-lg text-black ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        type="button"
        onClick={() => dispatch(setTournamentEditMode())}
      >
        <span>Cancel</span>
      </button>

      <Button
        className="flex items-center justify-center gap-3 px-4 py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        type="button"
        onClick={() => submitForm && submitForm()}
        loading={isSubmitting}
      >
        <span>Save</span>
      </Button>
    </div>
  );
};

SaveAndCancelButton.propTypes = {
  dispatch: PropTypes.func,
  setTournamentEditMode: PropTypes.func,
};

TournamentActionButton.propTypes = {
  dispatch: PropTypes.func,
  ROLES: PropTypes.array,
  userRole: PropTypes.string,
  approvalBody: PropTypes.object,
  tournament: PropTypes.object,
  changingDecision: PropTypes.bool,
  setApproveButtonClicked: PropTypes.func,
  tournamentEditMode: PropTypes.bool,
  eventId: PropTypes.string,
};

export default Layout;
