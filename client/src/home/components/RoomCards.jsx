import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BsFillLightningChargeFill } from "react-icons/bs";

const RoomCards = ({ room }) => {
  return (
    <Link>
      <Card
        className="bg-[#C2E03A] h-40 rounded-3xl font-['Inter'] relative transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 
      select-none"
      >
        <CardHeader className=" text-xl font-semibold">
          {" "}
          {room.name}{" "}
        </CardHeader>
        <CardContent className="text-4xl font-medium">
          {room.type === "" ? null : (
            <img
              src={`src/assets/${room.type}.svg`}
              className="absolute object-fit top-0 right-[5%]"
            />
          )}
          <div className="flex">
            <BsFillLightningChargeFill />
            {room.percentage}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RoomCards;
