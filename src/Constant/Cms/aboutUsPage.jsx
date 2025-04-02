import { TopSection } from "../../Component/CMS/AboutUs/TopSection";
import FAQ from "../../Page/CMS/StaticPages/FAQ";
import GreenBannerWrapper from "../../Component/CMS/AboutUs/GreenBanner";

export const aboutUsPageRoutes = [
  "/cms/about-us-page/top-section",
  "/cms/about-us-page/misson-and-vision",
  "/cms/about-us-page/banner-section",
  "/cms/about-us-page/how-it-works",
  "/cms/about-us-page/founder-section",
  "/cms/about-us-page/meet-the-team",
  "/cms/about-us-page/key-section",
  "/cms/about-us-page/picklebay-in-india",
  "/cms/about-us-page/picklebay-in-news",
  "/cms/about-us-page/bottom-section",
];

export const aboutUsNav = [
  {
    path: "top-section",
    element: <TopSection />,
  },
  {
    path: "misson-&-vision",
    element: <FAQ />,
  },
  {
    path: "banner-section",
    element: <GreenBannerWrapper />,
  },
  {
    path: "how-it-works",
    element: <FAQ />,
  },
  {
    path: "founder-section",
    element: <FAQ />,
  },
  {
    path: "meet-the-team",
    element: <FAQ />,
  },
  {
    path: "picklebay-in-india",
    element: <FAQ />,
  },
  {
    path: "bottom-section",
    element: <FAQ />,
  },
];
