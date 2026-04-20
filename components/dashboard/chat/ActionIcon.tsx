import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ActionIconProps = {
  label: string;
  children: ReactNode;
};

export function ActionIcon({ label, children }: ActionIconProps) {
  return (
    <Button type="button" variant="ghost" size="icon-sm" aria-label={label}>
      {children}
    </Button>
  );
}
