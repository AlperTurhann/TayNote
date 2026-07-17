import { AlertCircle } from 'lucide-react';
import React from 'react';
import {
  FieldErrors,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'textarea' | 'select' | 'color';

interface Props<T extends Record<string, unknown>> {
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
  watch?: UseFormWatch<T>;
  setValue?: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  autoFocus?: boolean;
  className?: string;
  parentClassName?: string;
  iconError?: boolean;
}

const Input = <T extends Record<string, unknown>>({
  fieldType = 'text',
  required,
  label,
  name,
  options = [],
  onValueChange,
  register,
  watch,
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
            <textarea
              rows={5}
              className={cn('font-medium rounded-lg p-2 bg-base-600', className)}
              {...props}
              {...register(name)}
            />
            {renderError()}
          </>
        );
      case 'color': {
        const hex = (watch?.(name) as string | undefined)?.toUpperCase();
        const hexDigits = hex?.replace(/^#/, '') ?? '';
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
            </label>
            {renderError()}
          </>
        );
      }
      case 'text':
      default:
        return (
          <>
            <input
              className={cn('font-medium rounded-lg p-2 bg-base-600', className)}
              type={fieldType}
              {...register(name)}
              {...props}
            />
            {renderError()}
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
