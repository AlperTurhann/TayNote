'use client';
import React, { useEffect } from 'react';

import { DEFAULT_TABLE_OPERATIONS } from '@/constants/generalConstants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addTaskAsync, getTasksAsync } from '@/services/task/services';
import { selectTasks } from '@/slices/taskSlice';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    dispatch(getTasksAsync(DEFAULT_TABLE_OPERATIONS));
  }, [dispatch]);

  return (
    <div>
      <button
        onClick={() =>
          dispatch(
            addTaskAsync({
              title: 'New Task',
              color: '#ffffff'
            })
          )
        }
      >
        Add
      </button>

      {tasks.map((t) => (
        <div key={t.id}>{t.title}</div>
      ))}
    </div>
  );
};

export default TaskList;
