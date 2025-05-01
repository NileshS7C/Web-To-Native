import { BiCommentError } from "react-icons/bi";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function ErrorBanner({ message }) {
  return (
    <div className="sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8 items-center gap-2">
      <BiCommentError color="red" className="w-8 h-8" />
      <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-red-600 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4">
        <p className="text-sm/6 text-white">{message}</p>
      </div>
    </div>
  );
}
