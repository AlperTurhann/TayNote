'use client';
import { Search } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

const TaskSearchBar = () => {
  const { register, handleSubmit } = useForm();

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="w-fit flex items-center rounded-full border mx-auto py-2 px-4 gap-x-2 bg-base-600"
    >
      <Search size={20} />
      <input {...register('query')} placeholder="Search board" className="focus:outline-none" />
    </form>
  );
};

export default TaskSearchBar;
