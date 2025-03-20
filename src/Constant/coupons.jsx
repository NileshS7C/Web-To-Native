import { formattedDate } from "../utils/dateUtils";

const couponsTableHeaders = [
    {
        key: 'Code',
        header: 'Code',
        render: (item) => item.code
    },
    {
        key: 'Type',
        header: 'Type',
        render: (item) => item.assignedTo
    },
    {
        key: 'End Date',
        header: 'End Date',
        render: (item) => formattedDate(item.endDate)
    },
    {
        key: 'Start Date',
        header: 'Start Date',
        render: (item) => formattedDate(item.startDate)
    },
    {
        key: 'Value',
        header: 'Value',
        render: (item) => 
            item.discountType === "PERCENTAGE" ? `${item.value}%` : item.value
    },
    {
        key: 'Status',
        header: 'Status',
        render: (item) => item.isActive ? "Active" : "Expaired"
    },
];

export default couponsTableHeaders;
