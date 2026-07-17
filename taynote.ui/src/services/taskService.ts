import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { TableOpertions } from '@/models/TableOperations';
import { ChangeTaskColumn, CreateTask, Task, TaskSearchResult } from '@/models/Task';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

const getTasksAsync = createAsyncThunk(
  'tasks/getTasksAsync',
  async (data: TableOpertions): Promise<TryCatchResult<TaskSearchResult>> => {
    return await tryCatch<TaskSearchResult>(
      axios
        .post<TaskSearchResult>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/search`, data)
        .then((res) => res.data),
      { items: [], hasMore: false }
    );
  }
);

const addTaskAsync = createAsyncThunk(
  'tasks/addTasksAsync',
  async (data: CreateTask): Promise<TryCatchResult<Task>> => {
    return await tryCatch<Task>(
      axios
        .post<Task>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`, data)
        .then((res) => res.data)
    );
  }
);

const changeTaskColumnAsync = createAsyncThunk(
  'tasks/changeTaskColumnAsync',
  async ({ id, columnId }: ChangeTaskColumn): Promise<TryCatchResult<ChangeTaskColumn>> => {
    return await tryCatch<ChangeTaskColumn>(
      axios
        .patch<ChangeTaskColumn>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}`, {
          columnId
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

export { getTasksAsync, addTaskAsync, changeTaskColumnAsync, deleteTaskAsync };
