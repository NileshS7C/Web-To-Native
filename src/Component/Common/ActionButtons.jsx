import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ThreeDotIcon } from "../../Assests";

export const ActionButtons = ({
  actions,
  actionHandlers,
  data,
  index,
  isNotEditable = false,
}) => {
  const handleAction = (actionType) => {
    const handler = actionHandlers[actionType];
    if (handler) {
      handler(data);
    }
  };
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
        {!isNotEditable && <img src={ThreeDotIcon} alt="three dot icon" />}
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-1/2 z-10 mt-1 flex w-screen max-w-max -translate-x-1/2 px-2  transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="w-32 max-w-md flex-auto overflow-hidden rounded-2xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
          <div className="p-2">
            {actions.map((item) => (
              <div
                key={item.name}
                className="group relative flex  rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="mt-1 flex gap-2.5 size-4 flex-none items-center justify-start rounded-lg bg-gray-50 group-hover:bg-white">
                  <button
                    className="flex gap-2.5"
                    onClick={() => handleAction(item.action)}
                  >
                    <img
                      src={item.icon}
                      className="size-6 text-gray-600 group-hover:text-indigo-600"
                      alt={`${item.name} icon`}
                    />
                    <p>{item.name}</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
};
