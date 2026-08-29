import express from 'express';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask 
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Projects
router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Tasks
router.route('/tasks')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/tasks/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
