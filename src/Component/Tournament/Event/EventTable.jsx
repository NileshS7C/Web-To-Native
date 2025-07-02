import PropTypes from "prop-types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories, deleteSingleCategory } from "../../../redux/tournament/tournamentActions";
import Button from "../../Common/Button";
import { onPageChangeEvent, toggleModal, resetAllCategories, setDeleteCategoryId } from "../../../redux/tournament/eventSlice";
import DataTable from "../../Common/DataTable";
import { eventTableHeaders } from "../../../Constant/tournament";
import Spinner from "../../Common/Spinner";
import { resetConfirmationState } from "../../../redux/Confirmation/confirmationSlice";

export const EventTable = ({ isDisable, categories }) => {

  const dispatch = useDispatch();
  const { tournamentId } = useParams();
  const { currentPage, totalCategories, isLoading, deleteCategoryId } = useSelector((state) => state.event);
  const { isConfirmed, type } = useSelector((state) => state.confirm);

  useEffect(() => {
    if (isConfirmed && type === "Event" && tournamentId && deleteCategoryId) {
      dispatch(
        deleteSingleCategory({
          tour_Id: tournamentId,
          eventId: deleteCategoryId,
        })
      ).then(() => {
        dispatch(resetConfirmationState());
        dispatch(resetAllCategories());
        dispatch(
          getAllCategories({
            currentPage,
            limit: 10,
            id: tournamentId
          })
        );
      });
    }
  }, [isConfirmed, type, tournamentId, deleteCategoryId]);

  const handleDelete = (id) => {
    dispatch(setDeleteCategoryId(id));
  };

  useEffect(()=>{
    dispatch(
      getAllCategories({
        currentPage,
        limit: 10,
        id: tournamentId
      })
    );
  },[currentPage])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1  gap-2.5">
      {!categories.length && (
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
              <NoEventCreated disabled={isDisable} />
            </td>
          </tr>
        </table>
      )}

      {categories.length > 0 && (
        <DataTable
          columns={eventTableHeaders}
          data={categories}
          totalPages={totalCategories}
          currentPage={currentPage}
          onPageChange={onPageChangeEvent}
          className="border-[1px] rounded-md"
          onClick={(id) => handleDelete(id)}
          hasLink={false}
          navigateTo={isDisable ? "tournaments" : ""}
        />
      )}
    </div>
  );
};
 
const NoEventCreated = ({ disabled }) => {
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
        disabled={disabled}
      >
        Add New Event
      </Button>
    </div>
  );
};

EventTable.propTypes = {
  isDisable: PropTypes.bool,
};
