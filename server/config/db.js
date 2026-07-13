import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

// Memory storage for JSON-fallback DB
let localDb = {
  users: [],
  projects: [],
  tasks: [],
  activities: []
};

// Check if MONGODB_URI is provided
export const isMongoDb = !!process.env.MONGODB_URI;

export const connectDB = async () => {
  if (isMongoDb) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully.');
      return;
    } catch (error) {
      console.error('MongoDB connection error. Falling back to local JSON database.', error.message);
    }
  }

  // Initialize JSON database directory and file
  console.log('Using local JSON File Database (Zero-Config Fallback).');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(JSON_DB_PATH)) {
    try {
      const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      localDb = JSON.parse(data);
      console.log('Local database loaded successfully.');
    } catch (error) {
      console.error('Error reading db.json, starting with fresh DB.', error.message);
      saveLocalDb();
    }
  } else {
    saveLocalDb();
  }
};

export const getLocalDb = () => localDb;

export const saveLocalDb = () => {
  if (isMongoDb) return;
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving db.json:', error.message);
  }
};

// Helper to mimic Mongoose Models for clean codebase structure
export const getModel = (collectionName) => {
  return {
    find: async (query = {}) => {
      let items = localDb[collectionName] || [];
      return items.filter(item => {
        for (let key in query) {
          if (query[key] !== item[key]) return false;
        }
        return true;
      });
    },
    findOne: async (query = {}) => {
      let items = localDb[collectionName] || [];
      return items.find(item => {
        for (let key in query) {
          if (query[key] !== item[key]) return false;
        }
        return item;
      }) || null;
    },
    findById: async (id) => {
      let items = localDb[collectionName] || [];
      return items.find(item => item.id === id || item._id === id) || null;
    },
    create: async (data) => {
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        _id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      if (!localDb[collectionName]) {
        localDb[collectionName] = [];
      }
      localDb[collectionName].push(newItem);
      saveLocalDb();
      return newItem;
    },
    findByIdAndUpdate: async (id, data, options = {}) => {
      let items = localDb[collectionName] || [];
      const index = items.findIndex(item => item.id === id || item._id === id);
      if (index === -1) return null;
      items[index] = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      saveLocalDb();
      return items[index];
    },
    findByIdAndDelete: async (id) => {
      let items = localDb[collectionName] || [];
      const index = items.findIndex(item => item.id === id || item._id === id);
      if (index === -1) return null;
      const removed = items.splice(index, 1)[0];
      saveLocalDb();
      return removed;
    },
    deleteMany: async (query = {}) => {
      let items = localDb[collectionName] || [];
      localDb[collectionName] = items.filter(item => {
        for (let key in query) {
          if (query[key] === item[key]) return false;
        }
        return true;
      });
      saveLocalDb();
      return { deletedCount: items.length - localDb[collectionName].length };
    }
  };
};
