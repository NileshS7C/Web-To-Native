import { BackwardIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export const Page = ({ title, primaryAction }) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`${primaryAction.path}`);
  };
  return (
    <div className="flex justify-start mb-[20px]">
      <h1 className="font-bold text-[24px] text-[#343C6A]">{title}</h1>
      {primaryAction && (
        <button onClick={handleNavigation}>{BackwardIcon}</button>
      )}
    </div>
  );
};
