'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/Input';
import { useAppDispatch } from '@/lib/hooks';
import { ColumnFormData, ColumnFormSchema } from '@/schemas/ColumnSchema';
import { addColumnAsync } from '@/services/columnService';

const NewColumnForm = () => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ColumnFormData>({ resolver: zodResolver(ColumnFormSchema) });

  const onSubmit = async (data: ColumnFormData) => {
    await dispatch(addColumnAsync(data));
    reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="h-fit inline-flex whitespace-nowrap font-bold rounded border-2 border-dashed -mt-0.5 p-2 gap-x-1 bg-indigo-950 text-base-100"
      >
        <Plus /> New Column
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-64 h-fit shrink-0 flex flex-col rounded border-2 border-dashed -mt-0.5 p-2 gap-y-1 bg-indigo-950"
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
      <div className="flex gap-x-2">
        <button type="submit" className="flex-1 rounded bg-indigo-700 p-1 text-base-100">
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex-1 rounded bg-base-700 p-1 text-base-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export { NewColumnForm };
