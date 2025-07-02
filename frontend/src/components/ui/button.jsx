import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-sm",
    lg: "h-12 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default;
    const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default;
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };