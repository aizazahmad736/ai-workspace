```js
import mongoose from 'mongoose';

import { isMongoDb, getModel } from '../config/db.js';

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { type: String, required: true },

  role: { type: String, default: 'Member' }, // Admin, Manager, Member

  plan: { type: String, default: 'Free' }, // Free, Pro, Enterprise

  aiUsageLimit: { type: Number, default: 20 },

  aiUsageCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now }

});

const UserModel = isMongoDb
  ? mongoose.model('User', userSchema)
  : getModel('users');

export default UserModel;
```
