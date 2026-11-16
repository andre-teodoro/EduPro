<script setup lang="ts">
import { Primitive } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
withDefaults(
  defineProps<{
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
    size?: "default" | "icon" | "sm";
    asChild?: boolean;
    type?: "button" | "submit" | "reset";
    class?: HTMLAttributes["class"];
  }>(),
  { variant: "default", size: "default", type: "button" },
);
const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border bg-background hover:bg-accent",
  ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  secondary: "bg-primary/10 text-primary hover:bg-primary/15",
};
const sizes = {
  default: "min-h-11 px-4 py-2",
  icon: "size-11",
  sm: "min-h-10 px-3 text-xs",
};
</script>
<template>
  <Primitive
    :as="asChild ? undefined : 'button'"
    :as-child="asChild"
    :type="asChild ? undefined : type"
    :class="
      cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:size-4 [&_svg]:shrink-0',
        variants[variant],
        sizes[size],
        $props.class,
      )
    "
    ><slot
  /></Primitive>
</template>
