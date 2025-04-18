import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useFormikContextFunction } from "../Providers/formikContext";
import { setTournamentEditMode } from "../redux/tournament/getTournament";
import { handleTournamentDecision } from "../redux/tournament/tournamentActions";
import { setApprovalBody } from "../redux/tournament/addTournament";
import { FiEdit3 } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { AiFillDelete } from "react-icons/ai";
import Header from "./Header/header";
import { NavBar } from "./SideNavBar/NavBar";
import { getPageTitle } from "../Constant/titles";
import { notHaveBackButton, ROLES, uploadedImageLimit, venueImageSize} from "../Constant/app";
import { aboutUsPageRoutes } from "../Constant/Cms/aboutUsPage";
import { backRoute } from "../utils/tournamentUtils";
import { showConfirmation, onCancel} from "../redux/Confirmation/confirmationSlice";
import Button from "./Common/Button";
import { SuccessModal } from "./Common/SuccessModal";
import { ErrorModal } from "./Common/ErrorModal";
import { hideActionButtons } from "../Constant/tournament";
import { toggleOrganiserModal } from "../redux/tournament/tournamentOrganiserSlice";
import { showError } from "../redux/Error/errorSlice";
import { getUploadedImages, uploadImageForCMS} from "../redux/Upload/uploadActions";
import { showSuccess } from "../redux/Success/successSlice";
import { cleanUpUpload, setIsUploaded } from "../redux/Upload/uploadImage";
import { deleteVenue } from "../redux/Venue/venueActions";
import { resetVenueEditMode, setVenueEditMode } from "../redux/Venue/addVenue";
import { ArchiveButtons } from "./Layout/TournamentArchiveButtons";
import { resetEditMode } from "../redux/tournament/getTournament";

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
  "/cms/tourism",
  "/cms/tourism-page/top-banner",
  "/cms/tourism-page/package-section",
  "/cms/tourism-page/instagram",
  "/cms/tourism-page/media-gallery",
  ...aboutUsPageRoutes,
  "/"
];

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [tagColor, setTagColor] = useState("");
  const { submitForm, isSubmitting } = useFormikContextFunction();
  const { tournamentId, eventId, id } = useParams();
  const navRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState({ nav: false, page: false });
  const [approveButtonClicked, setApproveButtonClicked] = useState(false);
  const [cookies, setCookies] = useCookies();
  const userRole = cookies["userRole"];
  const { userRole: Role } = useSelector((state) => state.auth);
  const { venue } = useSelector((state) => state.getVenues);
  const { changingDecision, verificationSuccess, approvalBody } = useSelector((state) => state.Tournament);
  const { category } = useSelector((state) => state.event);
  const { tournament, tournamentEditMode } = useSelector((state) => state.GET_TOUR);

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

  const currentTitle = getPageTitle(location.pathname,{ tournamentId },{ venue, tournament, category });

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
            currentTitle !== "DASHBOARD" && "p-[50px]"
          } h-full ${
            shouldScroll.page ? "overflow-auto" : "overflow-auto"
          } scrollbar-hide ${currentTitle === "DASHBOARD" && "overflow-hidden"}`}
        >
          <div className="flex gap-2.5 items-center mb-4 ">
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
              <div className="flex items-center justify-between w-full">
                <p className="inline-flex  items-center gap-2.5 text-[#343C6A] font-semibold text-[22px]">
                  {currentTitle}
                  {tournamentId && (
                    <span
                      className={`inline-flex flex-1 w-full items-center rounded-2xl  px-2 py-1 text-xs font-medium  ring-1 ring-inset  ${tagColor}`}
                    >
                      {tournament?.status}
                    </span>
                  )}
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
                {currentTitle === "Coupons" &&
                  location.pathname === "/coupons" && (
                    <Button
                      type="button"
                      className="block rounded-md  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

                {(currentTitle?.startsWith("Venue Details") ||
                  currentTitle?.startsWith("Edit")) && (
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
                      userRole={userRole || Role}
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
  submitForm,
  isSubmitting,
}) => {
  return (
    <div className="flex gap-2.5 items-center">
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
              setEditMode={() => dispatch(setTournamentEditMode())}
              submitForm={async () => {
                await submitForm();
                dispatch(resetEditMode());
              }}
              isSubmitting={isSubmitting}
            />
          ))}
        {ROLES.slice(0, 2).includes(userRole) &&
          tournament?.status &&
          tournament?.status !== "ARCHIVED" && (
            <div className="flex items-center gap-2">
              <Button
                className={`${tournament?.status === "PUBLISHED" ? "hidden" : "flex"
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
                className={`${tournament?.status === "PUBLISHED" ? "hidden" : "flex"
                  } items-center justify-center gap-3 px-4 py-2 bg-red-700 text-white shadow-lg ml-auto rounded-[8px] hover:bg-red-600 disabled:bg-red-400`}
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
          setEditMode={()=>{
            dispatch(setVenueEditMode());
          }}
          submitForm={submitForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <button
          className="flex items-center justify-center gap-3 px-4 py-2 bg-[#1570EF] shadow-lg text-white ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
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
            className="flex items-center justify-center gap-3 px-4 py-2 bg-red-700 shadow-lg text-white ml-auto rounded-[8px] hover:bg-red-500 disabled:bg-red-500"
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
            className="flex items-center justify-center gap-3 px-4 py-2 bg-white shadow-lg text-customTextColor ml-auto rounded-[8px] hover:bg-gray-200 disabled:bg-gray-200"
            type="button"
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
            <span>
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
        className="flex items-center justify-center gap-3 px-4 py-2 bg-white shadow-lg text-black ml-auto rounded-[8px] hover:bg-blue-700 disabled:bg-blue-400"
        type="button"
        onClick={() => setEditMode()}
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
  userRole: PropTypes.string,
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
