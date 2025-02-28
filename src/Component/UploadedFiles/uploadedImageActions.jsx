import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { FaRegCopy } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { setDeleteImageDetails } from "../../redux/Upload/uploadImage";
import { useDispatch } from "react-redux";

export const ImageActions = ({ item }) => {
  const dispatch = useDispatch();
  const [hasUrlCopied, setHasUrlCopied] = useState(false);
  const [hasError, setHasError] = useState(false);
  const handleCopyUrl = async () => {
    try {
      setHasError(false);
      await navigator.clipboard.writeText(item?.url || "");
      setHasUrlCopied(true);
    } catch (err) {
      setHasError(true);
    }
  };

  useEffect(() => {
    let timerId;
    if (hasUrlCopied) {
      timerId = setTimeout(() => {
        setHasUrlCopied(false);
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [hasUrlCopied]);

  const handleDeleteFile = (item) => {
    dispatch(setDeleteImageDetails([item?.url]));
  };
  return (
    <div>
      <button onClick={handleCopyUrl}>
        {hasUrlCopied ? (
          <LuCopyCheck className="w-[20px] h-[20px]" />
        ) : (
          <FaRegCopy className="w-[20px] h-[20px]" />
        )}
      </button>
      <button onClick={() => handleDeleteFile(item)}>
        <MdDeleteOutline className="w-[20px] h-[20px]" />
      </button>
    </div>
  );
};

ImageActions.propTypes = {
  item: PropTypes.object,
};
