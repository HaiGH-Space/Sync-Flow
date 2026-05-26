import { Clock, LayoutGrid, List, LucideIcon, Target } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum NavigateType {
  BOARD = "Board",
  BACKLOG = "Backlog",
  PLANNING = "Planning",
  TIMELINE = "Timeline",
}

type NavigateItem = {
  value: NavigateType;
  icon: LucideIcon;
};

export const navigateItems: NavigateItem[] = [
  { value: NavigateType.BOARD, icon: LayoutGrid },
  { value: NavigateType.BACKLOG, icon: List },
  { value: NavigateType.PLANNING, icon: Target },
  { value: NavigateType.TIMELINE, icon: Clock },
];

type DashboardState = {
  isOpenSidebarLeft: boolean;
  isOpenSidebarRight: boolean;
  activeNavigate: NavigateItem;
  selectedSprintIdByProject: Record<string, string>;
  selectedChannelIdByProject: Record<string, string>;
  lastActiveChannelByProject: Record<string, string>;
};

type DashboardAction = {
  toggleSidebarLeft: () => void;
  toggleSidebarRight: () => void;
  setOpenSidebarRight: (open: boolean) => void;
  setActiveNavigate: (navigateType: NavigateType) => void;
  setSelectedSprintId: (projectId: string, sprintId: string) => void;
  setSelectedChannelId: (projectId: string, channelId: string) => void;
  setLastActiveChannel: (projectId: string, channelId: string) => void;
  reset: () => void;
};

const initialState: DashboardState = {
  isOpenSidebarLeft: true,
  isOpenSidebarRight: false,
  activeNavigate: navigateItems[0],
  selectedSprintIdByProject: {},
  selectedChannelIdByProject: {},
  lastActiveChannelByProject: {},
};

type DashboardStore = DashboardState & DashboardAction;

export const useDashboard = create<DashboardStore>()(
  persist(
    (set) => ({
      ...initialState,
      toggleSidebarLeft: () =>
        set((state) => ({ isOpenSidebarLeft: !state.isOpenSidebarLeft })),
      toggleSidebarRight: () =>
        set((state) => ({ isOpenSidebarRight: !state.isOpenSidebarRight })),
      setOpenSidebarRight: (open: boolean) => set({ isOpenSidebarRight: open }),
      setActiveNavigate: (navigateType: NavigateType) =>
        set({
          activeNavigate: navigateItems.find((n) => n.value === navigateType)!,
        }),
      setSelectedSprintId: (projectId: string, sprintId: string) =>
        set((state) => ({
          selectedSprintIdByProject: {
            ...state.selectedSprintIdByProject,
            [projectId]: sprintId,
          },
        })),
      setSelectedChannelId: (projectId: string, channelId: string) =>
        set((state) => ({
          selectedChannelIdByProject: {
            ...state.selectedChannelIdByProject,
            [projectId]: channelId,
          },
        })),
      setLastActiveChannel: (projectId: string, channelId: string) =>
        set((state) => ({
          lastActiveChannelByProject: {
            ...state.lastActiveChannelByProject,
            [projectId]: channelId,
          },
        })),
      reset: () => set(initialState),
    }),
    {
      name: "dashboard-storage",
      skipHydration: true,
    },
  ),
);
