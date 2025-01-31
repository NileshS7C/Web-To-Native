import { Pagination } from "../Common/Pagination";
import PropTypes from "prop-types";
import VenueActions from "../Common/VenueActions";
export const VenueTable = ({
  venues,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#667085] sm:pl-0"
                >
                  S.No.
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-[#667085] sm:table-cell"
                >
                  Venue Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-[#667085] lg:table-cell"
                >
                  Courts
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-[#667085]"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-[#667085]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {venues.length > 0 &&
                venues.map((venue, index) => {
                  return (
                    <tr
                      key={venue._id}
                      className="text-sm text-[#667085] align-middle border-t-2 h-[55px]"
                    >
                      <td className="text-left text-[#2B2F38]">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </td>
                      <td className="text-left text-[#5D6679]">{venue.name}</td>
                      <td className="text-left text-[#5D6679]">
                        {venue.courts
                          .map((court) => court.courtNumber)
                          .join(",")}
                      </td>
                      <td className="text-left text-[#5D6679]">
                        <span className="inline-flex items-center rounded-2xl bg-green-50 px-2 py-1 text-xs font-medium text-[#41C588] ring-1 ring-inset ring-green-600/20">
                          {venue.status}
                        </span>
                      </td>
                      <td className="text-left text-[#5D6679]">
                        <VenueActions id={venue._id} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        total={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

VenueTable.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  venues: PropTypes.array,
};
