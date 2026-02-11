import { create } from "zustand"
import { persist } from 'zustand/middleware'
type DashboardState = {
    isOpenSidebarLeft: boolean
    isOpenSidebarRight: boolean
}

type DashboardAction = {
    toggleSidebarLeft: () => void
    toggleSidebarRight: () => void
    reset: () => void
}

const initialState: DashboardState = {
    isOpenSidebarLeft: true,
    isOpenSidebarRight: false,
}

type DashboardStore = DashboardState & DashboardAction

export const useDashboard = create<DashboardStore>()(
    persist(
        (set) => ({
            ...initialState,
            toggleSidebarLeft: () => set((state) => ({ isOpenSidebarLeft: !state.isOpenSidebarLeft })),
            toggleSidebarRight: () => set((state) => ({ isOpenSidebarRight: !state.isOpenSidebarRight })),
            reset: () => set(initialState)
        }),
        {
            name: 'dashboard-storage',
        }
    )
)