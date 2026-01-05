import { Dialog } from "@tritonse/tse-constellation";
import { useState } from "react";
import { updateTask } from "src/api/tasks";
import { Button, TextField } from "src/components";

import styles from "./EditTaskForm.module.css"; // Own styles

import type { Task } from "src/api/tasks";

export type EditTaskFormProps = {
  task: Task;
  onSubmit?: (task: Task) => void;
};

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 */
type TaskFormErrors = {
  title?: boolean;
};

/**
 * The form that edits a Task object.
 *
 * @param props.task The task to edit
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function EditTaskForm({ task, onSubmit }: EditTaskFormProps) {
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description || "");
  const [assignee, setAssignee] = useState<string>(task.assignee?._id || "");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  // This state variable controls the error message that gets displayed to the user in the
  // Constellation `Dialog` component. If it's `null`, there's no error, so we don't display the Dialog.
  // If it's non-null, there is an error, so we should display that error to the user.
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    // first, do any validation that we can on the frontend
    setErrors({});
    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }
    setLoading(true);
    updateTask({
      _id: task._id,
      title,
      description,
      isChecked: task.isChecked,
      dateCreated: task.dateCreated,
      assignee: assignee || undefined,
    })
      .then((result) => {
        if (result.success) {
          // only call onSubmit if it's NOT undefined
          if (onSubmit) onSubmit(result.data);
        } else {
          setErrorModalMessage(result.error);
        }
        setLoading(false);
      })
      .catch(setErrorModalMessage);
  };

  return (
    <form className={styles.form}>
      <span className={styles.formTitle}>Edit task</span>
      <div className={styles.formRow}>
        <div className={styles.titleField}>
          <TextField
            className={styles.textField}
            data-testid="task-title-input"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
        </div>
        <div className={styles.descriptionField}>
          <TextField
            className={styles.textField}
            data-testid="task-description-input"
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.assigneeField}>
          <TextField
            className={styles.textField}
            data-testid="task-assignee-input"
            label="Assignee ID (optional)"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </div>
        <div className={styles.saveField}>
          <Button
            kind="primary"
            data-testid="task-submit-button"
            label="Save"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>

      <Dialog
        styleVersion="styled"
        variant="error"
        title="An error occurred"
        // Override the text color so it doesn't show white text on a white background
        content={<p className={styles.errorModalText}>{errorModalMessage}</p>}
        isOpen={errorModalMessage !== null}
        onClose={() => setErrorModalMessage(null)}
      />
    </form>
  );
}
