import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useFormikContextFunction } from "../Providers/formikContext";
import { handleTournamentDecision } from "../redux/tournament/tournamentActions";
import { setApprovalBody } from "../redux/tournament/addTournament";

import { FiEdit3 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { AiFillDelete } from "react-icons/ai";

import Header from "./Header/header";
import { NavBar } from "./SideNavBar/NavBar";

import { getPageTitle } from "../Constant/titles";
import {
  notHaveBackButton,
  ROLES,
  uploadedImageLimit,
  venueImageSize,
} from "../Constant/app";
import { aboutUsPageRoutes } from "../Constant/Cms/aboutUsPage";
import { backRoute } from "../utils/tournamentUtils";

import {
  showConfirmation,
  onCancel,
} from "../redux/Confirmation/confirmationSlice";
import { downloadSheetOfPlayers } from "../redux/tournament/tournamentActions";
import Button from "./Common/Button";
import { SuccessModal } from "./Common/SuccessModal";
import { ErrorModal } from "./Common/ErrorModal";
import { hideActionButtons } from "../Constant/tournament";
import { toggleOrganiserModal } from "../redux/tournament/tournamentOrganiserSlice";

import { showError } from "../redux/Error/errorSlice";
import {
  getUploadedImages,
  uploadImageForCMS,
} from "../redux/Upload/uploadActions";
import { showSuccess } from "../redux/Success/successSlice";
import { cleanUpUpload, setIsUploaded } from "../redux/Upload/uploadImage";
import { deleteVenue } from "../redux/Venue/venueActions";

import {
  resetVenueEditMode,
  setVenueEditMode,
  setWasCancelledVenue,
} from "../redux/Venue/addVenue";
import { ArchiveButtons } from "./Layout/TournamentArchiveButtons";
import {
  resetEditMode,
  setWasCancelled,
  setTournamentEditMode,
} from "../redux/tournament/getTournament";

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
  "/cms/tourism-page/top-banner",
  "/cms/tourism-page/package-section",
  "/cms/tourism-page/instagram",
  "/cms/tourism-page/media-gallery",
  ...aboutUsPageRoutes,
  "/",
  "/admin-users",
];
import { BsDownload } from "react-icons/bs";
import { useOwnerDetailsContext } from "../Providers/onwerDetailProvider";
const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [tagColor, setTagColor] = useState("");
  const { submitForm, isSubmitting } = useFormikContextFunction();
  const { tournamentId, eventId, id } = useParams();
  const navRef = useRef(null);

  const [shouldScroll, setShouldScroll] = useState({
    nav: false,
    page: false,
  });
  const [approveButtonClicked, setApproveButtonClicked] = useState(false);
  const { venue } = useSelector((state) => state.getVenues);
  const { changingDecision, verificationSuccess, approvalBody } = useSelector(
    (state) => state.Tournament
  );
  const { category } = useSelector((state) => state.event);
  const { tournament, tournamentEditMode } = useSelector(
    (state) => state.GET_TOUR
  );

  const handleMouseEnter = useCallback(() => {
    setShouldScroll((prev) => ({ ...prev, nav: true, page: false }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShouldScroll((prev) => ({ ...prev, nav: false, page: true }));
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    navRef.current.addEventListener("mouseenter", handleMouseEnter);
    navRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      navRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      navRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [navRef]);

  const isTournament = window.location.pathname.includes("/tournaments");
  const isVenue = window.location.pathname.includes("/venues");
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
    if (tournament) {
      if (tournament?.status === "PUBLISHED") {
        setTagColor("bg-green-50 text-[#41C588] ring-green-600/20");
      } else if (tournament?.status === "DRAFT") {
        setTagColor("bg-orange-100 text-[#FF791A] ring-orange-600/20");
      } else {
        setTagColor("bg-gray-300 text-[#5D5D5D] ring-gray-600/20");
      }
    }
  }, [tournament]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const shouldHideTitleBar =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.match(/^\/cms\/blogs\/blog-posts\/[\w-]+$/);
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 bg-[#F5F7FA] overflow-hidden">
        <div
          className={`w-[250px] hidden lg:block h-full bg-[#FFFFFF] ${
            shouldScroll.nav ? "overflow-auto" : "overflow-auto"
          }  scrollbar-hide`}
          ref={navRef}
        >
          <NavBar />
        </div>
        <div
          className={`flex-1 ${
            currentTitle !== "DASHBOARD" && "p-4 md:p-[50px]"
          } h-full ${
            shouldScroll.page ? "overflow-auto" : "overflow-auto"
          } scrollbar-hide ${
            currentTitle === "DASHBOARD" && "overflow-hidden"
          }`}
          currentTitle={currentTitle}
        >
          <div className="flex sm:gap-2.5  mb-4 w-[100%] ">
            {!notHaveBackButton.includes(currentTitle) &&
              !location.pathname.includes("/coupons/") && (
                <button
                  onClick={() => {
                    if (window.location.href.includes("edit-court?")) {
                      window.history.back();
                    } else {
                      navigate(
                        backRoute(location, {
                          tournamentId,
                          id,
                          status: tournament?.status,
                        })
                      );
                    }
                  }}
                >
                  <ArrowLeftIcon width="24px" height="24px" color="#343C6A" />
                </button>
              )}

            <ErrorModal />

            <SuccessModal />

            {!shouldHideTitleBar && (
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                {/* Title + Status Tag */}
                <div className="flex items-center gap-3 text-[#343C6A] font-semibold text-base md:text-[22px] flex-grow min-w-0">
                  <span className="text-left text-base sm:text-base md:text-lg text-ellipsis">
                    {currentTitle}
                  </span>

                  {tournamentId && (
                    <span
                      className={`inline-flex items-center rounded-xl sm:rounded-2xl px-1 sm:px-2 py-1 text-xs sm:text-base md:text-md lg:text-lg font-medium ring-1 ring-inset ${tagColor}`}
                    >
                      {tournament?.status}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 justify-end ml-auto">
                  {currentTitle === "Tournaments" && (
                    <Button
                      onClick={() => navigate("/tournaments/add")}
                      disable={false}
                      className="px-4 py-2 rounded-lg text-white text-sm md:text-base"
                    >
                      Add New Tournament
                    </Button>
                  )}

                  {currentTitle === "Venues" && (
                    <Button
                      type="button"
                      className="rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm"
                      onClick={() => navigate("/venues/new")}
                    >
                      Add New Venue
                    </Button>
                  )}

                  {currentTitle === "Coupons" &&
                    location.pathname === "/coupons" && (
                      <Button
                        type="button"
                        className="rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm"
                        onClick={() => navigate("/coupons/new")}
                      >
                        Add New Coupon
                      </Button>
                    )}

                  {currentTitle === "Tournament Organisers" && (
                    <TournamentOrganiserButtons dispatch={dispatch} />
                  )}
                  {currentTitle === "Uploaded Images" && (
                    <UploadImageButton dispatch={dispatch} />
                  )}

                  {(currentTitle.startsWith("Venue Details") ||
                    currentTitle.startsWith("Edit Venue")) &&
                    isVenue && (
                      <VenueActionButtonWrapper
                        dispatch={dispatch}
                        navigate={navigate}
                        venueId={id}
                        submitForm={submitForm}
                        isSubmitting={isSubmitting}
                      />
                    )}

                  {isTournament &&
                    tournament?.status !== "DRAFT" &&
                    !hideActionButtons.includes(currentTitle) && (
                      <TournamentActionButton
                        dispatch={dispatch}
                        ROLES={ROLES}
                        approvalBody={approvalBody}
                        tournament={tournament}
                        changingDecision={changingDecision}
                        setApproveButtonClicked={setApproveButtonClicked}
                        tournamentEditMode={tournamentEditMode}
                        eventId={eventId}
                        submitForm={submitForm}
                        isSubmitting={isSubmitting}
                      />
                    )}
                </div>
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
  approvalBody,
  tournament,
  changingDecision,
  setApproveButtonClicked,
  tournamentEditMode,
  eventId,
  submitForm,
  isSubmitting,
}) => {
  const {rolesAccess}=useOwnerDetailsContext()
  return (
    <div className="flex gap-2.5 items-center">
      <div className="flex items-center gap-1 sm:gap-2 justify-end ml-auto">
        {!eventId &&
          (!tournamentEditMode ? (
            <button
              className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
              type="button"
              onClick={() => dispatch(setTournamentEditMode())}
              disabled={
                // Disable if the user is NOT ADMIN, SUPER_ADMIN, or TOURNAMENT_OWNER
                (!["ADMIN", "SUPER_ADMIN", "TOURNAMENT_OWNER"].includes(
                  rolesAccess?.tournament
                ) &&
                  // AND the tournament status is not REJECTED
                  tournament?.status !== "REJECTED") ||
                // OR if the user is a TOURNAMENT_OWNER
                (rolesAccess?.tournament === "TOURNAMENT_OWNER" &&
                  // AND the tournament status is PENDING_VERIFICATION or PUBLISHED
                  ["PENDING_VERIFICATION", "PUBLISHED"].includes(
                    tournament?.status
                  )) ||
                tournament?.status === "COMPLETED"
              }
            >
              <span className="hidden lg:block text-xs sm:text-base md:text-md lg:text-lg">
                Edit Tournament
              </span>
              <FiEdit3 />
            </button>
          ) : (
            <SaveAndCancelButton
              dispatch={dispatch}
              setEditMode={() => {
                dispatch(setTournamentEditMode());
                dispatch(setWasCancelled());
              }}
              submitForm={async () => {
                await submitForm();
                dispatch(resetEditMode());
              }}
              isSubmitting={isSubmitting}
            />
          ))}
        {ROLES.slice(0, 2).includes(rolesAccess?.tournament) &&
          tournament?.status &&
          !["ARCHIVED","REJECTED","COMPLETED"].includes(tournament?.status) && (
            <div className="flex items-center gap-2">
              <Button
                className={`${
                  tournament?.status === "PUBLISHED" ? "hidden" : "flex"
                } items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-2 sm:py-2 bg-white text-black shadow-lg ml-auto rounded-[8px] hover:bg-gray-100 disabled:bg-gray-400 text-xs sm:text-base md:text-md lg:text-lg`}
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
                } items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-2 sm:py-2 bg-red-700 text-white shadow-lg ml-auto rounded-[8px] hover:bg-red-600 disabled:bg-red-400 text-xs sm:text-base md:text-md lg:text-lg`}
                type="button"
                onClick={() => {
                  dispatch(
                    showConfirmation({
                      message:
                        "Are you sure you want to reject this tournament? This action cannot be undone.",
                      type: "Tour",
                      withComments: true,
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

      <div>
        <ArchiveButtons tournament={tournament} dispatch={dispatch} />
      </div>
      {/* Roles are Archived and publised then only sheet will be downloaded */}
      {ROLES.slice(0, 3).includes(rolesAccess?.tournament) &&
        tournament?.status &&
        ["ARCHIVED", "PUBLISHED"].includes(tournament?.status) && (
          <Button
            className="bg-blue-400 flex h-[24px] sm:h-auto sm:w-46 items-center justify-center gap-2 px-4 py-2  text-customColor ml-auto rounded-[8px] hover:bg-[#1570EF] shadow-lg transition-transform duration-200 ease-in-out  active:translate-y-1 active:scale-95 text-xs sm:text-base md:text-md lg:text-lg"
            type="button"
            onClick={() => {
              dispatch(
                downloadSheetOfPlayers({
                  tournamentId: tournament._id.toString(),
                  ownerId: tournament?.ownerUserId?.toString(),
                  type: rolesAccess?.tournament,
                  tournamentName:
                    tournament?.tournamentName || "Tournament-Bookings",
                })
              );
            }}
          >
            <BsDownload />
            <span className="text-white   hidden lg:block">Download Sheet</span>
          </Button>
        )}
    </div>
  );
};

const VenueActionButtonWrapper = ({
  dispatch,
  navigate,
  venueId,
  submitForm,
  isSubmitting,
}) => {
  const [isDeleteButtonClicked, setIsDeleteButtonClicked] = useState(false);
  const [isEditInThePath, setIsEditInThePath] = useState(false);

  const location = useLocation();

  const [isDeleting, setIsDeleting] = useState(false);
  const { venue, isPublishing } = useSelector((state) => state.getVenues);
  const { venueEditMode } = useSelector((state) => state.Venue);

  useEffect(() => {
    if (location?.pathname) {
      setIsEditInThePath(() => {
        return location.pathname.includes("/edit");
      });
    }

    dispatch(resetVenueEditMode());
  }, [location.pathname]);

  useEffect(() => {
    if (isDeleteButtonClicked) {
      dispatch(
        showConfirmation({
          message:
            "Deleting this venue will remove it from your records and any associated data. Are you sure you want to proceed?",
          type: "Venue",
          id: venueId,
        })
      );
    }
  }, [isDeleteButtonClicked]);

  const { isConfirmed, type, confirmationId } = useSelector(
    (state) => state.confirm
  );

  useEffect(() => {
    const deleteTheVenue = async () => {
      try {
        setIsDeleting(true);
        const result = await dispatch(deleteVenue(confirmationId)).unwrap();

        if (result.status === "success") {
          dispatch(
            showSuccess({
              message: "Venue Deleted Successfully.",
              onClose: "hideSuccess",
            })
          );

          navigate("/venues");
        }
      } catch (err) {
        console.log(" Error in deleting the venue", err);
        dispatch(
          showError({
            message:
              err?.data?.message ||
              "Oops!, something went wrong while deleting the venue. Please try again later.",
            onClose: "hideError",
          })
        );
      } finally {
        setIsDeleting(false);
        setIsDeleteButtonClicked(false);
      }
    };
    if (isConfirmed && type === "Venue" && confirmationId) {
      dispatch(onCancel());
      deleteTheVenue();
    }
  }, [isConfirmed]);

  return (
    <VenueActionButtons
      dispatch={dispatch}
      navigate={navigate}
      venueId={venueId}
      setIsDeleteButtonClicked={setIsDeleteButtonClicked}
      venue={venue}
      isPublishing={isPublishing}
      isDeleting={isDeleting}
      isEditInThePath={isEditInThePath}
      venueEditMode={venueEditMode}
      submitForm={submitForm}
      isSubmitting={isSubmitting}
    />
  );
};
const VenueActionButtons = ({
  dispatch,
  navigate,
  venueId,
  setIsDeleteButtonClicked,
  venue,
  isPublishing,
  isDeleting,
  isEditInThePath,
  venueEditMode,
  submitForm,
  isSubmitting,
}) => {
  return (
    <div className="flex items-center gap-2 justify-end ml-auto">
      {venueEditMode ? (
        <SaveAndCancelButton
          dispatch={dispatch}
          setEditMode={() => {
            dispatch(setVenueEditMode());
            dispatch(setWasCancelledVenue());
          }}
          submitForm={submitForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <button
          className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[5px] sm:rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400 text-xs sm:text-base md:text-md lg:text-lg"
          type="button"
          onClick={() => {
            if (!isEditInThePath) {
              navigate(`/venues/${venueId}/edit`);
            } else {
              dispatch(setVenueEditMode());
            }
          }}
        >
          <span>Edit Venue</span>
          <FiEdit3 />
        </button>
      )}

      {!isEditInThePath && (
        <>
          <Button
            className="flex items-center justify-center gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-red-700 shadow-lg text-white ml-auto rounded-[5px] sm:rounded-[8px] hover:bg-red-500 disabled:bg-red-500 text-xs sm:text-base md:text-md lg:text-lg"
            type="button"
            onClick={() => {
              setIsDeleteButtonClicked(true);
            }}
            loading={isDeleting}
          >
            <span>Delete Venue</span>
            <AiFillDelete />
          </Button>
          <Button
            className="flex items-center justify-center  gap-[2px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-white shadow-lg text-customTextColor ml-auto rounded-[5px] sm:rounded-[8px] hover:bg-gray-200 disabled:bg-gray-200 text-xs sm:text-base md:text-md lg:text-lg"
            onClick={() =>
              dispatch(
                showConfirmation({
                  message:
                    "Publishing this venue will make it visible to players. Are you sure you want to proceed?",
                  type: "Venue",
                })
              )
            }
            loading={isPublishing}
            disabled={
              venue?.status === "PUBLISHED" || venue?.courts?.length === 0
            }
          >
            <span className="text-xs sm:text-base md:text-md lg:text-lg font-medium">
              {venue?.status !== "PUBLISHED"
                ? "Publish Venue"
                : "Venue Published"}
            </span>
          </Button>
        </>
      )}
    </div>
  );
};

const SaveAndCancelButton = ({
  dispatch,
  setEditMode,
  submitForm,
  isSubmitting,
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        className="flex items-center justify-center gap-[5px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-white shadow-lg text-black ml-auto rounded-[5px] sm:rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        type="button"
        onClick={() => setEditMode()}
      >
        <span className="text-xs sm:text-base md:text-md lg:text-lg font-medium">
          Cancel
        </span>
      </button>

      <Button
        className="flex items-center justify-center gap-[5px] sm:gap-3 px-1 sm:px-4 py-1 sm:py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[5px] sm:rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        type="button"
        onClick={() => submitForm && submitForm()}
        loading={isSubmitting}
      >
        <span className="text-xs sm:text-base md:text-md lg:text-lg font-medium">
          Save
        </span>
      </Button>
    </div>
  );
};

const UploadImageButton = ({ dispatch }) => {
  const [isUploading, setIsUploading] = useState(false);
  const uploadImageRef = useRef(null);
  const handleButtonClicked = () => {
    uploadImageRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    try {
      setIsUploading(true);

      if (!uploadedFile.type.startsWith("image/")) {
        dispatch(
          showError({
            message: "Invalid Image Provided.",
            onClose: "hideError",
          })
        );

        return;
      }

      const maxSize = venueImageSize;

      if (uploadedFile.size > maxSize) {
        dispatch(
          showError({
            message: `Uploaded File size is greater than ${maxSize} kB.`,
            onClose: "hideError",
          })
        );

        return;
      }

      const result = await dispatch(uploadImageForCMS(uploadedFile)).unwrap();

      if (result?.status === "success") {
        dispatch(
          getUploadedImages({ lastFileKey: "", limit: uploadedImageLimit })
        );
        dispatch(setIsUploaded());
        dispatch(
          showSuccess({
            message: "File uploaded SuccessFully.",
            onClose: "hideSuccess",
          })
        );
      }
    } catch (err) {
      console.log(" Error in uploading the file", err);
      dispatch(
        showError({
          message:
            err?.data?.message ||
            "Oops!, something went wrong while uploading the file. Please try again later.",
          onClose: "hideError",
        })
      );
    } finally {
      setIsUploading(false);
      dispatch(cleanUpUpload());
    }
  };
  return (
    <div>
      <Button
        className="flex w-[200px] items-center justify-center gap-3 px-4 py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        onClick={handleButtonClicked}
        loading={isUploading}
      >
        Upload Image
      </Button>

      <input
        ref={uploadImageRef}
        id="uploadImage"
        name="uploadImage"
        onChange={handleFileUpload}
        value=""
        type="file"
        className="hidden"
      />
    </div>
  );
};

SaveAndCancelButton.propTypes = {
  dispatch: PropTypes.func,
  setEditMode: PropTypes.func,
  submitForm: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

VenueActionButtonWrapper.propTypes = {
  dispatch: PropTypes.func,
  navigate: PropTypes.func,
  venueId: PropTypes.string,
  submitForm: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

TournamentActionButton.propTypes = {
  dispatch: PropTypes.func,
  ROLES: PropTypes.array,
  approvalBody: PropTypes.object,
  tournament: PropTypes.object,
  changingDecision: PropTypes.bool,
  setApproveButtonClicked: PropTypes.func,
  tournamentEditMode: PropTypes.bool,
  eventId: PropTypes.string,
  submitForm: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

VenueActionButtons.propTypes = {
  dispatch: PropTypes.func,
  navigate: PropTypes.func,
  venueId: PropTypes.string,
  setIsDeleteButtonClicked: PropTypes.func,
  venue: PropTypes.object,
  isPublishing: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isEditInThePath: PropTypes.bool,
  submitForm: PropTypes.func,
  isSubmitting: PropTypes.bool,
  venueEditMode: PropTypes.bool,
};

export default Layout;
