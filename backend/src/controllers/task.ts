/**
 * Functions that process task route requests.
 */

import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import TaskModel from "src/models/task";
import validationErrorParser from "src/util/validationErrorParser";

import type { RequestHandler } from "express";

/**
 * This is an example of an Express API request handler. We'll tell Express to
 * run this function when our backend receives a request to retrieve a
 * particular task.
 *
 * Request handlers typically have 3 parameters: req, res, and next.
 *
 * @param req The Request object from Express. This contains all the data from
 * the API request. (https://expressjs.com/en/4x/api.html#req)
 * @param res The Response object from Express. We use this to generate the API
 * response for Express to send back. (https://expressjs.com/en/4x/api.html#res)
 * @param next The next function in the chain of middleware. If there's no more
 * processing we can do in this handler, but we're not completely done handling
 * the request, then we can pass it along by calling next(). For all of the
 * handlers defined in `src/controllers`, the next function is the global error
 * handler in `src/app.ts`.
 */
export const getTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // if the ID doesn't exist, then findById returns null
    const task = await TaskModel.findById(id).populate("assignee");

    if (task === null) {
      throw createHttpError(404, "Task not found.");
    }

    // Set the status code (200) and body (the task object as JSON) of the response.
    // Note that you don't need to return anything, but you can still use a return
    // statement to exit the function early.
    res.status(200).json(task);
  } catch (error) {
    // pass errors to the error handler
    next(error);
  }
};

// Define a custom type for the request body so we can have static typing
// for the fields
type CreateTaskBody = {
  title: string;
  description?: string;
  isChecked?: boolean;
  assignee?: string;
};

export const createTask: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const { title, description, isChecked, assignee } = req.body as CreateTaskBody;

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    const task = await TaskModel.create({
      title,
      description,
      isChecked,
      dateCreated: Date.now(),
      assignee,
    });

    const assigneeTask = await TaskModel.findById(task._id).populate("assignee");

    if (!assigneeTask) {
      throw createHttpError(404, "Task not found after creation.");
    }

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(assigneeTask);
  } catch (error) {
    next(error);
  }
};

export const removeTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await TaskModel.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

type UpdateTaskBody = {
  _id: string;
  title: string;
  description?: string;
  isChecked?: boolean;
  assignee?: string;
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const errors = validationResult(req);
  const { _id, title, description, isChecked, assignee } = req.body as UpdateTaskBody;

  try {
    validationErrorParser(errors);

    if (_id !== id) {
      return res.status(400);
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(id, {
      title,
      description,
      isChecked,
      dateUpdated: Date.now(),
      assignee,
    });

    if (updatedTask === null) {
      throw createHttpError(404, "Task not found.");
    }

    const task = await TaskModel.findById(id).populate("assignee");

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
