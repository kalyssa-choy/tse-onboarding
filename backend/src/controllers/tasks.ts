import TaskModel from "src/models/task";

import type { RequestHandler } from "express";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    // Retrieve all tasks from the database and sort by dateCreated in descending order
    const tasks = await TaskModel.find({}).sort({ dateCreated: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
