import { Dialog } from "@tritonse/tse-constellation";
import React, { useEffect, useState } from "react";
import { getAllTasks, type Task } from "src/api/tasks";
import { TaskItem } from "src/components";
import styles from "src/components/TaskList.module.css";

export type TaskListProps = {
  title: string;
};

export function TaskList({ title }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const result = await getAllTasks();
        if (result.success) {
          setTasks(result.data);
        } else {
          setErrorMessage(result.error || "Failed to load tasks");
        }
      } catch (error) {
        setErrorMessage((error as Error).message || "An unexpected error occurred");
      }
    }

    void fetchTasks();
  }, []);

  return (
    <div className={styles.taskContainer}>
      <span className={styles.title}>{title}</span>
      <div className={styles.taskItems}>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above to get started.</p>
        ) : (
          tasks.map((task) => <TaskItem key={task._id} task={task} />)
        )}
      </div>

      <Dialog
        styleVersion="styled"
        variant="error"
        title="An error occurred"
        content={<p className={styles.errorModalText}>{errorMessage}</p>}
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
