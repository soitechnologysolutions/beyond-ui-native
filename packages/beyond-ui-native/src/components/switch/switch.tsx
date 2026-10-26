import * as React from "react";
import * as SwitchPrimitive from "@rn-primitives/switch";
import { cn } from "../../utilities/cn";

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "onCheckedChange"> {
  className?: string;
  thumbClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(function Switch({ className, thumbClassName, onCheckedChange, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      onCheckedChange={onCheckedChange ?? (() => {})}
      className={cn(
        "h-7 w-12 shrink-0 flex-row items-center rounded-full p-0.5 transition-colors",
        "bg-neutral-300 dark:bg-neutral-700 web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-primary-500",
        props.checked ? "bg-primary-600 dark:bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700",
        props.disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "h-6 w-6 rounded-full bg-white shadow-md transition-transform",
          props.checked ? "translate-x-5" : "translate-x-0",
          thumbClassName
        )}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";
