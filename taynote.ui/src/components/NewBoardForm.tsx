'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { useAppDispatch } from '@/lib/hooks';
import { BoardFormData, BoardFormSchema } from '@/schemas/BoardSchema';
import { addBoardAsync } from '@/services/boardService';

const NewBoardForm = () => {
  const dispatch = useAppDispatch();
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
      />
      <Button colorVariant="white" type="submit" className="shrink-0 rounded-r-lg mt-1">
        <Plus /> New Board
      </Button>
    </form>
  );
};

export { NewBoardForm };
