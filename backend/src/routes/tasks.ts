import express from "express";
import * as TasksController from "src/controllers/tasks";

const router = express.Router();

router.get("/", TasksController.getAllTasks);

export default router;
