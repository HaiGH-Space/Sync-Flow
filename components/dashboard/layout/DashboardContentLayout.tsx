'use client'

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/hooks/useStore"
import { navigateItems, NavigateType, useDashboard } from "@/lib/store/use-dashboard"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import React from "react"

export default function DashboardContentLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy state từ store
    const isOpenSidebarLeft = useStore(useDashboard, (state) => state.isOpenSidebarLeft)
    const activeNavigate = useStore(useDashboard, (state) => state.activeNavigate)
    const toggleSidebarLeft = useDashboard((state) => state.toggleSidebarLeft)
    const setActiveNavigate = useDashboard((state) => state.setActiveNavigate)

    if (isOpenSidebarLeft === undefined || !activeNavigate) return null
    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
            <header className="text-lg flex items-center h-14 border-b border-border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebarLeft}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {isOpenSidebarLeft ? (
                        <PanelLeftClose />
                    ) : (
                        <PanelLeftOpen />
                    )}
                </Button>

                {/* Breadcrumb or Title of the page */}
                <div>
                    <Tabs defaultValue={activeNavigate.value} onValueChange={(v) => setActiveNavigate(v as NavigateType)}>
                        <TabsList className="py-5">
                            {Object.values(navigateItems).map((navigate) => (
                                <TabsTrigger className="capitalize gap-x-2 py-4" key={navigate.value} value={navigate.value}>
                                    <navigate.icon className="w-4 h-4" />
                                    {navigate.value.toLowerCase()}
                                </TabsTrigger>
                            ))}
                        </TabsList>
        
                    </Tabs>
                </div>
                <div className="ml-auto">

                </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}