import { Project } from "../services/project"

type DashboardState = {
    isOpenLeftSidebar: boolean,
    project: Project
}

type DashboardActions = {
    toggleLeftSidebar: () => void,
}

type DashboardStore = DashboardState & DashboardActions