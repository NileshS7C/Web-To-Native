const tableHeaders = [
    {
        key: 'Player ID',
        header: 'Player ID',
        render: (item) => item._id
    },
    {
        key: 'Player_Name',
        header: 'Player Name',
        render: (item) => item.name
    },
    {
        key: "Player_Type",
        header: "Player Type",
        render: (item) => item.playerType
    },
    {
        key: "Phone Number",
        header: "Phone No.",
        render: (item) => item.phone
    },
    {
        key: 'Skill Level',
        header: 'Skill Level',
        render: (item) => item.skillLevel
    },
]

export default tableHeaders;