import { Dialog } from "@tritonse/tse-constellation";
import { useState } from "react";
import { createTask, updateTask } from "src/api/tasks";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

import type { CreateTaskRequest, Task, UpdateTaskRequest } from "src/api/tasks";

export type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
};

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 * Look at where the `errors` object appears below for demonstration.
 *
 * In the MVP, the only possible error in this form is that the title is blank,
 * so this is slightly overengineered. However, a more complex form would need
 * a similar system.
 */
type TaskFormErrors = {
  title?: boolean;
};

/**
 * The form that creates or edits a Task object. In the MVP, this is only
 * capable of creating Tasks.
 *
 * @param props.mode Controls how the form renders and submits
 * @param props.task Optional initial data to populate the form with (such as
 * when we're editing an existing task)
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [assignee, setAssignee] = useState<string>(task?.assignee?._id || "");
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

    if (!task && mode === "edit") {
      // safety check
      setErrorModalMessage("No task provided for editing.");
      return;
    }

    setLoading(true);

    if (mode === "create") {
      const payload: CreateTaskRequest = {
        title,
        description: description || undefined,
        assignee: assignee || undefined, // string ID
      };

      createTask(payload)
        .then((result) => {
          if (result.success) {
            setTitle("");
            setDescription("");
            setAssignee("");
            onSubmit?.(result.data);
          } else {
            setErrorModalMessage(result.error);
          }
          setLoading(false);
        })
        .catch((err) => {
          setErrorModalMessage(String(err));
          setLoading(false);
        });
    } else if (mode === "edit" && task) {
      const payload: UpdateTaskRequest = {
        _id: task._id,
        title,
        description: description || undefined,
        isChecked: task.isChecked,
        dateCreated: task.dateCreated,
        assignee: assignee || undefined,
      };

      updateTask(payload)
        .then((result) => {
          if (result.success) {
            onSubmit?.(result.data);
          } else {
            setErrorModalMessage(result.error);
          }
          setLoading(false);
        })
        .catch((err) => {
          setErrorModalMessage(String(err));
          setLoading(false);
        });
    }
  };

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      {/* we could just use a `<div>` element because we don't need the special
      functionality that browsers give to `<form>` elements, but using `<form>`
      is better for accessibility because it's more accurate for this purpose--
      we are making a form, so we should use `<form>` */}
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        {/* `data-testid` is used by React Testing Library--see the tests in
        `TaskForm.test.tsx` */}
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          className={`${styles.textField}`}
          data-testid="task-assignee-input"
          label="Assignee (optional)"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
        />
        {/* set `type="primary"` on the button so the browser doesn't try to
        handle it specially (because it's inside a `<form>`) */}
        <Button
          kind="primary"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
      {/* Use the Constellation Dialog component to display an error message if there's an error 
      See the docs (https://tritonse.github.io/TSE-Constellation/?path=/docs/organisms-dialog--documentation)
      for a demo and more info on the prop types  */}
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
