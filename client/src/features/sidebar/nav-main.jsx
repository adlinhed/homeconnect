"use client";

import { ChevronRight } from "lucide-react";
import { BsDoorClosed, BsDoorOpen } from "react-icons/bs";
import "../../styles/index.css";

import {
  ChevronsUpDown,
  Home,
  Sofa,
  BedDouble,
  CookingPot,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useHomeStore } from "@/store/home";
import { Link } from "react-router-dom";
import { useRoomStore } from "@/store/room";

const buttonClass = "text-xl font-light h-12 transition-all duration-500";

// Map room types to icons
const roomTypeIcons = {
  living_room: Sofa,
  bedroom: BedDouble,
  kitchen: CookingPot,
};

export function NavMain({ items }) {
  const { currentHome, homes, setCurrentHome } = useHomeStore();
  const { ownedHomes, dwelledHomes } = homes;
  const { currentRoom, setCurrentRoom } = useRoomStore();

  return (
    <SidebarGroup className="gap-6">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-16 transition-all duration-500 justify-center"
              >
                <div className="flex flex-1 text-left text-sm leading-tight items-center justify-between group-data-[state=collapsed]:hidden">
                  <span className="truncate font-light text-2xl">
                    {currentHome ? currentHome.name : "Select a Home"}
                  </span>
                  <ChevronsUpDown className="size-4" />
                </div>
                <Home className="group-data-[state=collapsed]:opacity-100 group-data-[state=expanded]:duration-0 opacity-0 size-4 transition-all duration-500 absolute" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={"right"}
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentHome ? currentHome.name : "Select a Home"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Switch Homes
                </DropdownMenuLabel>
                {ownedHomes
                  .filter((home) => home._id !== currentHome?._id)
                  .map((home) => (
                    <DropdownMenuItem
                      key={home._id}
                      className="gap-2 p-2"
                      onClick={() => setCurrentHome(home._id)}
                    >
                      {home.name}
                    </DropdownMenuItem>
                  ))}
                {dwelledHomes
                  .filter((home) => home._id !== currentHome?._id)
                  .map((home) => (
                    <DropdownMenuItem
                      key={home._id}
                      className="gap-2 p-2"
                      onClick={() => setCurrentHome(home._id)}
                    >
                      {home.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu className="gap-8">
        {items.map((item) =>
          item.title.toLowerCase() === "rooms" ? (
            <Collapsible key={item.title} asChild className="group/collapsible">
              <SidebarMenuItem key={item.title}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={buttonClass}
                    key={item.title}
                  >
                    {/* Switch between open and closed door icons */}
                    <span className="transition-transform duration-300 ">
                      <BsDoorOpen className="hidden group-data-[state=open]/collapsible:block size-4" />
                      <BsDoorClosed className="block group-data-[state=open]/collapsible:hidden size-4" />
                    </span>
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-500 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                  <SidebarMenuSub className="overflow-hidden gap-3">
                    {item.items?.map((subItem, index) => {
                      const IconComponent = roomTypeIcons[subItem.type] || Home;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link to={`/${subItem.name}`}>
                            <SidebarMenuSubButton
                              className="navRooms transition-all duration-500 h-9 select-none"
                              style={{ "--delay": `${index * 0.2}s` }}
                              key={subItem.name}
                              onClick={() => {
                                setCurrentRoom(subItem);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent />
                                <span>{subItem.name}</span>
                              </div>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url}>
                <SidebarMenuButton
                  key={item.title}
                  className={buttonClass}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
