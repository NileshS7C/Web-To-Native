import PropTypes from "prop-types";
import { useState } from "react";

import { FaRegCopy } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";

export const ImageActions = ({ item }) => {
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
  return (
    <button onClick={handleCopyUrl}>
      {hasUrlCopied ? <LuCopyCheck /> : <FaRegCopy />}
    </button>
  );
};

ImageActions.propTypes = {
  item: PropTypes.object,
};
