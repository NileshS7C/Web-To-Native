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
    key: "uploadedImage",
    header: "Image",
    render: (item) => (
      <img
        src={item?.url}
        alt="uploaded files"
        className="w-[70px] h-[70px] object-contain"
      />
    ),
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
    key: "imageSize",
    header: "Size",
    render: (item) => (
      <p>
        {item?.size && Math.ceil(parseInt(item?.size) / 1024)}{" "}
        <span className="font-semibold">kB</span>
      </p>
    ),
  },
  {
    key: "imageType",
    header: "Type",
    render: (item) => {
      const imageType = item?.mimeType
        ? item.mimeType.split("image/").join("").toUpperCase()
        : "";

      return <p>{imageType}</p>;
    },
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
        totalPages={totalFiles}
        currentPage={currentPage}
        onPageChange={onPageChange}
        data={files}
        pathName="/uploaded-images"
        evenRowColor="[#FFFFFF]"
        oddRowColor="[#FFFFFF]"
        alternateRowColors={true}
        pageLimit={20}
      />
    </div>
  );
};

UploadedFilesListing.propTypes = {
  currentPage: PropTypes.number || PropTypes.string,
  files: PropTypes.array,
  totalFiles: PropTypes.number,
};
