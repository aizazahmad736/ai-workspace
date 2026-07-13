import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

// --- PROJECTS ---
export const getProjects = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const projects = await Project.find({ ownerId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  const { name, description, status } = req.body;
  const ownerId = req.user.id || req.user._id;

  try {
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
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const ownerId = req.user.id || req.user._id;
    if (project.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, {
      name: name || project.name,
      description: description || project.description,
      status: status || project.status
    });

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Project Updated',
      details: `Updated project: "${name || project.name}"`
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const ownerId = req.user.id || req.user._id;
    if (project.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    // Also delete all tasks associated with this project
    await Task.deleteMany({ projectId: req.params.id });

    await Activity.create({
      userId: ownerId,
      userName: req.user.name,
      action: 'Project Deleted',
      details: `Deleted project: "${project.name}" and all associated tasks`
    });

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- TASKS ---
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (projectId) {
      const tasks = await Task.find({ projectId });
      return res.json(tasks);
    }

    // If no projectId, get all tasks across all projects of this user
    const ownerId = req.user.id || req.user._id;
    const userProjects = await Project.find({ ownerId });
    const projectIds = userProjects.map(p => p.id || p._id);
    
    // For local JSON fallback, we can filter manually
    const allTasks = await Task.find({});
    const filteredTasks = allTasks.filter(t => projectIds.includes(t.projectId));

    res.json(filteredTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  const { projectId, title, description, status, priority, dueDate, assigneeId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

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
      userId: req.user.id || req.user._id,
      userName: req.user.name,
      action: 'Task Created',
      details: `Added task "${title}" to project "${project.name}"`
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assigneeId } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, {
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);

    await Activity.create({
      userId: req.user.id || req.user._id,
      userName: req.user.name,
      action: 'Task Deleted',
      details: `Deleted task "${task.title}"`
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
