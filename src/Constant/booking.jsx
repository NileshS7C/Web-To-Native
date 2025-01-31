import { EditIcon } from "../Assests";
import { Link } from "react-router-dom";
import BookingActions from "../Component/Common/BookingActions";

const data = [
  {
    _id: "6786c4657e6b94ad74400883",
    playerId: "6786c4417e6b94ad74400874",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "admin",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 100,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400884",
      },
    ],
    totalAmount: 100,
    discountCode: null,
    discountAmount: 0,
    finalAmount: 100,
    currentAmount: 100,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    createdAt: "2025-01-14T20:09:09.780Z",
    updatedAt: "2025-01-14T20:09:09.780Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400874",
      name: "Anchal",
      email: "anchal@example.com",
      phone: "1234567890",
    },
  },
  {
    _id: "6786c4657e6b94ad74400885",
    playerId: "6786c4417e6b94ad74400875",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "admin",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 120,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400886",
      },
    ],
    totalAmount: 120,
    discountCode: "DISCOUNT10",
    discountAmount: 10,
    finalAmount: 110,
    currentAmount: 110,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    createdAt: "2025-01-15T12:00:00.000Z",
    updatedAt: "2025-01-15T12:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400875",
      name: "Rahul",
      email: "rahul@example.com",
      phone: "9876543210",
    },
  },
  {
    _id: "6786c4657e6b94ad74400887",
    playerId: "6786c4417e6b94ad74400876",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "online",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 150,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400888",
      },
    ],
    totalAmount: 150,
    discountCode: null,
    discountAmount: 0,
    finalAmount: 150,
    currentAmount: 150,
    paymentStatus: "PENDING",
    status: "CONFIRMED",
    createdAt: "2025-01-16T09:00:00.000Z",
    updatedAt: "2025-01-16T09:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400876",
      name: "Suman",
      email: "suman@example.com",
      phone: "1122334455",
    },
  },
  {
    _id: "6786c4657e6b94ad74400889",
    playerId: "6786c4417e6b94ad74400877",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "admin",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 200,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400890",
      },
    ],
    totalAmount: 200,
    discountCode: "DISCOUNT20",
    discountAmount: 20,
    finalAmount: 180,
    currentAmount: 180,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    createdAt: "2025-01-17T10:00:00.000Z",
    updatedAt: "2025-01-17T10:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400877",
      name: "Neha",
      email: "neha@example.com",
      phone: "9988776655",
    },
  },
  {
    _id: "6786c4657e6b94ad74400891",
    playerId: "6786c4417e6b94ad74400878",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "online",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 100,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400892",
      },
    ],
    totalAmount: 100,
    discountCode: null,
    discountAmount: 0,
    finalAmount: 100,
    currentAmount: 100,
    paymentStatus: "PENDING",
    status: "CONFIRMED",
    createdAt: "2025-01-18T11:00:00.000Z",
    updatedAt: "2025-01-18T11:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400878",
      name: "Vikas",
      email: "vikas@example.com",
      phone: "4455667788",
    },
  },
  {
    _id: "6786c4657e6b94ad74400893",
    playerId: "6786c4417e6b94ad74400879",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "admin",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 150,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400894",
      },
    ],
    totalAmount: 150,
    discountCode: null,
    discountAmount: 0,
    finalAmount: 150,
    currentAmount: 150,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    createdAt: "2025-01-19T15:00:00.000Z",
    updatedAt: "2025-01-19T15:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400879",
      name: "Rohan",
      email: "rohan@example.com",
      phone: "6677889900",
    },
  },
  {
    _id: "6786c4657e6b94ad74400895",
    playerId: "6786c4417e6b94ad74400880",
    tournamentId: "6786869475b13269669a57dc",
    bookingType: "online",
    bookingItems: [
      {
        categoryId: "6786c04d5bd426de41b8ded9",
        amount: 130,
        status: "ACTIVE",
        _id: "6786c4657e6b94ad74400896",
      },
    ],
    totalAmount: 130,
    discountCode: null,
    discountAmount: 0,
    finalAmount: 130,
    currentAmount: 130,
    paymentStatus: "PENDING",
    status: "CONFIRMED",
    createdAt: "2025-01-20T14:00:00.000Z",
    updatedAt: "2025-01-20T14:00:00.000Z",
    __v: 0,
    player: {
      playerId: "6786c4417e6b94ad74400880",
      name: "Priya",
      email: "priya@example.com",
      phone: "5566778899",
    },
  },
];

const ActionButtonBooking = [
  { name: "Refund", action: "refund" },
  { name: "Cancel", action: "cancel" },
];
const bookingTableHeaders = [
  {
    key: "playerName",
    header: "Name",
    render: (item) => {
      return <p className="text-[#101828]">{item?.player?.name}</p>;
    },
  },
  {
    key: "emailAddress",
    header: "Email Address",
    render: (item) => {
      return <p className="text-player_table">{item?.player?.email || 0}</p>;
    },
  },
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
      return <BookingActions id={bookingData?._id} index={index} />;
    },
  },
];

export { bookingTableHeaders, data, ActionButtonBooking };
