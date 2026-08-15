import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Plus, X } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  Control,
  FieldErrors,
  Path,
  PathValue,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  useWatch
} from 'react-hook-form';

import { Button } from '@/components/base/Button';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { SavedColorFormData, SavedColorFormSchema } from '@/schemas/SavedColorSchema';
import {
  addSavedColorAsync,
  deleteSavedColorAsync,
  getSavedColorsAsync
} from '@/services/savedColorService';
import { selectIsAddingSavedColor, selectSavedColors } from '@/slices/savedColorSlice';

type FieldType = 'text' | 'textarea' | 'select' | 'color';

interface CharacterCounterProps<T extends Record<string, unknown>> {
  control?: Control<T>;
  name: Path<T>;
  maxLength: number;
}

interface ColorHexFieldProps<T extends Record<string, unknown>> {
  control?: Control<T>;
  name: Path<T>;
  setValue?: UseFormSetValue<T>;
}

interface CommonProps<T extends Record<string, unknown>> {
  fieldType?: FieldType;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  required?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  label?: string;
  name: Path<T>;
  options?: string[];
  onValueChange?: (value: string) => void;
  register: UseFormRegister<T>;
  setValue?: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  autoFocus?: boolean;
  className?: string;
  parentClassName?: string;
  iconError?: boolean;
}

type Props<T extends Record<string, unknown>> = CommonProps<T> &
  ({ maxLength: number; control: Control<T> } | { maxLength?: undefined; control?: Control<T> });

const CharacterCounter = <T extends Record<string, unknown>>({
  control,
  name,
  maxLength
}: Readonly<CharacterCounterProps<T>>) => {
  const value = (useWatch({ control, name }) as string | undefined) ?? '';
  return (
    <span className="shrink-0 text-xs mt-0.5 text-base-400">
      {value.length} / {maxLength}
    </span>
  );
};

const ColorHexField = <T extends Record<string, unknown>>({
  control,
  name,
  setValue
}: Readonly<ColorHexFieldProps<T>>) => {
  const hex = (useWatch({ control, name }) as string | undefined)?.toUpperCase();
  const hexDigits = hex?.replace(/^#/, '') ?? '';
  return (
    <input
      type="text"
      value={hexDigits}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
        setValue?.(name, `#${digits}` as PathValue<T, Path<T>>, {
          shouldValidate: true,
          shouldDirty: true
        });
      }}
      placeholder="000000"
      className="w-20 bg-transparent font-medium outline-none -ml-2"
    />
  );
};

const SaveColorForm = ({ hex }: Readonly<{ hex: string }>) => {
  const dispatch = useAppDispatch();
  const isAdding = useAppSelector(selectIsAddingSavedColor);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<SavedColorFormData>({
    resolver: zodResolver(SavedColorFormSchema),
    defaultValues: { name: '' }
  });

  const onSubmit = async (data: SavedColorFormData) => {
    await dispatch(addSavedColorAsync({ name: data.name, hex }));
    reset({ name: '' });
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-y-2"
    >
      <div className="flex items-center gap-x-2">
        <span
          className="size-5 shrink-0 rounded-full border border-white/20"
          style={{ backgroundColor: hex }}
        />
        <span className="text-sm font-medium">{hex.toUpperCase()}</span>
      </div>
      <Input<SavedColorFormData>
        errors={errors}
        name="name"
        register={register}
        control={control}
        required
        autoFocus
        placeholder="Color name"
        className="w-full text-base-100"
        disabled={isAdding}
      />
      <Button colorVariant="green" type="submit" disabled={isAdding} className="w-full rounded">
        {isAdding ? <LoadingSpinner /> : <Plus />} Save to Palette
      </Button>
    </form>
  );
};

const SavedColorPalette = <T extends Record<string, unknown>>({
  control,
  name,
  setValue
}: Readonly<ColorHexFieldProps<T>>) => {
  const dispatch = useAppDispatch();
  const savedColors = useAppSelector(selectSavedColors);
  const hex = (useWatch({ control, name }) as string | undefined) ?? '';

  useEffect(() => {
    dispatch(getSavedColorsAsync());
  }, [dispatch]);

  const pickColor = (colorHex: string) => {
    setValue?.(name, colorHex as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  return (
    <div className="flex items-center gap-x-0.5 px-1 pt-2">
      <ScrollArea className="min-w-0 h-9">
        <div className="flex items-center gap-1.5 p-1">
          {savedColors.map((savedColor) => (
            <div key={savedColor.id} className="group size-5 relative shrink-0">
              <button
                type="button"
                title={savedColor.name}
                onClick={() => pickColor(savedColor.hex)}
                disabled={savedColor.isDeleting}
                className={cn(
                  'size-full shrink-0 rounded-full border border-white/20 transition-transform hover:scale-110',
                  savedColor.isDeleting && 'opacity-50'
                )}
                style={{ backgroundColor: savedColor.hex }}
              />
              <button
                type="button"
                title={`Remove ${savedColor.name}`}
                onClick={() => dispatch(deleteSavedColorAsync(savedColor.id))}
                disabled={savedColor.isDeleting}
                className="absolute -top-1.5 -right-1.5 hidden size-3.5 items-center justify-center rounded-full bg-base-800 text-base-100 group-hover:flex"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Save current color to palette"
            className="flex size-5 shrink-0 items-center justify-center rounded-full border border-dashed mb-2 border-base-400 text-base-400 hover:border-base-100 hover:text-base-100"
          >
            <Plus size={12} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 border-base-600 bg-base-800 text-base-100">
          <SaveColorForm hex={hex} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Input = <T extends Record<string, unknown>>({
  fieldType = 'text',
  required,
  label,
  name,
  maxLength,
  options = [],
  onValueChange,
  register,
  control,
  setValue,
  errors,
  className,
  parentClassName,
  iconError,
  ...props
}: Props<T>) => {
  const errorMessage = errors[name]?.message as string | undefined;

  const renderError = () =>
    iconError ? (
      errorMessage && (
        <span
          title={errorMessage}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500"
        >
          <AlertCircle className="size-4" />
        </span>
      )
    ) : (
      <span className="min-h-5 text-sm text-red-500">{errorMessage ?? ''}</span>
    );

  const renderField = () => {
    switch (fieldType) {
      case 'select':
        return (
          <>
            <Select onValueChange={onValueChange}>
              <SelectTrigger className={className}>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-base-600">
                {Array.isArray(options) &&
                  options.map((option) => (
                    <SelectItem
                      {...register(name)}
                      key={option}
                      value={option}
                      className="md:hover:bg-base-500"
                    >
                      <span>{option}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {renderError()}
          </>
        );
      case 'textarea':
        return (
          <>
            <Textarea
              rows={5}
              maxLength={maxLength}
              className={cn(
                'resize-none rounded-lg border-none bg-base-600 placeholder:text-base-400 focus-visible:ring-white focus-visible:ring-2',
                className
              )}
              {...register(name)}
              {...props}
            />
            {iconError ? (
              renderError()
            ) : (
              <div className="flex justify-between gap-x-2">
                {renderError()}
                {maxLength !== undefined && (
                  <CharacterCounter control={control} name={name} maxLength={maxLength} />
                )}
              </div>
            )}
          </>
        );
      case 'color':
        return (
          <>
            <label
              className={cn(
                'inline-flex w-fit cursor-pointer items-center gap-x-2 rounded-lg bg-base-600 p-2',
                className
              )}
            >
              <input
                type="color"
                className="size-6 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0"
                {...register(name)}
                {...props}
              />
              <span className="font-medium">#</span>
              <ColorHexField control={control} name={name} setValue={setValue} />
            </label>
            <SavedColorPalette control={control} name={name} setValue={setValue} />
            {renderError()}
          </>
        );
      case 'text':
      default:
        return (
          <>
            <input
              className={cn('font-medium rounded-lg p-2 bg-base-600', className)}
              type={fieldType}
              maxLength={maxLength}
              {...register(name)}
              {...props}
            />
            <div className="flex justify-between gap-x-2">
              {renderError()}
              {maxLength !== undefined && (
                <CharacterCounter control={control} name={name} maxLength={maxLength} />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={cn('flex flex-col w-full', iconError && 'relative', parentClassName)}
      aria-label={name + ' input'}
    >
      {label && (
        <label className="font-medium" htmlFor={name as string}>
          {label} {required && <span>*</span>}
        </label>
      )}
      {renderField()}
    </div>
  );
};

export default Input;
