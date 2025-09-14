import { useField } from "formik";
import React from "react";
import { MultiSelectField, MultiSelectFieldProps } from "./MultiSelectField";
import { PillSwitch, PillSwitchProps } from "./PillSwitch";
import { SelectField, SelectFieldProps } from "./SelectField";
import { SliderField, SliderFieldProps } from "./SliderField";

import { TextField, TextFieldProps } from "./TextField";
import { Toggle, ToggleProps } from "./Toggle";

import { NumberInput, NumberInputProps } from "./NumberInput";
import { NumberStepper, NumberStepperProps } from "./NumberStepper";
import { RepsSetsField, RepsSetsFieldProps } from "./Reps";
import { TempoInputs, TempoInputsProps } from "./Tempo";

import { TagPicker, TagPickerProps } from "./TagPicker";

export const FTextField: React.FC<
  Omit<TextFieldProps, "value" | "onChangeText" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<string>(name);
  return (
    <TextField
      {...p}
      value={field.value}
      onChangeText={helpers.setValue}
      error={meta.touched ? meta.error : undefined}
    />
  );
};

export const FToggle: React.FC<
  Omit<ToggleProps, "value" | "onValueChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<boolean>(name);
  return (
    <Toggle
      {...p}
      value={!!field.value}
      onValueChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
};

export function FPillSwitch<T extends string | number>(
  props: Omit<PillSwitchProps<T>, "value" | "onChange" | "error"> & {
    name: string;
  }
) {
  const [field, meta, helpers] = useField<T>(props.name);
  return (
    <PillSwitch
      {...(props as any)}
      value={field.value}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
}

export const FSliderField: React.FC<
  Omit<SliderFieldProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<number>(name);
  return (
    <SliderField
      {...p}
      value={Number(field.value ?? 0)}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
};

export function FSelectField<T extends string | number>(
  props: Omit<SelectFieldProps<T>, "value" | "onChange" | "error"> & {
    name: string;
  }
) {
  const [field, meta, helpers] = useField<T>(props.name);
  return (
    <SelectField<T>
      {...props}
      value={field.value}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
}

export const FNumberStepper: React.FC<
  Omit<NumberStepperProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<number>(name);
  return (
    <NumberStepper
      {...p}
      value={Number(field.value ?? 0)}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
};

export const FTagPicker: React.FC<
  Omit<TagPickerProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<string[]>(name);
  return (
    <TagPicker
      {...p}
      value={field.value || []}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as any) : undefined}
    />
  );
};

export const FTempoInputs: React.FC<
  Omit<TempoInputsProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] =
    useField<[string, string, string, string]>(name);
  return (
    <TempoInputs
      {...p}
      value={
        (field.value ?? ["", "", "", ""]) as [string, string, string, string]
      }
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as string | undefined) : undefined}
    />
  );
};

/** RepsSetsField — array of numbers per set */
export const FRepsSetsField: React.FC<
  Omit<RepsSetsFieldProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<number[]>(name);
  return (
    <RepsSetsField
      {...p}
      value={Array.isArray(field.value) ? field.value : []}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as string | undefined) : undefined}
    />
  );
};

/** MultiSelectField — generic T[] with checkmarks */
export function FMultiSelectField<T extends string | number>(
  props: Omit<MultiSelectFieldProps<T>, "value" | "onChange" | "error"> & {
    name: string;
  }
) {
  const [field, meta, helpers] = useField<T[]>(props.name);
  return (
    <MultiSelectField<T>
      {...(props as any)}
      value={Array.isArray(field.value) ? field.value : []}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as string | undefined) : undefined}
    />
  );
}

/** NumberInput — numeric with type + stepper */
export const FNumberInput: React.FC<
  Omit<NumberInputProps, "value" | "onChange" | "error"> & { name: string }
> = ({ name, ...p }) => {
  const [field, meta, helpers] = useField<number>(name);
  return (
    <NumberInput
      {...p}
      value={Number.isFinite(field.value as any) ? (field.value as number) : 0}
      onChange={helpers.setValue}
      error={meta.touched ? (meta.error as string | undefined) : undefined}
    />
  );
};
