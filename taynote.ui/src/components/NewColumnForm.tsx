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
      <Button
        className="h-fit rounded border-2 border-dashed -mt-0.5"
        onClick={() => setIsEditing(true)}
      >
        <Plus /> New Column
      </Button>
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
      <div className="grid grid-cols-2 gap-x-2">
        <Button colorVariant="green" type="submit" className="rounded">
          Add
        </Button>
        <Button colorVariant="base" className="rounded" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export { NewColumnForm };
