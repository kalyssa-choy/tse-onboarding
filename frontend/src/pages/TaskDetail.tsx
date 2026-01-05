import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getTask, type Task } from "src/api/tasks";
import { Button, Page, TaskForm } from "src/components";
import { UserTag } from "src/components/UserTag";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  const [task, setTask] = React.useState<Task | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const result = await getTask(id);
      if (result.success) {
        setTask(result.data);
      }
    };
    void fetchTask();
  }, [id]);

  if (!task) return <h1 className={styles.title}>This task doesn't exist!</h1>;

  const date = new Date(task.dateCreated);

  return (
    <Page>
      <title>{task.title} | TSE Todos</title>

      <p>
        <Link to="/">Back to home</Link>
      </p>

      {isEditing ? (
        <TaskForm
          mode="edit"
          task={task}
          onSubmit={(updatedTask) => {
            setTask(updatedTask);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className={styles.taskDetail}>
          <div className={styles.titleSection}>
            <span className={styles.title}>{task.title}</span>
            <Button
              kind="primary"
              data-testid="task-edit-button"
              label="Edit task"
              onClick={() => setIsEditing(true)}
            />
          </div>

          <p className={styles.description}>{task.description || "(No description)"}</p>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Assignee</span>
            <span className={styles.truncate}>
              <UserTag user={task.assignee} />
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Status</span>
            <span>{task.isChecked ? "Done" : "Not done"}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Date created</span>
            <span>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </Page>
  );
}
