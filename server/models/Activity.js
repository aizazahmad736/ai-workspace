import mongoose from 'mongoose';
import { isMongoDb, getModel } from '../config/db.js';

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "created a project", "updated tasks", etc.
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ActivityModel = isMongoDb 
  ? mongoose.model('Activity', activitySchema) 
  : getModel('activities');

export default ActivityModel;
