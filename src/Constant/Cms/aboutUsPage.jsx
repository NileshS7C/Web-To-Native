import HowItWorksWrapper from "../../Component/CMS/AboutUs/HowItWorks";
import MissionAndVisionWrapper from "../../Component/CMS/AboutUs/MissionAndVision";
import { TopSection } from "../../Component/CMS/AboutUs/TopSection";
import FAQ from "../../Page/CMS/StaticPages/FAQ";
import GreenBannerWrapper from "../../Component/CMS/AboutUs/GreenBanner";
import BottomSection from "../../Component/CMS/AboutUs/BottomSection";
import ImageTextSection from "../../Component/CMS/AboutUs/ImageTextSection";
import PicklebayInNews from "../../Component/CMS/AboutUs/PicklebayInNews";
import PickleBayInIndia from "../../Component/CMS/AboutUs/PickleBayInIndia";
import KeyVerticalSection from "../../Component/CMS/AboutUs/KeyVerticalSection";
import TeamSection from "../../Component/CMS/AboutUs/MeetTheTeamSection";

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
    path: "mission-and-vision",
    element: <MissionAndVisionWrapper />,
  },
  {
    path: "banner-section",
    element: <GreenBannerWrapper />,
  },
  {
    path: "how-it-works",
    element: <HowItWorksWrapper />,
  },
  {
    path: "founder-section",
    element: <FAQ />,
  },
  {
    path: "meet-the-team",
    element: <TeamSection />,
  },
  {
    path: "key-section",
    element: <KeyVerticalSection />,
  },
  {
    path: "picklebay-in-india",
    element:<PickleBayInIndia />,
  },
  {
    path: "picklebay-in-news",
    element: <PicklebayInNews />,
  },
  {
    path: "bottom-section",
    element: <ImageTextSection />,
  },
];
