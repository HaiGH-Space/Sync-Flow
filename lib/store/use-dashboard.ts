import { Clock, LayoutGrid, List, LucideIcon, Target } from "lucide-react"
import { create } from "zustand"
import { persist } from 'zustand/middleware'

export enum NavigateType {
    BOARD = 'Board',
    BACKLOG = 'Backlog',
    PLANNING = 'Planning',
    TIMELINE = 'Timeline'
}

type NavigateItem = {
    value: NavigateType
    icon: LucideIcon
}

export const navigateItems: NavigateItem[] = [
    { value: NavigateType.BOARD, icon: LayoutGrid },
    { value: NavigateType.BACKLOG, icon: List },
    { value: NavigateType.PLANNING, icon: Target },
    { value: NavigateType.TIMELINE, icon: Clock },
]

type DashboardState = {
    isOpenSidebarLeft: boolean
    isOpenSidebarRight: boolean
    activeNavigate: NavigateItem
    selectedSprintId: string
}

type DashboardAction = {
    toggleSidebarLeft: () => void
    toggleSidebarRight: () => void
    setActiveNavigate: (navigateType: NavigateType) => void
    setSelectedSprintId: (sprintId: string) => void
    reset: () => void
}

const initialState: DashboardState = {
    isOpenSidebarLeft: true,
    isOpenSidebarRight: false,
    activeNavigate: navigateItems[0],
    selectedSprintId: 'all'
}

type DashboardStore = DashboardState & DashboardAction

export const useDashboard = create<DashboardStore>()(
    persist(
        (set) => ({
            ...initialState,
            toggleSidebarLeft: () => set((state) => ({ isOpenSidebarLeft: !state.isOpenSidebarLeft })),
            toggleSidebarRight: () => set((state) => ({ isOpenSidebarRight: !state.isOpenSidebarRight })),
            setActiveNavigate: (navigateType: NavigateType) => set({ activeNavigate: navigateItems.find(n => n.value === navigateType)! }),
            setSelectedSprintId: (sprintId: string) => set({ selectedSprintId: sprintId }),
            reset: () => set(initialState)
        }),
        {
            name: 'dashboard-storage',
        }
    )
)