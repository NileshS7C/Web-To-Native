import React from "react";

const ContentTable = ({ data }) => {
  // Get the keys from the first object to create table headers
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
      <div className="overflow-x-auto  bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="text-left">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap"
                  >
                    {column === "redirect" ? (
                      <a
                        href={item[column]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1570EF]"
                      >
                        {item[column]}
                      </a>
                    ) : (
                      item[column]
                    )}
                  </td>
                ))}
                <td className="px-3 py-4 text-sm text-[#1570EF] whitespace-nowrap">
                  <a href="#" className="hover:text-[#1570EF]">
                    Edit<span className="sr-only">, {item.title}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default ContentTable;
