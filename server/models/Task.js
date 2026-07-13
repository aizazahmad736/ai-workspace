import mongoose from 'mongoose';
import { isMongoDb, getModel } from '../config/db.js';

const taskSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Todo' }, // Todo, In Progress, Review, Done
  priority: { type: String, default: 'Medium' }, // Low, Medium, High
  dueDate: { type: String },
  assigneeId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TaskModel = isMongoDb 
  ? mongoose.model('Task', taskSchema) 
  : getModel('tasks');

export default TaskModel;
