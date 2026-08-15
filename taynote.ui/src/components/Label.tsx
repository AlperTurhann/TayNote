'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Tags, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VerificationRequiredButton } from '@/components/VerificationRequiredButton';
import { DEFAULT_LABEL_COLOR } from '@/constants/labelConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Label as LabelModel, LabelWithStatus } from '@/models/Label';
import { LabelFormData, LabelFormSchema } from '@/schemas/LabelSchema';
import {
  addLabelAsync,
  deleteLabelAsync,
  getBoardLabelsAsync,
  getGlobalLabelsAsync
} from '@/services/labelService';
import { applyGlobalFiltersAsync } from '@/services/taskService';
import { selectBoardLabels, selectGlobalLabels, selectIsAddingLabel } from '@/slices/labelSlice';
import { selectGlobalLabelIds } from '@/slices/taskSlice';
import { parseGlobalLabelIds, withGlobalLabelIds } from '@/utils/boardSearchParams';

interface LabelChipProps {
  label: LabelWithStatus;
}

interface NewLabelFormProps {
  boardId?: string;
}

interface LabelBadgeProps {
  label: LabelModel;
  className?: string;
}

interface LabelToggleListProps {
  labels: LabelWithStatus[];
  selectedLabelIds: string[];
  onToggle: (labelId: string) => void;
  emptyMessage?: string;
}

interface LabelFilterBarProps {
  boardId: string;
}

const LabelBadge = ({ label, className }: LabelBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-x-1.5 rounded-full bg-base-700 py-0.5 pr-2 pl-1.5 text-xs',
      className
    )}
  >
    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
    {label.name}
  </span>
);

const LabelToggleList = ({
  labels,
  selectedLabelIds,
  onToggle,
  emptyMessage = 'No labels available.'
}: LabelToggleListProps) => {
  if (labels.length === 0) {
    return <p className="text-sm text-base-400">{emptyMessage}</p>;
  }
  return (
    <ScrollArea className="w-[calc(100%+8px)] -ml-2" viewportClassName="max-h-48 pl-2">
      <div className="flex flex-wrap gap-2 pr-2">
        {labels.map((label) => {
          const isSelected = selectedLabelIds.includes(label.id);
          return (
            <button
              key={label.id}
              type="button"
              onClick={() => onToggle(label.id)}
              className={cn(
                'flex items-center gap-x-2 rounded-full py-1 pr-3 pl-2 text-sm transition-colors',
                isSelected
                  ? 'bg-base-600 text-base-100'
                  : 'bg-base-700/50 text-base-400 hover:bg-base-700 hover:text-base-200'
              )}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
              {isSelected && <Check size={12} />}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

const LabelChip = ({ label }: LabelChipProps) => {
  const dispatch = useAppDispatch();

  const onDelete = async () => {
    await dispatch(deleteLabelAsync({ labelId: label.id, boardId: label.boardId }));
  };

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-full bg-base-700 py-1 pr-1 pl-3',
        label.isDeleting && 'opacity-50'
      )}
    >
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
      <p className="truncate text-sm">{label.name}</p>
      <VerificationRequiredButton
        button={
          <Button
            colorVariant="ghost"
            className="shrink-0 rounded-full p-1"
            disabled={label.isDeleting}
            title="Delete label"
          >
            <X size={12} />
          </Button>
        }
        description="This action cannot be undone. This will permanently delete your label."
        handleAccept={onDelete}
      />
    </div>
  );
};

const NewLabelForm = ({ boardId }: NewLabelFormProps) => {
  const dispatch = useAppDispatch();
  const isAdding = useAppSelector(selectIsAddingLabel);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm<LabelFormData>({
    resolver: zodResolver(LabelFormSchema),
    defaultValues: { name: '', color: DEFAULT_LABEL_COLOR }
  });

  const onSubmit = async (data: LabelFormData) => {
    await dispatch(addLabelAsync({ ...data, boardId }));
    reset({ name: '', color: DEFAULT_LABEL_COLOR });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-1">
      <Input<LabelFormData>
        errors={errors}
        label="Name"
        name="name"
        register={register}
        required
        placeholder="Label Name"
        className="w-full text-base-100"
        disabled={isAdding}
      />
      <Input<LabelFormData>
        errors={errors}
        name="color"
        register={register}
        control={control}
        setValue={setValue}
        fieldType="color"
        required
        disabled={isAdding}
        className="text-base-100"
      />
      <Button
        colorVariant="green"
        type="submit"
        className="shrink-0 rounded self-end px-4 py-1.5"
        disabled={isAdding}
      >
        {isAdding ? <LoadingSpinner /> : <Plus />} New Label
      </Button>
    </form>
  );
};

const LabelFilterBar = ({ boardId }: LabelFilterBarProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlLabelIds = parseGlobalLabelIds(searchParams);

  const globalLabels = useAppSelector(selectGlobalLabels);
  const boardLabels = useAppSelector(selectBoardLabels);
  const selectedLabelIds = useAppSelector(selectGlobalLabelIds);
  const effectiveLabelIds = selectedLabelIds.length > 0 ? selectedLabelIds : urlLabelIds;
  const availableLabels = [...globalLabels, ...boardLabels];

  useEffect(() => {
    dispatch(getGlobalLabelsAsync());
    dispatch(getBoardLabelsAsync(boardId));
  }, [dispatch, boardId]);

  const onToggle = (labelId: string) => {
    const next = effectiveLabelIds.includes(labelId)
      ? effectiveLabelIds.filter((id) => id !== labelId)
      : [...effectiveLabelIds, labelId];
    dispatch(applyGlobalFiltersAsync({ labelIds: next }));
    const updated = withGlobalLabelIds(searchParams, next);
    router.replace(`${pathname}?${updated.toString()}`, { scroll: false });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button colorVariant="secondary" className="h-full rounded border gap-x-2">
          <Tags size={18} />
          Labels
          {effectiveLabelIds.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-xs">
              {effectiveLabelIds.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 border-base-600 bg-base-800 text-base-100">
        <LabelToggleList
          labels={availableLabels}
          selectedLabelIds={effectiveLabelIds}
          onToggle={onToggle}
          emptyMessage="No labels yet. Create one from the labels panel."
        />
      </PopoverContent>
    </Popover>
  );
};

export { LabelChip, NewLabelForm, LabelBadge, LabelToggleList, LabelFilterBar };
