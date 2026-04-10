"use client";
import BoardCanvas from "@/components/canvas/board/BoardCanvas";
import { NavigateType, useDashboard } from "@/lib/store/use-dashboard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BacklogCanvas from "@/components/canvas/backlog";
import PlanningCanvas from "@/components/canvas/planning";
import TimelineCanvas from "@/components/canvas/timeline";

export default function DashBoardPage() {
  const { projectId }: { workspaceId: string; projectId: string } = useParams();
  const navigateActive = useDashboard((state) => state.activeNavigate);
  const t = useTranslations("dashboard");

  if (navigateActive.value === NavigateType.BOARD) {
    return <BoardCanvas projectId={projectId} />;
  } else if (navigateActive.value === NavigateType.BACKLOG) {
    return <BacklogCanvas projectId={projectId} />;
  } else if (navigateActive.value === NavigateType.PLANNING) {
    return <PlanningCanvas projectId={projectId} />;
  } else if (navigateActive.value === NavigateType.TIMELINE) {
    return <TimelineCanvas projectId={projectId} />;
  }
  return <div>{t("otherView")}</div>;
}
