
const people = [
    { position: '1', title: 'Learn', description: 'Explore curated picklybay content', redirect: 'https"//google.com' },
    { position: '2', title: 'Games', description: 'Create and join community games', redirect: 'https"//google.com' },
    // More people...
]

export default function FeaturedVenues() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto text-left">
                    <h1 className="text-base font-semibold text-gray-900">Explore Picklebay</h1>
                    {/* <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p> */}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-[#1570EF] px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-[#1570EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1570EF]"
                    >
                        Add user
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr className="text-left">
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Position
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Title
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Redirect
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {people.map((person) => (
                                    <tr key={person.email} className="text-left">
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                            {person.position}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.title}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.description}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.redirect}</td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                            <a href="#" className="text-[#1570EF] hover:text-indigo-900">
                                                Edit<span className="sr-only">, {person.name}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
