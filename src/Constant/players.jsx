const tableHeaders = [
    {
        key: 'S.No.',
        header: 'S. No.',
        render: (item,i) => i+1
    },
    {
        key: 'Date',
        header: 'Date',
        render: (item) => {
            const date = new Date(item.createdAt);
            return <div className="whitespace-nowrap min-w-[80px]">{date.toISOString().split('T')[0]}</div>;
        }
    },
    {
        key: "Player_Type",
        header: "Type",
        render: (item) => item.playerType
    },
    {
        key: 'Player_Name',
        header: 'Name',
        render: (item) => item.name
    },
    {
        key: "Phone Number",
        header: "Phone No.",
        render: (item) => item.phone
    },
    {
        key: "Email",
        header: "Email",
        render: (item) => item.email
    },
    {
        key: 'Skill Level',
        header: 'Skill Level',
        render: (item) => item.skillLevel
    },
    {
        key: 'Player-Gender',
        header: 'Gender',
        render: (item) => item.gender
    },
    {
        key: 'DOB',
        header: 'DOB',
        render: (item) => item.dob
    },
]

export default tableHeaders;