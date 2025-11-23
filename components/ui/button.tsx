"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "border border-slate-700 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30",
        outline:
          "border border-slate-700 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-600 text-slate-100 backdrop-blur-sm",
        ghost:
          "border-transparent bg-transparent hover:bg-slate-800/50 text-slate-100",
        destructive:
          "border-red-700/50 bg-red-900/40 hover:bg-red-900/60 hover:border-red-600 text-red-50 shadow-lg shadow-red-500/10"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, variant, size, asChild = false, ...rest } = props;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
