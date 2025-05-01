import { formattedDate } from "../utils/dateUtils";
import { MdDeleteOutline } from "react-icons/md";

const couponsTableHeaders = [
    {
        key: 'Code',
        header: 'Code',
        render: (item) => item.code,
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: 'Type',
        header: 'Type',
        render: (item) => item.assignedTo,
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: 'End Date',
        header: 'End Date',
        render: (item) => formattedDate(item.endDate),
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: 'Start Date',
        header: 'Start Date',
        render: (item) => formattedDate(item.startDate),
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: 'Value',
        header: 'Value',
        render: (item) => 
            item.discountType === "PERCENTAGE" ? `${item.value}%` : item.value,
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: 'Status',
        header: 'Status',
        render: (item) => (
            <span
                className={`inline-flex items-center justify-center rounded-2xl px-3 py-2 text-xs font-medium ring-1 ring-inset
                    ${item.isActive 
                        ? "bg-green-50 text-[#41C588] ring-green-600/20" 
                        : "bg-gray-50 text-gray-500 ring-gray-400/20"
                    }`}
            >
                {item.isActive ? "Active" : "Expired"}
            </span>
        ),
        className: "text-center",
        cellClassName: "text-center",
    },
    {
        key: "actions",
        header: "Actions",
        render: (item) => (
          <button 
            onClick={() => {
                handleDelete(item.code);
            }}
            className="flex justify-center w-full"
        >
            <MdDeleteOutline className="h-5 w-5" />
          </button>
        ),
        className: "text-center",
        cellClassName: "text-center",
    },
];

export default couponsTableHeaders;
