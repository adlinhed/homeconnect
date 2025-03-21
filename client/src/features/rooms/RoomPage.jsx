import { useHomeStore } from "@/store/home";
import { useRoomStore } from "@/store/room";
import { useEffect, useState } from "react";
import LightCard from "./components/LightCard";
import AirConCard from "./components/AirConCard";
import { Card } from "@/components/ui/card";
import { AddApplianceCard } from "./components/AddApplianceCard";
import FanCard from "./components/FanCard";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import ExpandedView from "./components/ExpandedView";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userAuthStore } from "@/store/userAuth";

const RoomPage = () => {
  const [currentExpanded, setExpanded] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { currentRoom, addAppliance} = useRoomStore();
  const { user } = userAuthStore();
  const { isMobile } = useSidebar();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for Popover
  const [applianceType, setApplianceType] = useState(""); // State for appliance type
  const [applianceName, setApplianceName] = useState(""); // State for appliance name

  // Function to get total and active appliances of a given type
  const getApplianceStats = (type) => {
    const appliances =
      currentRoom?.appliances?.filter(
        (appliance) => appliance.applianceType === type
      ) || [];
    return {
      total: appliances.length,
      active: appliances.filter((appliance) => appliance.status === "on")
        .length,
    };
  };
  // Track the current room ID
  const [currentRoomId, setCurrentRoomId] = useState(currentRoom?._id);

  // Reset expanded view only when the room ID changes (not when the room is updated)
  useEffect(() => {
    if (currentRoom?._id !== currentRoomId) {
      setCurrentRoomId(currentRoom?._id); // Update the tracked room ID
      setExpanded(null); // Reset expanded view
    }
  }, [currentRoom?._id]); // Trigger only when the room ID changes

  const lightStats = getApplianceStats("Light");
  const fansStats = getApplianceStats("Fan");
  const airConStats = getApplianceStats("AirConditioner");

  // Handle form submission
  const handleAddAppliance = () => {
    if (!applianceType || !applianceName) {
      alert("Please fill in all fields.");
      return;
    }

    // Add the new appliance to the room
    addAppliance({
      requester: user.username,
      appliance: {
        applianceType: applianceType,
        name: applianceName,
      }
    });

    // Reset form fields and close the Popover
    setApplianceType("");
    setApplianceName("");
    setIsPopoverOpen(false);
  };

  const applianceGrid = [
    {
      className: "roomLight",
      key: "Light",
      component: (
        <LightCard
          key={"light"}
          hovered={hovered === "light"}
          totalLight={lightStats.total}
          activeLight={lightStats.active}
        />
      ),
    },
    {
      className: "roomAirConditioner",
      key: "AirConditioner",
      component: (
        <AirConCard
          key={"aircon"}
          hovered={hovered === "aircon"}
          totalAirCons={airConStats.total}
          activeAirCons={airConStats.active}
        />
      ),
    },
    {
      className: "roomFan",
      key: "Fan",
      component: (
        <FanCard
          key={"fan"}
          hovered={hovered === "fan"}
          totalFans={fansStats.total}
          activeFans={fansStats.active}
        />
      ),
    },
    {
      className: "roomAddAppliance",
      key: "add",
      component: (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex-1 flex justify-center items-center h-full">
              <AddApplianceCard key={"add"} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="font-semibold text-lg mb-4">Add New Appliance</h3>
            <div className="space-y-4">
              {/* Appliance Type Dropdown */}
              <div>
                <Label htmlFor="applianceType">Appliance Type</Label>
                <Select
                  value={applianceType}
                  onValueChange={(value) => setApplianceType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="AirConditioner">
                      Air Conditioner
                    </SelectItem>
                    <SelectItem value="Fan">Fan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Appliance Name Input */}
              <div>
                <Label htmlFor="applianceName">Appliance Name</Label>
                <Input
                  id="applianceName"
                  value={applianceName}
                  onChange={(e) => setApplianceName(e.target.value)}
                  placeholder="Enter appliance name"
                />
              </div>

              {/* Submit Button */}
              <Button onClick={handleAddAppliance} className="w-full">
                Add Appliance
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
  return (
    <motion.div
      className="xl:p-8 flex-1 flex xl:gap-4 gap-2 p-4 flex-col xl:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      key={currentRoom.name}
    >
      <motion.div
        className="flex-1 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        key={currentExpanded}
      >
        {currentExpanded ? (
          <ExpandedView
            appliance={currentExpanded}
            onClose={() => setExpanded(null)}
          ></ExpandedView>
        ) : (
          <div className="grid auto-cols-[1fr] auto-rows-[1fr] room-template-area gap-4 flex-1 h-full">
            {applianceGrid.map(({ className, key, component }) => (
              <motion.div
                key={className}
                className={`${className} flex rounded-3xl cursor-pointer`}
                layoutId="hoveredCard"
                initial={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                animate={{
                  scale: hovered === key ? 1.03 : 1,
                  opacity: hovered && hovered !== key ? 0.6 : 1,
                  filter:
                    hovered && hovered !== key ? "blur(2px)" : "blur(0px)",
                  boxShadow: "0px 0px 8px rgb(255,255,255)",
                }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                onHoverStart={() => setHovered(key)}
                onHoverEnd={() => setHovered(null)}
                onClick={(e) => {
                  if (key === "add") {
                    setIsPopoverOpen(true); // Open Popover for "Add Appliance"
                    return; // Prevent setting expanded view
                  }
                  if (e.target.closest(".switch-container")) return; // Prevent expansion if clicking switch
                  setHovered(null);
                  setExpanded(key);
                }}
              >
                {component}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="border-2 border-[#184C85] rounded-lg"></div>
      <motion.div
        className="flex justify-center rounded-3xl xl:w-[25%] w-full"
        initial={{ scale: 1, opacity: 0, filter: "blur(0px)", x: 50 }}
        animate={{
          x: 0,
          scale: hovered === "electricity" ? 1.02 : 1,
          opacity: hovered && hovered !== "electricity" ? 1 : 1,
          boxShadow: "0px 0px 8px rgb(255,255,255)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        onHoverStart={() => setHovered("electricity")}
        onHoverEnd={() => setHovered(null)}
      >
        <Card className="w-full rounded-3xl p-8 font-semibold text-2xl flex flex-col relative bg-gradient-to-r from-white from-90% to-[rgb(217,217,217,66)] cursor-pointer">
          <span>Energy Profile</span>
          <span>for</span>
          <span>{`${currentRoom.name}`}</span>
          {/* Animated Arrow */}
          <motion.div
            className="absolute xl:top-[50%] xl:right-3 top-[40%] right-0"
            animate={{ x: hovered === "electricity" ? [0, 15, 0] : 0 }} // Subtle left-right motion
            transition={
              hovered === "electricity"
                ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
                : {}
            }
          >
            <ArrowRight className="size-12" />
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RoomPage;
