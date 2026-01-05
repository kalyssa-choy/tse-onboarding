import { Dialog } from "@tritonse/tse-constellation";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
import styles from "src/components/TaskItem.module.css";
import { UserTag } from "src/components/UserTag";

import type { Task } from "src/api/tasks";

export type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleCheck = async () => {
    setLoading(true);

    try {
      const updated = await updateTask({
        ...task,
        isChecked: !task.isChecked,
        assignee: task.assignee?._id,
      });

      if (updated.success) {
        setTask(updated.data);
      } else {
        setErrorMessage("Failed to update task");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while updating the task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.item}>
      <CheckButton
        checked={task.isChecked}
        onPress={() => void handleToggleCheck()}
        disabled={isLoading}
      />

      <div
        className={
          task.isChecked ? `${styles.textContainer} ${styles.checked}` : styles.textContainer
        }
      >
        <Link className={styles.link} to={`/task/${task._id}`}>
          <span className={styles.title}>{task.title}</span>
        </Link>
        {task.description && <span className={styles.checked}>{task.description}</span>}
      </div>

      <UserTag user={task.assignee} />

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
