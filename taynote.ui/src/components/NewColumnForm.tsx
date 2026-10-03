'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/base/Button';
import Input from '@/components/base/Input';
import { useAppDispatch } from '@/lib/hooks';
import { ColumnFormData, ColumnFormSchema } from '@/schemas/ColumnSchema';
import { addColumnAsync } from '@/services/columnService';

interface NewColumnFormProps {
  boardId: string;
}

const NewColumnForm = ({ boardId }: NewColumnFormProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ColumnFormData>({ resolver: zodResolver(ColumnFormSchema) });

  const onSubmit = async (data: ColumnFormData) => {
    await dispatch(addColumnAsync({ ...data, boardId }));
    reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        colorVariant="white"
        className="h-10 w-[82vw] max-w-80 shrink-0 justify-start rounded-xl border border-dashed mt-0.5 border-white/15 bg-transparent px-4 text-base-300 hover:border-white/30 hover:bg-white/5 hover:text-base-100 sm:w-72"
        onClick={() => setIsEditing(true)}
      >
        <Plus /> New Column
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-[82vw] max-w-80 shrink-0 flex-col gap-y-2 rounded-xl border mt-0.5 bg-base-800 p-3 sm:w-72"
    >
      <Input<ColumnFormData>
        errors={errors}
        label="Name"
        name="name"
        register={register}
        required
        placeholder="Column Name"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-x-2">
        <Button colorVariant="default" type="submit">
          Add
        </Button>
        <Button colorVariant="base" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export { NewColumnForm };
