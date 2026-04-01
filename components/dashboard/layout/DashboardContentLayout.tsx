'use client'

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { navigateItems, NavigateType, useDashboard } from "@/lib/store/use-dashboard"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import React from "react"
import { useTranslations } from "next-intl"

export default function DashboardContentLayout({ children }: { children: React.ReactNode }) {
    const isOpenSidebarLeft = useDashboard((state) => state.isOpenSidebarLeft)
    const toggleSidebarLeft = useDashboard((state) => state.toggleSidebarLeft)

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
            <header className="text-lg flex items-center h-14 border-b border-border/70 bg-background/90 backdrop-blur">
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
                <div>
                    <HeaderTabList />
                </div>
                <div className="ml-auto">

                </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    )
}

function HeaderTabList() {
    const t = useTranslations('dashboard')
    const activeNavigate = useDashboard((s) => s.activeNavigate)
    const setActiveNavigate = useDashboard((s) => s.setActiveNavigate)
    return (
        <Tabs defaultValue={activeNavigate?.value} onValueChange={(v) => setActiveNavigate(v as NavigateType)}>
            <TabsList className="py-5">
                {Object.values(navigateItems).map((navigate) => (
                    <TabsTrigger className="capitalize gap-x-2 py-4" key={navigate.value} value={navigate.value}>
                        <navigate.icon className="w-4 h-4" />
                        {navigate.value === NavigateType.BOARD
                            ? t('navigation.board')
                            : navigate.value === NavigateType.BACKLOG
                                ? t('navigation.backlog')
                                : navigate.value === NavigateType.PLANNING
                                    ? t('navigation.planning')
                                    : t('navigation.timeline')}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
