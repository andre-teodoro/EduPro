import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-accent",
        ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        secondary: "bg-primary/10 text-primary hover:bg-primary/15",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        icon: "size-11",
        sm: "min-h-10 px-3 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
interface Props
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  asChild?: boolean;
}
export function Button({
  className,
  variant,
  size,
  asChild,
  type = "button",
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      type={asChild ? undefined : type}
      className={cn(variants({ variant, size }), className)}
      {...props}
    />
  );
}
