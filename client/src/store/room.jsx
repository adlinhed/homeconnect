import { create } from "zustand";
import { useHomeStore } from "./home";
import { persist } from "zustand/middleware";

export const useRoomStore = create(
  persist((set, get) => ({
    currentRoom: null,
    isLoading: true,
    setCurrentRoom: async (room) => {
      set({ currentRoom: room });
    },
    updateRoom: async () => {
      const { currentRoom } = get();
      if (!currentRoom) return;
      try {
        const res = await fetch(`/server/rooms/roomId/${currentRoom._id}`);
        const data = await res.json();
        if (data.success) {
          set({ currentRoom: data.data });
          // Also update home if needed
          const homeStore = useHomeStore.getState();
          if (homeStore.currentHome?._id === data.data.home) {
            await homeStore.updateHome();
          }
        }
      } catch (error) {
        console.error("Failed to update room data:", error);
      }
    },
    addAppliance: async (body) => {
      const { currentRoom, updateRoom } = get();
      if (!currentRoom) return;
      try {
        const res = await fetch(`/server/appliances/${currentRoom._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          await updateRoom();
          // Also update home if needed
          const homeStore = useHomeStore.getState();
          if (homeStore.currentHome?._id === data.data.home) {
            await homeStore.updateHome();
          }
        }
      } catch (error) {
        console.error("Failed to add appliance:", error);
      }
    },
    turnOnAll: async (body) => {
      const { currentRoom, updateRoom } = get();
      if (!currentRoom) return;
      console.log(body);

      try {
        // Get all appliances of the specified type
        const appliancesToUpdate = currentRoom.appliances.filter(
          (appliance) => appliance.applianceType === body.type
        );

        if (appliancesToUpdate.length === 0) return;
        await Promise.all(
          appliancesToUpdate.map(async (appliance) => {
            await fetch(`/server/appliances/turnOn/${appliance._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requester: body.requester }),
            });
          })
        );
        // Refresh the room data after updating
        await updateRoom();
      } catch (error) {
        console.error(`Failed to turn on all ${body.type}s:`, error);
      }
    },
    turnOffAll: async (body) => {
      const { currentRoom, updateRoom } = get();
      if (!currentRoom) return;
      try {
        // Get all appliances of the specified type
        const appliancesToUpdate = currentRoom.appliances.filter(
          (appliance) => appliance.applianceType === body.type
        );

        if (appliancesToUpdate.length === 0) return;
        await Promise.all(
          appliancesToUpdate.map(async (appliance) => {
            await fetch(`/server/appliances/turnOff/${appliance._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ requester: body.requester }),
            });
          })
        );
        // Refresh the room data after updating
        await updateRoom();
      } catch (error) {
        console.error(`Failed to turn on all ${body.type}s:`, error);
      }
    },
    turnOnAppliance: async (body) => {
      try {
        const { updateRoom } = get();
        const appliance = await fetch(`/server/appliances/turnOn/${body.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requester: body.requester }),
        });
        await updateRoom();
      } catch (error) {
        console.error(`Failed to turn on`, error);
      }
    },
    turnOffAppliance: async (body) => {
      try {
        const { updateRoom } = get();
        const appliance = await fetch(`/server/appliances/turnOff/${body.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requester: body.requester }),
        });
        await updateRoom();
      } catch (error) {
        console.error(`Failed to turn off`, error);
      }
    },
    modifyAppliance: async (id, updates) => {
      try {
        const { updateRoom } = get();

        // Send the updates to the server
        const response = await fetch(`/server/appliances/adjust/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Failed to update appliance");
        }

        const data = await response.json();
        console.log("Appliance updated:", data);

        // Refresh the room data after updating
        await updateRoom();
      } catch (error) {
        console.error("Failed to modify appliance:", error);
      }
    },
    renameAppliance: async (id, updates) => {
      try {
        const { updateRoom } = get();

        // Send the updates to the server
        const response = await fetch(`/server/appliances/rename/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Failed to update appliance");
        }

        const data = await response.json();
        console.log("Appliance renamed:", data);

        // Refresh the room data after updating
        await updateRoom();
        return data;
      } catch (error) {
        console.error("Failed to modify appliance:", error);
      }
    },
    getCurrentUsage: async (type) => {
      const { currentRoom } = get();
      if (!currentRoom) return;

      try {
        const res = await fetch(
          `/server/energy/totalTypeCurrentUsage/${currentRoom._id}/${type}`
        );
        const data = await res.json();
        return data.data;
      } catch (error) {
        console.error(`Failed to turn on all ${type}s:`, error);
      }
    },
  })),
  {
    name: "room-storage", // Unique name for localStorage key
    getStorage: () => localStorage, // Use localStorage as the storage mechanism
  }
);
