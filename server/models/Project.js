import mongoose from 'mongoose';
import { isMongoDb, getModel } from '../config/db.js';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Planning' }, // Planning, In Progress, Completed, On Hold
  ownerId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProjectModel = isMongoDb 
  ? mongoose.model('Project', projectSchema) 
  : getModel('projects');

export default ProjectModel;
