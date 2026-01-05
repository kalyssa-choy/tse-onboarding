import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getTask, type Task } from "src/api/tasks";
import { Button, EditTaskForm, Page } from "src/components";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  //state variables
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

  return (
    <Page>
      <title> {task?.title} | TSE Todos</title>

      {/* home page link */}
      <p>
        <Link to="/">Back to home</Link>
      </p>

      {task ? (
        isEditing ? (
          <EditTaskForm
            task={task}
            onSubmit={(updatedTask) => {
              setTask(updatedTask);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
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

            {task.description ? (
              <p className={styles.description}>{task.description}</p>
            ) : (
              <p className={styles.description}>(No description)</p>
            )}

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Assignee</span>
              <span className={styles.truncate}>
                {task.assignee ? (
                  <>
                    {task.assignee.profilePictureURL ? (
                      <img
                        className={styles.profilePic}
                        src={task.assignee.profilePictureURL}
                        alt={task.assignee.name}
                      />
                    ) : (
                      <img
                        className={styles.profilePic}
                        src={"/apple-touch-icon.png"}
                        alt={task.assignee.name}
                      />
                    )}
                    <span>{task.assignee.name}</span>
                  </>
                ) : (
                  <span>Not Assigned</span>
                )}
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Status</span>
              <span>{task.isChecked ? "Done" : "Not done"}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Date created</span>
              <span>
                {task.dateCreated.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {task.dateCreated.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )
      ) : (
        <h1 className={styles.title}>This task doesn't exist!</h1>
      )}
    </Page>
  );
}
