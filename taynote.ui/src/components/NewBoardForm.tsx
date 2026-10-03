'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { LoadingSpinner } from '@/components/base/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { BoardFormData, BoardFormSchema } from '@/schemas/BoardSchema';
import { addBoardAsync } from '@/services/boardService';
import { selectBoardIsCreating } from '@/slices/boardSlice';

const NewBoardForm = () => {
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectBoardIsCreating);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BoardFormData>({ resolver: zodResolver(BoardFormSchema) });

  const onSubmit = async (data: BoardFormData) => {
    await dispatch(addBoardAsync(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-x-2">
      <Input<BoardFormData>
        errors={errors}
        label="New board"
        name="name"
        register={register}
        required
        placeholder="Board name"
        className="text-base-100"
        disabled={isCreating}
      />
      <Button
        colorVariant="default"
        type="submit"
        className="mt-7 shrink-0 px-3 sm:px-4"
        title="New board"
        disabled={isCreating}
      >
        {isCreating ? <LoadingSpinner className="size-4.5" /> : <Plus size={18} />}
        <span className="hidden sm:inline">New Board</span>
      </Button>
    </form>
  );
};

export { NewBoardForm };
