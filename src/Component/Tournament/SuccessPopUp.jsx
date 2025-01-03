import { SuccessPopUp } from "../../Assests";

export const TournamentSuccessPopUp = () => {
  return (
    <div className="flex flex-col items-center bg-customColor rounded-[15px] py-[30px] px-[50px] w-[590px] h-[200px]">
      <img
        src={SuccessPopUp}
        alt="SucessIcon"
        className="w-[113px] h-[113px]"
      />
      <p className="font-normal text-base text-customColor leading-[19.36px]">
        Add New Venue Request Submitted Successfully !!
      </p>
    </div>
  );
};
