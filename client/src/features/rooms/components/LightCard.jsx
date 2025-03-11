import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const LightCard = () => {
  return (
    <Card className="flex flex-1 flex-col rounded-3xl">
      <div className="flex justify-between items-center w-full px-6 pt-6">
        <h1 className="text-3xl font-semibold">Lights</h1>
        <Switch />
      </div>
      <div className="flex-1 relative">
        <img src="src/assets/light.svg" className="absolute right-0"></img>
      </div>
      <div className="px-6 pb-6 ">
        <Card className="w-36 rounded-3xl bg-[#C2E03A] flex justify-center items-center py-1">
          <div className="flex justify-evenly">
            <h1 className="text-2xl font-light w-[50%] flex justify-center items-center text-center">
              1/3
            </h1>
            <span className="flex-1 font-normal leading-5">Active Devices</span>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default LightCard;
