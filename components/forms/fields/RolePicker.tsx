"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/Form";
import { type FieldValues, type UseFormReturn } from "react-hook-form";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

interface RolePickerProps {
  form: UseFormReturn<FieldValues>;
}

export function RolePicker({ form }: RolePickerProps) {
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Language</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? languages.find(
                        (language) => language.value === field.value
                      )?.label
                    : "Select language"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((language) => (
                    <CommandItem
                      value={language.value}
                      key={language.value}
                      onSelect={(value) => {
                        form.setValue("language", value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          language.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {language.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
