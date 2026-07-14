import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { TableOpertions } from '@/models/TableOperations';
import { ChangeTaskStatus, CreateTask, Task } from '@/models/Task';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

const getTasksAsync = createAsyncThunk(
  'tasks/getTasksAsync',
  async (data: TableOpertions): Promise<TryCatchResult<Task[]>> => {
    return await tryCatch<Task[]>(
      axios
        .post<Task[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/search`, data)
        .then((res) => res.data),
      []
    );
  }
);

const addTaskAsync = createAsyncThunk(
  'tasks/addTasksAsync',
  async (data: CreateTask): Promise<TryCatchResult<Task>> => {
    return await tryCatch<Task>(
      axios.post<Task>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`, data).then((res) => res.data)
    );
  }
);

const changeTaskStatusAsync = createAsyncThunk(
  'tasks/changeTaskStatusAsync',
  async ({ id, status }: ChangeTaskStatus): Promise<TryCatchResult<ChangeTaskStatus>> => {
    return await tryCatch<ChangeTaskStatus>(
      axios
        .patch<ChangeTaskStatus>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}`, {
          status
        })
        .then((res) => res.data)
    );
  }
);

const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTaskAsync',
  async (taskId: string): Promise<TryCatchResult<string>> => {
    return await tryCatch<string>(
      axios
        .delete<string>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}`)
        .then((res) => res.data)
    );
  }
);

export { getTasksAsync, addTaskAsync, changeTaskStatusAsync, deleteTaskAsync };
