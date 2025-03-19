import PropTypes from "prop-types";
import DataTable from "../Common/DataTable";
import ErrorBanner from "../Common/ErrorBanner";
import { TournamentOrganiserCreation } from "../Common/TournamentOrganiserModal";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { passRegex, phoneRegex, rowsInOnePage } from "../../Constant/app";
import { Link, useSearchParams } from "react-router-dom";
import { TournamentOrganiserActions } from "../Common/TournamentOrganisersActions";
import { useEffect, useState } from "react";
import { toggleOrganiserModal } from "../../redux/tournament/tournamentOrganiserSlice";
import { getTournamentOrganiser } from "../../redux/tournament/tournamentOrganiserActions";
import { getAll_TO } from "../../redux/tournament/tournamentActions";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  ownerDetails: {
    brandName: "",
    brandEmail: "",
    brandPhone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      location: {
        type: "Point",
        coordinates: ["", ""],
      },
    },
  },
};

const TournamentOrganisersHeaders = [
  {
    key: "tour_org_name",
    header: "Name",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <Link
            className="text-customColor font-semibold"
            to={{
              pathname: "/tournament-organisers",
              search: `${item.id}`,
            }}
          >
            {item?.name}
          </Link>
        </div>
      );
    },
  },
  {
    key: "tour_org_email",
    header: "Email",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-tour_List_Color">{item?.email}</p>
        </div>
      );
    },
  },
  {
    key: "tour_org_phone",
    header: "Phone",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-tour_List_Color">{item?.phone}</p>
        </div>
      );
    },
  },
  {
    key: "tour_org_roleName",
    header: "Role Name",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-tour_List_Color">{item?.roleName}</p>
        </div>
      );
    },
  },

  {
    key: "tour_org_actions",
    header: "Actions",
    render: (item) => {
      return <TournamentOrganiserActions id={item?.id} />;
    },
  },
];

export const TournamentOrganisersListing = ({
  owners,
  error,
  total,
  currentPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const organiserId = searchParams.get("organiserId");
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Organiser name is required.")
      .min(3, "Name should have atleast 3 characters.")
      .max(50, "Name should have less than 50 characters."),

    email: yup.string().email().required("Organiser email is required."),
    phone: yup
      .string()
      .matches(phoneRegex, "Invalid phone number.")
      .required("Organiser phone is required."),
    password:
      !organiserId &&
      yup
        .string()
        .matches(
          passRegex,
          " Password must have at least 8 characters, including uppercase, lowercase, a number, and a special character."
        )
        .required("Organiser Password is required."),
    ownerDetails: yup.object().shape({
      brandName: yup.string().required("Brand Name is required."),
      brandEmail: yup.string().required("Brand email is required."),
      brandPhone: yup.number().required("Brand phone is required."),
      address: yup.object().shape({
        line1: yup
          .string()
          .required("Line 1 address is required.")
          .max(100, "Line 1 of the address cannot exceed 50 characters."),
        line2: yup
          .string()
          .optional()
          .max(100, "Line 2 of the address cannot exceed 50 characters."),
        city: yup.string().required("City is required."),
        state: yup.string().required("State is required."),
        postalCode: yup
          .string()
          .required("Postal Code is required.")
          .matches(/^\d{6}$/, "Postal Code must be 6 digits."),
        location: yup.object().shape({
          type: yup
            .string()
            .oneOf(["Point"], "Location type must be 'Point'.")
            .required("Location type is required."),
          coordinates: yup
            .array()
            .of(yup.number().required("Each coordinate must be a number."))
            .length(2, "Location must be provided.")
            .required("Location is required."),
        }),
      }),
    }),
  });
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [initialState, setInitialState] = useState(initialValues);
  const [actionPending, setActionPending] = useState(false);
  const { openOrganiserModal } = useSelector((state) => state.tour_Org);
  const { location } = useSelector((state) => state.location);

  useEffect(() => {
    const getOrganiserDetails = async (id) => {
      try {
        setActionPending(true);
        setHasError(false);
  
        console.log("Fetching organiser details for ID:", id);
        const result = await dispatch(getTournamentOrganiser(id)).unwrap();
  
        if (!result || result.responseCode) {
          console.log("No valid data returned.");
          setHasError(true);
          return;
        }
  
        console.log("Fetched data:", result.data);
  
        const ownerDetails = result?.data?.owner || {};
        const address = ownerDetails?.address || {};
        const location = address?.location || {};
  
        const { is_location_exact, ...updatedLocation } = location;
        const { ownerUserType, ...updatedOwnerDetails } = ownerDetails;
  
        const updatedData = {
          name: result.data?.name || "",
          phone: result.data?.phone || "",
          email: result.data?.email || "",
          password: "", // Do not fetch password for security
          ownerDetails: {
            ...updatedOwnerDetails,
            address: {
              ...address,
              location: updatedLocation, // Excludes `is_location_exact`
            },
          },
        };
  
        setInitialState(updatedData);
  
        // ✅ Always open the modal when editing
        dispatch(toggleOrganiserModal(true));
      } catch (err) {
        console.log("Error occurred while getting the organiser details", err);
        setHasError(true);
      } finally {
        setActionPending(false);
      }
    };
  
    if (organiserId) {
      getOrganiserDetails(organiserId);
    }
  }, [organiserId]); // ✅ Removed initialState from dependencies
  
  useEffect(() => {
    if (!openOrganiserModal) {
      setSearchParams((prevParams) => {
        const updatedParams = new URLSearchParams(prevParams);

        updatedParams.delete("organiserId");

        return updatedParams;
      });
      setInitialState({ ...initialValues });
    }
  }, [openOrganiserModal]);

  if (error) {
    return (
      <ErrorBanner message="Opps! Some thing went wrong while getting the tournament owners." />
    );
  }
  return (
    <div className="rounded-lg">
      <TournamentOrganiserCreation
        dispatch={dispatch}
        isOpen={openOrganiserModal}
        initialValues={initialState}
        location={location}
        validationSchema={validationSchema}
        organiserId={organiserId}
        actionPending={actionPending}
      />
      <DataTable
        data={owners}
        columns={TournamentOrganisersHeaders}
        alternateRowColors={true}
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-100"
        totalPages={total}
        currentPage={currentPage}
        pathName="/tournament-organisers"
        rowPaddingY="5"
      />
    </div>
  );
};

TournamentOrganisersListing.propTypes = {
  owners: PropTypes.array,
  error: PropTypes.bool,
  total: PropTypes.number,
  currentPage: PropTypes.number,
};
