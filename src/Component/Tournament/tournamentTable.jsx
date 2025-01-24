import { Pagination } from "../Common/Pagination";
import PropTypes from "prop-types";
export const CreateTournamentTable = ({
  columns,
  data,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item?.id || item?._id || index}
              className="text-sm text-[#667085] align-middle flex items-center justify-between bg-[#FFFFFF] rounded-lg py-4 px-4"
            >
              {columns.map((column, colIndex) => {
                const cellContent = column.render
                  ? column.render(item, index, currentPage)
                  : item?.[column.key];

                return (
                  <div
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
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div>
            <div
              colSpan={columns.length}
              className="text-center py-4 text-[#667085]"
            >
              No data available
            </div>
          </div>
        )}
      </div>
      {totalPages > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasLink={true}
        />
      )}
    </div>
  );
};

CreateTournamentTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
};
