import { create } from "zustand"
import { Project } from "../services/project"

type DashboardState = {
    isOpenLeftSidebar: boolean,
    projectIdSelected: string | null,
    projects: Project[]
}

const initialState: DashboardState = {
    isOpenLeftSidebar: true,
    projectIdSelected: null,
    projects: [],
}

type DashboardActions = {
    toggleLeftSidebar: () => void,
    setProjectIdSelected: (projectId: string | null) => void,
    setProjects: (projects: Project[]) => void,
    updateProject: (project: Project) => void,
    reset: () => void
}

type DashboardStore = DashboardState & DashboardActions

export const useDashboardStore = create<DashboardStore>((set, get) => ({
    ...initialState,
    toggleLeftSidebar: () => set((state) => ({ isOpenLeftSidebar: !state.isOpenLeftSidebar })),
    setProjectIdSelected: (projectId) => set({ projectIdSelected: projectId }),
    setProjects: (projects: Project[]) => set({ projects }),
    updateProject: (project: Project) => set((state) => ({
        projects: state.projects.map((p) => p.id === project.id ? project : p)
    })),
    reset: () => set(initialState)
}))
