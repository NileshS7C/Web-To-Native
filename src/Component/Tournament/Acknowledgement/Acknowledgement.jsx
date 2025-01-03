import Button from "../../Common/Button";

export const AcknowledgementText = () => {
  return (
    <div className="flex flex-col gap-[50px] pb-[50px]">
      <div className="flex items-start gap-[16px]">
        <input
          type="radio"
          name="Acknowledgement"
          id="Acknow"
          value="Acknowledgement"
          className="appearance-none w-4 h-4 border-[1px] rounded-[4px] border-[#D0D5DD] cursor-pointer outline-none align-top"
        />
        <label
          htmlFor="Acknow"
          className="text-left text-base font-normal text-customColor leading-[19.36px]"
        >
          I hereby acknowledge that all the information I have provided in this
          Pickleball Tournament registration form is accurate and complete to
          the best of my knowledge, and I agree to adhere to all terms and
          conditions.
        </label>
      </div>
      <Button className="text-[18px] font-[500]  text-[#FFFFFF] leading-[21.78px] w-[190px] h-[50px] rounded-[10px] bg-[#1570EF] ml-auto">
        Save
      </Button>
    </div>
  );
};
