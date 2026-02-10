import { WorkspaceRail } from "@/components/dashboard/layout/WorspaceRail";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row w-full h-screen">
        <WorkspaceRail />
        {children}
    </div>
}