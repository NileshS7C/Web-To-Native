const tableHeaders = [
    {
        key: 'S.No.',
        header: 'S. No.',
        render: (item,i) => <div className="whitespace-nowrap min-w-[40px]">{i+1}</div>
    },
    {
        key: 'Date',
        header: 'Date',
        render: (item) => {
            const date = new Date(item.createdAt);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return <div className="whitespace-nowrap min-w-[80px]">{`${day}-${month}-${year}`}</div>;
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
        render: (item) => item.email?item.email:"Null"
    },
    {
        key: 'Skill Level',
        header: 'Skill Level',
        render: (item) => item.skillLevel
    },
    {
        key: 'Player-Gender',
        header: 'Gender',
        render: (item) => item.gender?item.gender:"Null"
    },
    {
        key: 'DOB',
        header: 'DOB',
        render: (item) => item.dob?item.dob:"Null"
    },
]

export default tableHeaders;