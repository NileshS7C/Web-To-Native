import { Switch } from "@headlessui/react";

export default function ToggleButton({ enabled, setEnabled, type }) {
  const isChecked = enabled && enabled[type];

  return (
    <Switch
      checked={isChecked}
      onChange={() =>
        setEnabled((prev) => ({
          ...prev,
          [type]: !prev[type],
        }))
      }
      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 inline-block h-5 w-5 transform rounded-full   shadow-sm transition duration-200 ease-in-out ${
          isChecked ? "translate-x-5 bg-indigo-500" : "translate-x-0 bg-white"
        }`}
      />
    </Switch>
  );
}
