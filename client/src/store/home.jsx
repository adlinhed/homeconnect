import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useHomeStore = create(
  persist((set, get) => ({
    homes: [],
    currentHome: null,
    isLoading: false,
    setCurrentHome: async (id) => {
      set({ isLoading: true });
      const res = await fetch(`/server/homes/${id}`);
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set({ currentHome: data.data });
      set({ isLoading: false });
    },
    createHome: async (homeData) => {
      set({ isLoading: true });
      try {
        // Step 1: Create the home
        const homeRes = await fetch("/server/homes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            homeName: homeData.homeName,
            username: homeData.username,
          }),
        });
        const homeDataResponse = await homeRes.json();

        if (!homeDataResponse.success) {
          set({ isLoading: true });
          return { success: false, message: homeDataResponse.message };
        }

        const newHome = homeDataResponse.data;

        // Step 2: Create rooms for the home
        if (homeData.rooms && homeData.rooms.length > 0) {
          for (const room of homeData.rooms) {
            const roomRes = await fetch("/server/rooms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: room.name,
                type: room.type,
                home: newHome._id, // Pass the home._id in the request body
              }),
            });
            const roomData = await roomRes.json();

            if (!roomData.success) {
              console.error("Failed to create room:", roomData.message);
              // Handle room creation failure (optional)
            }
          }
        }

        // Step 3: Update the store with the new home
        set({
          currentHome: newHome,
          isLoading: false,
        });

        return {
          success: true,
          message: "Home and rooms created successfully",
          data: newHome,
        };
      } catch (error) {
        console.error("Failed to create home:", error);
        return { success: false, message: "Failed to create home" };
      }
    },
    updateHome: async () => {
      const { currentHome } = get();
      if (!currentHome) return;

      try {
        const res = await fetch(`/server/homes/${currentHome._id}`);
        const data = await res.json();
        if (data.success) {
          set({ currentHome: data.data });
        }
      } catch (error) {
        console.error("Failed to update home data:", error);
      }
    },
    fetchHomeByUserId: async (id) => {
      const res = await fetch(`/server/homes/forUser/${id}`);
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set({ homes: data.data });
      return { success: true, data: data.data };
    },
    addRoom: async (roomData) => {
      const { currentHome } = get();
      if (!currentHome) {
        return { success: false, message: "No home selected" };
      }

      set({ isLoading: true });
      try {
        const payload = {
          name: roomData.name,
          type: roomData.roomType,
          home: currentHome._id,
        };

        console.log(payload); // Log the payload
        // Step 1: Create the room
        const res = await fetch("/server/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log(res);
        const data = await res.json();

        if (!data.success) {
          set({ isLoading: false });
          return { success: false, message: data.message };
        }

        const newRoom = data.data;

        // Step 2: Update the current home in the store
        set((state) => ({
          currentHome: {
            ...state.currentHome,
            rooms: [...state.currentHome.rooms, newRoom],
          },
        }));

        set({ isLoading: false });
        console.log(data);
        return {
          success: true,
          message: "Room added successfully",
          data: newRoom,
        };
      } catch (error) {
        console.error("Failed to add room:", error);
        set({ isLoading: false });
        return { success: false, message: "Failed to add room" };
      }
    },
    addDweller: async (userId) => {
      const res = await fetch(`server/homes/${currentHome._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        homes: state.homes.map((home) =>
          home._id === currentHome._id ? data.data : home
        ),
        currentHome: state.currentHome ? data.data : state.currentHome,
      }));
      return { success: true, message: "Dweller Added" };
    },
  })),
  {
    name: "home-storage", // Unique name for localStorage key
    getStorage: () => localStorage, // Use localStorage as the storage mechanism
  }
);
