import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function NotFound() {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/");
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-100">
      <div className="flex flex-col items-center justify-center flex-1 flex-wrap gap-4">
        <p className="text-customColor text-xl">
          Oops! We can't find the page you're looking for. Try checking the URL
          or going back to the homepage.
        </p>
        <Button
          className="px-[100px] py-[20px] rounded-xl  text-white"
          onClick={handleNavigation}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
