'use client'

import { Button } from "@/components/ui/button"
import { useDashboard } from "@/lib/store/use-dashboard"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import React from "react"

export default function DashboardContentLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy state từ store
    const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft)
    const toggleSidebarLeft = useDashboard((state) => state.toggleSidebarLeft)

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
                <div className="font-medium">Dashboard</div>
                
                <div className="ml-auto">
                    {/* ... actions */}
                </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}