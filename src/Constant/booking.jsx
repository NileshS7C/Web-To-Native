import { EditIcon } from "../Assests";
import { Link } from "react-router-dom";
import BookingActions from "../Component/Common/BookingActions";

const ActionButtonBooking = [
  { name: "Refund", action: "refund" },
  { name: "Cancel", action: "cancel" },
];
const bookingTableHeaders = [
  {
    key: "playerName",
    header: "Name",
    render: (item) => {
      const bookingItems = item?.bookingItems;
      const isDouble = bookingItems[0].isDoubles;
      let participantName;

      if (isDouble) {
        participantName = bookingItems[0].partnerDetails.name;
      }

      return (
        <div className="flex gap-2 items-center justify-center">
          <p className="text-[#101828]">{item?.player?.name}</p>
          {isDouble && (
            <>
              <span>&</span>
              <p>{participantName}</p>
            </>
          )}
        </div>
      );
    },
  },
  // {
  //   key: "emailAddress",
  //   header: "Email Address",
  //   render: (item) => {
  //     return <p className="text-player_table">{item?.player?.email || 0}</p>;
  //   },
  // },
  {
    key: "player_phone",
    header: "Phone",
    render: (item) => {
      return <p className="text-player_table">{item?.player?.phone}</p>;
    },
  },
  {
    key: "registrationDate",
    header: "Registration Date",
    render: (item) => {
      return <p>{item?.totalAmount}</p>;
    },
  },
  {
    key: "playerActions",
    header: "Actions",
    render: (bookingData, index) => {
      return (
        <BookingActions
          id={bookingData?._id}
          index={index}
          status={bookingData?.bookingItems[0]?.status}
        />
      );
    },
  },
];

export { bookingTableHeaders, ActionButtonBooking };
