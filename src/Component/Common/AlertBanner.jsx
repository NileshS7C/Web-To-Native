import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export default function AlertBanner({ title, description }) {
  return (
    <div className="rounded-md bg-[#FFF0D3] p-4">
      <div className="flex items-center">
        <div className="shrink-0">
          <ExclamationCircleIcon
            aria-hidden="true"
            className="size-5 text-[#E82B00]"
          />
        </div>
        <div className="ml-3 flex flex-col items-start gap-2">
          {title && (
            <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          )}
          <div className="text-sm text-[#E82B00]">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
