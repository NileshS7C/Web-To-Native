import PropTypes from "prop-types";
import { Pagination } from "./Pagination";
const DataTable = ({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  className = "",
}) => {
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    return <div>Invalid data or columns provided</div>;
  }

  return (
    <div className="flex flex-col gap-2.5 justify-start">
      <div className="">
        <div className="-mx-4  sm:-mx-0 ">
          <table className={`min-w-full divide-y divide-gray-300 ${className}`}>
            <thead>
              <tr className="bg-[#F7F9FC]">
                {columns.map((column, index) => (
                  <th
                    key={column.key || `column-${index}`}
                    scope="col"
                    className={`py-3.5 text-left text-sm font-semibold text-[#667085] ${
                      column.key === "serialNumber"
                        ? "pl-4 pr-3 sm:pl-0"
                        : "px-3"
                    } ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item?.id || item?._id || index}
                    className="text-sm text-[#667085] align-middle border-t-2 h-[55px]"
                  >
                    {columns.map((column, colIndex) => {
                      const cellContent = column.render
                        ? column.render(item, index, currentPage)
                        : item?.[column.key];

                      return (
                        <td
                          key={`${item?.id || item?._id || index}-${
                            column.key || colIndex
                          }`}
                          className={`text-left ${
                            column.key === "serialNumber"
                              ? "text-[#2B2F38]"
                              : "text-[#5D6679]"
                          } ${column.cellClassName || ""}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-[#667085]"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  className: PropTypes.string,
};

export default DataTable;
