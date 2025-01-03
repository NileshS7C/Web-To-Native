import { Button } from "@headlessui/react";
import { courtTableContent } from "../../Constant/venue";
import DataTable from "../Common/DataTable";
import { useDispatch } from "react-redux";
import { showForm } from "../../redux/Venue/addVenue";
import { useNavigate, useParams } from "react-router-dom";

export const CourtListing = ({
  courts,
  currentPage,
  totalVenues,
  onPageChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="flex flex-col ">
      <div className="flex justify-between bg-[#FFFFFF] items-center px-[24px] py-[20px]">
        <p className="text-[18px] font-semibold text-[#101828]">Courts</p>
        <Button
          type="button"
          className="block rounded-md bg-[#1570EF]  px-3 py-2 text-center text-sm font-medium text-[#FFFFFF] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate(`/venues/${id}/add-Court`)}
        >
          Add Court
        </Button>
      </div>
      <DataTable
        columns={courtTableContent}
        data={courts}
        currentPage={currentPage}
        totalPages={totalVenues}
        onPageChange={onPageChange}
      />
    </div>
  );
};
