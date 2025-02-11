import { CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import Spinner from "./Spinner";
import { IoIosAddCircleOutline } from "react-icons/io";
import PropTypes from "prop-types";

const CreateTags = ({ selectedTag, handleRemoveTag }) => {
  return (
    <>
      {selectedTag.map((tag, index) => (
        <div className="" key={index}>
          <span className="inline-flex gap-2 items-center justify-between rounded-2xl bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-500">
            {tag}
            <RxCrossCircled
              className="cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            />
          </span>
        </div>
      ))}
    </>
  );
};

export default function Combopopover({
  isGettingTags,
  uniqueTags,
  setFieldValue,
  checkedTags,
  placeholder,
  label,
}) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(checkedTags);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const handleClickOutSide = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowInput(false);
    }
  };

  const handleTagSection = (checked, value) => {
    if (checked) {
      setSelectedTags((prevTags) =>
        !prevTags.includes(value) ? [...prevTags, value] : [...prevTags]
      );
    } else {
      const updatedTags = selectedTags.filter(
        (tag) => tag.toLowerCase() !== value.toLowerCase()
      );
      setSelectedTags(updatedTags);
    }
  };

  const handleTagUserInput = () => {
    const queryArray = query.split(/\s*,\s*/);
    setSelectedTags((prevTags) => {
      const uniqueTags = queryArray.filter((tag) => !prevTags.includes(tag));
      console.log(" unique tags", prevTags);
      return [...prevTags, ...uniqueTags];
    });

    setQuery("");
    setShowInput(false);
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = selectedTags.filter(
      (value) => value.toLowerCase() !== tag.toLowerCase()
    );
    setSelectedTags(updatedTags);
  };

  useEffect(() => {
    setSelectedTags(checkedTags);
  }, [checkedTags]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  useEffect(() => {
    setFieldValue("tags", selectedTags);
  }, [selectedTags]);

  return (
    <div className="w-full flex flex-col items-start gap-2.5" ref={inputRef}>
      <label className="text-[#232323] text-base leading-[19.36px]" htmlFor="">
        {label}
      </label>
      <div className="relative w-full">
        <input
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onFocus={() => setShowInput(true)}
          placeholder={placeholder}
        />

        {showInput && (
          <options className="absolute z-10 left-0 top-14 min-h-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {query && (
              <div
                className="flex items-center gap-2.5   group relative cursor-default select-none pl-2 py-2 pl- pr-4 text-gray-900 hover:bg-gray-100 data-[focus]:text-black data-[focus]:outline-none"
                onClick={handleTagUserInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagUserInput;
                  }
                }}
                role="button"
                tabIndex="0"
              >
                <IoIosAddCircleOutline width="20px" height="20px" />
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">Add</p>

                  <p>{query}</p>
                </div>
              </div>
            )}

            {!uniqueTags.length && (
              <p className="align-middle">
                No tags found. Please add tags manually.{" "}
              </p>
            )}

            {!isGettingTags ? (
              uniqueTags.map((tag) => (
                <div
                  key={tag}
                  value={tag}
                  className="group relative cursor-default select-none py-2 pl- pr-4 text-gray-900 hover:bg-gray-100 data-[focus]:text-black data-[focus]:outline-none"
                >
                  <div className="flex items-center gap-2.5 p-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        handleTagSection(isChecked, tag);
                      }}
                      checked={selectedTags?.includes(tag)}
                      readOnly
                    />
                    <span className="block truncate group-data-[selected]:font-semibold">
                      {tag}
                    </span>
                  </div>
                  <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                    <CheckIcon className="size-5" />
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <Spinner />
              </div>
            )}
          </options>
        )}
      </div>
      <div className="flex gap-2.5 items-center flex-wrap">
        <CreateTags
          selectedTag={selectedTags}
          handleRemoveTag={handleRemoveTag}
        />
      </div>
    </div>
  );
}
