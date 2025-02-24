import PropTypes from "prop-types";
import DataTable from "../Common/DataTable";
import { ImageActions } from "./uploadedImageActions";
import { onPageChange } from "../../redux/Venue/getVenues";

const imageTableHeaders = [
  {
    key: "serial number",
    header: "S.No.",
    render: (_, index, currentPage) => (currentPage - 1) * 10 + (index + 1),
  },
  {
    key: "imageKey",
    header: "Key",
    render: (item) => <p>{item?.key}</p>,
  },
  {
    key: "imageSize",
    header: "Size",
    render: (item) => item?.size,
  },
  {
    key: "imageUrl",
    header: "Url",
    render: (item) => (
      <a href={item?.url} target="_blank" className="hover:text-blue-600">
        {item?.url}
      </a>
    ),
  },
  {
    key: "imageType",
    header: "Type",
    render: (item) => <p>{item?.type}</p>,
  },
  {
    key: "actions",
    header: "Actions",
    render: (item) => <ImageActions item={item} />,
  },
];

export const UploadedFilesListing = ({ currentPage, files, totalFiles }) => {
  return (
    <div>
      <DataTable
        columns={imageTableHeaders}
        totalPages={totalFiles || 20}
        currentPage={currentPage}
        onPageChange={onPageChange}
        data={files}
        pathName="/images"
        evenRowColor="[#FFFFFF]"
        oddRowColor="blue-400"
        alternateRowColors="true"
      />
    </div>
  );
};

UploadedFilesListing.propTypes = {
  currentPage: PropTypes.number || PropTypes.string,
  files: PropTypes.array,
  totalFiles: PropTypes.number,
};
