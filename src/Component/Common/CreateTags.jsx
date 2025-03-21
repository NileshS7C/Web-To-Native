import PropTypes from "prop-types";
import { RxCrossCircled } from "react-icons/rx";

/* 
 It can handle unique as well as duplicate tags while removing
*/

export const CreateTags = ({ selectedTag, handleRemoveTag }) => {
  return (
    <>
      {selectedTag.map((tag, index) => (
        <div className="" key={index}>
          <span className="inline-flex gap-2 items-center justify-between rounded-2xl bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-500">
            {tag?.name}
            <RxCrossCircled
              className="cursor-pointer"
              onClick={() => handleRemoveTag(tag?.key)}
            />
          </span>
        </div>
      ))}
    </>
  );
};

CreateTags.propTypes = {
  selectedTag: PropTypes.array,
  handleRemoveTag: PropTypes.func,
};
