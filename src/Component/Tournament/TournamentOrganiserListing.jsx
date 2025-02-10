import PropTypes from "prop-types";
import DataTable from "../Common/DataTable";
import ErrorBanner from "../Common/ErrorBanner";

const TournamentOrganisersHeaders = [
  {
    key: "tour_org_name",
    header: "Name",
    render: (item) => {
      return (
        <div className="flex flex-col">
          <p className="text-customColor font-semibold">{item?.name}</p>
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
];

export const TournamentOrganisersListing = ({
  owners,
  error,
  total,
  currentPage,
}) => {
  if (error) {
    return (
      <ErrorBanner message="Opps! Some thing went wrong while getting the tournament owners." />
    );
  }
  return (
    <div className="rounded-lg">
      <DataTable
        data={owners}
        columns={TournamentOrganisersHeaders}
        alternateRowColors={true}
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
        totalPages={total}
        currentPage={currentPage}
        pathName="/tournament-organisers"
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
