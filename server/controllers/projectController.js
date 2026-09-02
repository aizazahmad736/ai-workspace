import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

// Helper: get logged-in user's ID
const getOwnerId = (req) => {
  return req.user.id || req.user._id;
};

// Helper: compare MongoDB IDs safely
const sameId = (id1, id2) => {
  return String(id1) === String(id2);
};

// ======================================================
// PROJECTS
// ======================================================

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    const projects = await Project.find({ ownerId });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// CREATE PROJECT
export const createProject = async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const ownerId = getOwnerId(req);

    const project = await Project.create({
      name,
      description,
      status: status || 'Planning',
      ownerId
    });

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Project Created',
      details: `Created new project: "${name}"`
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE PROJECT
export const updateProject = async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    const ownerId = getOwnerId(req);

    // Check ownership
    if (!sameId(project.ownerId, ownerId)) {
      return res.status(403).json({
        message: 'Not authorized to edit this project'
      });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: name !== undefined ? name : project.name,
        description:
          description !== undefined
            ? description
            : project.description,
        status: status !== undefined
          ? status
          : project.status
      },
      {
        new: true
      }
    );

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Project Updated',
      details: `Updated project: "${updated.name}"`
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    const ownerId = getOwnerId(req);

    // Check ownership
    if (!sameId(project.ownerId, ownerId)) {
      return res.status(403).json({
        message: 'Not authorized to delete this project'
      });
    }

    // Delete project
    await Project.findByIdAndDelete(req.params.id);

    // Delete all tasks belonging to this project
    await Task.deleteMany({
      projectId: req.params.id
    });

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Project Deleted',
      details: `Deleted project: "${project.name}" and all associated tasks`
    });

    res.json({
      message: 'Project and associated tasks deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// TASKS
// ======================================================

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const { projectId } = req.query;

    // ------------------------------------------
    // If projectId is provided
    // ------------------------------------------
    if (projectId) {
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          message: 'Project not found'
        });
      }

      // Make sure project belongs to logged-in user
      if (!sameId(project.ownerId, ownerId)) {
        return res.status(403).json({
          message: 'Not authorized to view tasks for this project'
        });
      }

      const tasks = await Task.find({
        projectId
      });

      return res.json(tasks);
    }

    // ------------------------------------------
    // No projectId → get all user's tasks
    // ------------------------------------------

    const userProjects = await Project.find({
      ownerId
    });

    const projectIds = userProjects.map(
      project => project._id
    );

    const tasks = await Task.find({
      projectId: { $in: projectIds }
    });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// CREATE TASK
export const createTask = async (req, res) => {
  const {
    projectId,
    title,
    description,
    status,
    priority,
    dueDate,
    assigneeId
  } = req.body;

  try {
    const ownerId = getOwnerId(req);

    // Check project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check project ownership
    if (!sameId(project.ownerId, ownerId)) {
      return res.status(403).json({
        message: 'Not authorized to create a task in this project'
      });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
      assigneeId
    });

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Task Created',
      details: `Added task "${title}" to project "${project.name}"`
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE TASK
export const updateTask = async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assigneeId
  } = req.body;

  try {
    const ownerId = getOwnerId(req);

    // Find task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // Find task's project
    const project = await Project.findById(task.projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check project ownership
    if (!sameId(project.ownerId, ownerId)) {
      return res.status(403).json({
        message: 'Not authorized to update this task'
      });
    }

    // Update task
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title:
          title !== undefined
            ? title
            : task.title,

        description:
          description !== undefined
            ? description
            : task.description,

        status:
          status !== undefined
            ? status
            : task.status,

        priority:
          priority !== undefined
            ? priority
            : task.priority,

        dueDate:
          dueDate !== undefined
            ? dueDate
            : task.dueDate,

        assigneeId:
          assigneeId !== undefined
            ? assigneeId
            : task.assigneeId
      },
      {
        new: true
      }
    );

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Task Updated',
      details: `Updated task "${updated.title}"`
    });

    res.json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    // Find task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // Find task's project
    const project = await Project.findById(task.projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check ownership
    if (!sameId(project.ownerId, ownerId)) {
      return res.status(403).json({
        message: 'Not authorized to delete this task'
      });
    }

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Task Deleted',
      details: `Deleted task "${task.title}"`
    });

    res.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};