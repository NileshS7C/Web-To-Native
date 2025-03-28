import { Input } from "../../Common/FileUploadInput";
import { Page } from "../../Common/PageTitle";

export const TopSection = () => {
  return (
    <div className="w-[50%]">
      <Page title={"Top Section"} />
      <div className="">
        <div className="flex flex-col gap-2 items-start ">
          <label id="heading">Heading</label>
          <Input id="heading" type={"text"} />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label id="subHeading">Sub Heading</label>
          <Input id="subHeading" type={"text"} />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label id="image">Image</label>
          <Input id="image" type={"file"} />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <label id="link">Explore Now Link</label>
          <Input id="link" type={"text"} />
        </div>
      </div>
    </div>
  );
};
