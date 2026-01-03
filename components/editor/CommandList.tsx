"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList as CommandBody,
} from "@/components/ui/command";

export interface CommandListProps {
  items: any[];
  command: (item: any) => void;
  editor: any;
  range: any;
}

const CommandList = forwardRef((props: CommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      if (item.command) {
        try {
          item.command({ editor: props.editor, range: props.range });
        } catch (e) {
          console.error("Error executing command:", e);
        }
      } else {
        // Fallback if command is missing, though here we expect it.
        console.warn("Item has no command function");
        props.command(item); // Try default just in case
      }
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <Command className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-border bg-popover shadow-md transition-all">
      <CommandBody>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Commands">
          {props.items.map((item: any, index: number) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={index}
                className={`flex items-center gap-2 px-2 py-1.5 ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onSelect={() => selectItem(index)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandBody>
    </Command>
  );
});

CommandList.displayName = "CommandList";

export default CommandList;
