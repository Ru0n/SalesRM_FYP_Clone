import * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  variant: {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "text-gray-700 border border-gray-200",
    success: "bg-green-100 text-green-800",
  },
  size: {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },
};

const Badge = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = badgeVariants.variant[variant] || badgeVariants.variant.default;
    const sizeClasses = badgeVariants.size[size] || badgeVariants.size.default;
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };