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
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-between">
      <Input<BoardFormData>
        errors={errors}
        label="Name"
        name="name"
        register={register}
        required
        placeholder="Board Name"
        autoFocus
        className="rounded-r-none text-base-100"
        disabled={isCreating}
      />
      <Button
        colorVariant="white"
        type="submit"
        className="shrink-0 rounded-r-lg mt-1"
        disabled={isCreating}
      >
        {isCreating ? <LoadingSpinner /> : <Plus />} New Board
      </Button>
    </form>
  );
};

export { NewBoardForm };
