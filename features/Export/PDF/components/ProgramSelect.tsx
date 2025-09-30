import {
  SelectField,
  type SelectOption,
} from "@/components/ui/forms/SelectField";
import type { Program } from "@/entities/program/zod";
import * as React from "react";

type Props = {
  programs: Program[];
  selectedId?: string;
  onSelect: (id: string) => void;
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
};

export function ProgramSelect({
  programs,
  selectedId,
  onSelect,
  label = "",
  placeholder = "Select a program…",
  helper,
  error,
  required,
}: Props) {
  const options: SelectOption<string>[] = React.useMemo(
    () =>
      programs.map((p) => ({
        label: p.title,
        value: String(p.id),
      })),
    [programs]
  );

  const value = selectedId ? String(selectedId) : undefined;

  return (
    <SelectField<string>
      label={label}
      helper={helper}
      error={error}
      required={required}
      options={options}
      value={value}
      onChange={(v) => onSelect(v)}
      placeholder={options.length ? placeholder : "No programs"}
      searchable={true}
    />
  );
}
