import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ActionIconProps = {
  label: string;
  children: ReactNode;
  onClick?: () => void;
};

export function ActionIcon({ label, children, onClick }: ActionIconProps) {
  return (
    <Button type="button" variant="ghost" size="icon-sm" aria-label={label} onClick={onClick}>
      {children}
    </Button>
  );
}
