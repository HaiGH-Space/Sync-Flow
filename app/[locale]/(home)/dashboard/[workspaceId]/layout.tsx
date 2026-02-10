import { NavigationSidebar } from "@/components/dashboard/layout/NavigationSidebar";

export default async function ContentLayout({ children, params }: { children: React.ReactNode, params: Promise<{ workspaceId: string }> }) {
    
    const resolvedParams = await params;
    return (
        <>
            <NavigationSidebar workspaceId={resolvedParams.workspaceId} />
            {children}
        </>
    )

}