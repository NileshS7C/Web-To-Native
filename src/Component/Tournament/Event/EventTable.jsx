import { useDispatch, useSelector } from "react-redux";
import Button from "../../Common/Button";
import {
  onPageChangeEvent,
  toggleModal,
} from "../../../redux/tournament/eventSlice";
import { useEffect } from "react";
import { getAllCategories } from "../../../redux/tournament/tournamentActions";
import DataTable from "../../Common/DataTable";
import { eventTableHeaders } from "../../../Constant/tournament";
import Spinner from "../../Common/Spinner";
import { useParams } from "react-router-dom";

export const EventTable = ({ isDisable }) => {
  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const { currentPage, categories, totalCategories, isLoading } = useSelector(
    (state) => state.event
  );
  useEffect(() => {
    dispatch(
      getAllCategories({
        currentPage,
        limit: 10,
        id: tournamentId,
      })
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1  gap-2.5">
      {!categories?.length && (
        <table className="border-[1px] border-[#EAECF0] rounded-[8px] table-auto">
          <tr className="text-sm text-[#667085] bg-[#F9FAFB] font-[500] border-b-[1px] h-[44px] space-x-4">
            <th className="text-left">S.No.</th>
            <th className="text-left ">Event Category</th>
            <th className="text-left">Event Format</th>
            <th className="text-left">Date</th>
            <th className="text-left">Venue</th>
            <th className="text-left">Actions</th>
          </tr>
          <tr>
            <td colSpan="6" className="text-center py-5">
              <NoEventCreated />
            </td>
          </tr>
        </table>
      )}

      {categories?.length > 0 && (
        <DataTable
          columns={eventTableHeaders}
          data={categories}
          totalPages={totalCategories}
          currentPage={currentPage}
          onPageChange={onPageChangeEvent}
          className="border-[1px] rounded-md"
        />
      )}
    </div>
  );
};

const NoEventCreated = () => {
  const dispatch = useDispatch();
  return (
    <div className="grid grid-rows-3 gap-[20px] justify-items-center">
      <p className="text-base text-[#5B8DFF]">No Event Created Yet!</p>
      <p className="text-base text-[#686868]">
        You haven't created any events yet! Start by creating a new event.
      </p>
      <Button
        className="text-[16px] leading-[19px] font-[500] bg-[#1570EF] text-[#FFFFFF] w-[158px] h-[43px] rounded-[4px] "
        onClick={() => dispatch(toggleModal())}
      >
        Add New Event
      </Button>
    </div>
  );
};
