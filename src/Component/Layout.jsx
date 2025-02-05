import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header/header";
import { NavBar } from "./SideNavBar/NavBar";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { getPageTitle } from "../Constant/titles";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { venue } = useSelector((state) => state.getVenues);
  const currentTitle = getPageTitle(location.pathname, { id }, venue);

  // Define the custom route where the div should be hidden
  const hiddenRoutes = [
    "/cms/homepage/featured-tournaments",
    "/cms/homepage/featured-venues",
    "/cms/homepage/explore",
    "/cms/static-pages/help-&-faqs",
    "/cms/homepage/featured-week",
    "/cms/blogs/blog-posts",
    "/cms/blogs/blog-posts/new",
  ];
  const shouldHideTitleBar =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname.match(/^\/cms\/blogs\/blog-posts\/[\w-]+$/);

  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex flex-1 bg-[#F5F7FA]">
        <div className="w-[300px] h-auto bg-[#FFFFFF]">
          <NavBar />
        </div>
        <div className="flex-1 p-[50px] overflow-auto">
          {/* Conditionally hide the title bar */}
          {!shouldHideTitleBar && (
            <div className="flex gap-2.5 items-center mb-4">
              {currentTitle !== "Venues" && (
                <button onClick={() => navigate(-1)}>
                  <ArrowLeftIcon width="24px" height="24px" color="#343C6A" />
                </button>
              )}
              <p className="text-[#343C6A] font-semibold text-[22px]">
                {currentTitle}
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
