"use client";

import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { selectRandom } from "@/lib/utils";
import categories from "./data/categories";
import { Idea } from "./types";

export function IdeaForm(props: { onSubmit: (idea: Idea) => void }) {
  const { onSubmit } = props;
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");

  const handleNewIdea = async (topic: string) => {
    if (!topic) {
      topic = selectRandom(categories);
    }
    console.log(topic);
    const response = await fetch(
      `/api/idea?topic=${encodeURIComponent(topic)}`,
    );
    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }
    const data = await response.json();
    onSubmit(data);
  };

  return (
    <form
      className="flex gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(topic);
        handleNewIdea(topic);
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {topic
              ? categories.find((category) => category === topic)
              : "any topic is fine!"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={(currenttopic) => {
                      setTopic(currenttopic === topic ? "" : currenttopic);
                      setOpen(false);
                    }}
                  >
                    {category}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        topic === category ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button type="submit">generate</Button>
    </form>
  );
}
