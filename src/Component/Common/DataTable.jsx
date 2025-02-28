import PropTypes from "prop-types";
import { Pagination } from "./Pagination";

const DataTable = ({
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  className = "",
  pathName = "",
  headerTextAlign = "left",
  rowPaddingY = 0,
  alternateRowColors = false,
  evenRowColor = "none",
  oddRowColor = "none",
  onClick = null,
  rowTextAlignment = "left",

  pageLimit = 10,

  rowsInOnePage,

}) => {
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    return <div>Invalid data or columns provided</div>;
  }

  return (
    <div className="flex flex-col gap-2.5 justify-start">
      <div className="">
        <div className="-mx-4  sm:-mx-0">
          <table
            className={`min-w-full border-none sm:divide-y sm:divide-gray-300 ${className}`}
          >
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#F9FAFB]">
                {columns.map((column, index) => (
                  <th
                    key={column.key || `column-${index}`}
                    scope="col"
                    className={`py-3.5 text-${headerTextAlign} text-sm font-semibold text-[#667085] ${
                      column.key === "serialNumber"
                        ? "pl-4 pr-3 sm:pl-0"
                        : column.key === "playerActions"
                        ? "pl-4 text-right"
                        : "px-3"
                    } ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-4 divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => {
                  let backgroundRowColor;

                  if (alternateRowColors) {
                    backgroundRowColor =
                      index % 2 === 0
                        ? `bg-${evenRowColor}`
                        : `bg-${oddRowColor}`;
                  }
                  return (
                    <tr
                      key={item?.id || item?._id || index}
                      className={`block text-sm text-[#667085] md:border-t-2 md:h-[55px] md:table-row md:shadow-none shadow-lg align-middle ${backgroundRowColor}`}
                    >
                      <div className="md:hidden flex flex-col bg-white rounded-xl">
                        {columns.map((column, colIndex) => {
                          const cellContent = column.render
                            ? column.render(item, index, currentPage, onClick)
                            : item?.[column.key];

                          return (
                            <div
                              key={`${item?.id || item?._id || index}-${
                                column.key || colIndex
                              }`}
                              className="flex justify-between items-center gap-3 px-4 py-3 "
                            >
                              <span className="font-medium text-black">
                                {column.header}:
                              </span>
                              <span
                                className={`text-gray-600 ${
                                  column.key === "serialNumber"
                                    ? "text-[#2B2F38]"
                                    : "text-[#5D6679]"
                                } ${column.cellClassName || ""}`}
                              >
                                {cellContent}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {columns.map((column, colIndex) => {
                        const cellContent = column.render
                          ? column.render(item, index, currentPage, onClick)
                          : item?.[column.key];

                        return (
                          <td
                            key={`${item?.id || item?._id || index}-${
                              column.key || colIndex
                            }`}
                            className={`text-${rowTextAlignment} py-${rowPaddingY}  hidden md:table-cell ${
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
                  );
                })
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
      {totalPages > pageLimit && (
        <Pagination
          currentPage={currentPage}
          total={totalPages}
          onPageChange={onPageChange}
          hasLink={true}
          pathName={pathName}

          rowsInOnePage={pageLimit}

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
  pathName: PropTypes.string,
  headerTextAlign: PropTypes.string,
  rowPaddingY: PropTypes.string,
  alternateRowColors: PropTypes.bool,
  evenRowColor: PropTypes.string,
  oddRowColor: PropTypes.string,
  onClick: PropTypes.func,
  rowTextAlignment: PropTypes.string,
};

export default DataTable;
