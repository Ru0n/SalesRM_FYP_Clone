import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ className, ...props }) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
};

const PaginationContent = ({ className, ...props }) => {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
};

const PaginationItem = ({ className, ...props }) => {
  return (
    <li className={cn("", className)} {...props} />
  );
};

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "default" : "outline"}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
};

const PaginationPrevious = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <FaChevronLeft className="h-3 w-3" />
      <span>Previous</span>
    </PaginationLink>
  );
};

const PaginationNext = ({
  className,
  ...props
}) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <FaChevronRight className="h-3 w-3" />
    </PaginationLink>
  );
};

const PaginationEllipsis = ({
  className,
  ...props
}) => {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <span className="text-sm">...</span>
    </span>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
