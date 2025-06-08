"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Switch as UiSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  loading?: boolean;
  withIcon?: boolean;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, loading, disabled, ...props }, ref) => {
  return (
    <div className="inline-flex items-center gap-2">
      {loading ? <Loader2 className="animate-spin" /> : null}
      <UiSwitch
        className={cn(className)}
        ref={ref}
        {...props}
        disabled={disabled || loading}
      />
    </div>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
