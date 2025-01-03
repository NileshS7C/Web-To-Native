import Button from "../../Common/Button";

export const EventTable = () => {
  return (
    <div className="grid grid-cols-1  gap-2.5">
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
    </div>
  );
};

const NoEventCreated = () => {
  return (
    <div className="grid grid-rows-3 gap-[20px] justify-items-center">
      <p className="text-base text-[#5B8DFF]">No Event Created Yet!</p>
      <p className="text-base text-[#686868]">
        You haven't created any events yet! Start by creating a new event.
      </p>
      <Button className="text-[16px] leading-[19px] font-[500] bg-[#1570EF] text-[#FFFFFF] w-[158px] h-[43px] rounded-[4px] ">
        Add New Event
      </Button>
    </div>
  );
};
