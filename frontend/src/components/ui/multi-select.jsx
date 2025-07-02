import * as React from "react";
import { FaCheck, FaChevronDown, FaX } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const MultiSelect = React.forwardRef(
  (
    {
      options,
      selected = [],
      onChange,
      placeholder = "Select items...",
      className,
      badgeClassName,
      disabled,
      emptyMessage = "No items found.",
      maxItems,
      onMaxItemsReached,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleUnselect = (item) => {
      onChange(selected.filter((i) => i.value !== item.value));
    };

    const handleSelect = (item) => {
      if (selected.some((i) => i.value === item.value)) {
        onChange(selected.filter((i) => i.value !== item.value));
      } else {
        if (maxItems && selected.length >= maxItems) {
          onMaxItemsReached?.();
          return;
        }
        onChange([...selected, item]);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Backspace" && !searchQuery && selected.length > 0) {
        handleUnselect(selected[selected.length - 1]);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "min-h-10 w-full justify-between px-3 py-2 text-left font-normal",
              !selected.length && "text-gray-500",
              className
            )}
            disabled={disabled}
            {...props}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className={cn(
                      "mr-1 mb-1 px-1 py-0 text-xs font-normal",
                      badgeClassName
                    )}
                  >
                    {item.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                      disabled={disabled}
                    >
                      <FaX className="h-3 w-3" />
                      <span className="sr-only">Remove {item.label}</span>
                    </Button>
                  </Badge>
                ))
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <FaChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command className="w-full">
            <CommandInput
              placeholder="Search..."
              className="h-9"
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => {
                  const isSelected = selected.some((i) => i.value === item.value);
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center justify-between px-2 py-1.5"
                    >
                      <span>{item.label}</span>
                      {isSelected && <FaCheck className="h-4 w-4 text-green-600" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };