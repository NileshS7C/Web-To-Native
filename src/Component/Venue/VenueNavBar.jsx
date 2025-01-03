import Tabs from "../Common/Tabs";
import { venueTabs as initialVenueTabs } from "../../Constant/venue";
import VenueDescription from "./VenueDetails";
import { useState } from "react";
const VenueNavBar = () => {
  const [venueTabs, setVenueTabs] = useState(initialVenueTabs);
  const handleTabChange = (value) => {
    const updatedTabs = venueTabs.map((tab) => ({
      ...tab,
      current: tab.name === value,
    }));
    setVenueTabs(updatedTabs);
  };
  return (
    <div className="flex flex-col gap-[10px]">
      <Tabs options={initialVenueTabs} onChange={handleTabChange} />
      {/* <VenueDescription /> */}
    </div>
  );
};

export default VenueNavBar;
