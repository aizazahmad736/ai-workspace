import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  X,
  ClipboardList,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const columns = ['Todo', 'In Progress', 'Review', 'Done'];

const priorityColors = {
  'Low': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Medium': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'High': 'bg-red-500/10 text-red-400 border-red-500/20'
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects/projects'),
        api.get('/projects/tasks')
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      if (projectsRes.data.length > 0 && !projectId) {
        setProjectId(projectsRes.data[0].id || projectsRes.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load tasks resources', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('Todo');
    setPriority('Medium');
    setDueDate('');
    if (projects.length > 0) {
      setProjectId(projects[0].id || projects[0]._id);
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate || '');
    setProjectId(task.projectId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/projects/tasks/${editingTask.id || editingTask._id}`, {
          title, description, status, priority, dueDate, projectId
        });
      } else {
        await api.post('/projects/tasks', {
          title, description, status, priority, dueDate, projectId
        });
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const moveTask = async (task, direction) => {
    const currentIndex = columns.indexOf(task.status);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= columns.length) return;
    
    const nextStatus = columns[nextIndex];
    try {
      await api.put(`/projects/tasks/${task.id || task._id}`, {
        status: nextStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error moving task', error);
    }
  };

  const getProjectName = (pId) => {
    const proj = projects.find(p => p.id === pId || p._id === pId);
    return proj ? proj.name : 'Unknown Project';
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Kanban Board</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">Orchestrate and coordinate tasks inside your sprints.</p>
        </div>
        {projects.length > 0 && (
          <button 
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#27272a]/20 rounded-3xl glass">
          <ClipboardList className="w-12 h-12 text-[#71717a] mx-auto mb-4" />
          <h3 className="text-base font-semibold">Create a Project First</h3>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-sm mx-auto">Tasks must belong to a project container. Please create a project before adding tasks.</p>
        </div>
      ) : (
        /* Kanban Board Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <div key={col} className="bg-[#18181b]/30 border border-[#27272a]/30 rounded-2xl p-4 flex flex-col min-h-[500px]">
                {/* Column Title */}
                <div className="flex items-center justify-between pb-3 border-b border-[#27272a]/20 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#a1a1aa]">{col}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-[#27272a] text-white rounded-md font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px]">
                  {colTasks.map((task) => (
                    <div 
                      key={task.id || task._id}
                      className="p-4 rounded-xl border border-[#27272a]/20 glass hover:border-violet-600/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                          <span className="text-[9px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                            {getProjectName(task.projectId)}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-2">{task.title}</h4>
                        {task.description && (
                          <p className="text-[11px] text-[#a1a1aa] mt-2 line-clamp-3">{task.description}</p>
                        )}
                      </div>

                      {/* Footer controls */}
                      <div className="flex items-center justify-between mt-4 border-t border-[#27272a]/10 pt-3">
                        <span className="text-[9px] text-[#71717a]">
                          {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {/* Move Left */}
                          <button 
                            disabled={col === 'Todo'}
                            onClick={() => moveTask(task, -1)}
                            className="p-1 rounded bg-[#27272a]/40 text-[#a1a1aa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>

                          <button 
                            onClick={() => handleOpenEdit(task)}
                            className="p-1 rounded bg-[#27272a]/40 text-indigo-400 hover:text-white"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          <button 
                            onClick={() => handleDelete(task.id || task._id)}
                            className="p-1 rounded bg-[#27272a]/40 text-red-400 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Move Right */}
                          <button 
                            disabled={col === 'Done'}
                            onClick={() => moveTask(task, 1)}
                            className="p-1 rounded bg-[#27272a]/40 text-[#a1a1aa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                  
                  {colTasks.length === 0 && (
                    <div className="text-center py-12 text-[10px] text-[#71717a]">
                      Drag / move tasks here
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button 
              className="absolute top-4 right-4 text-[#a1a1aa] hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-4">{editingTask ? 'Edit Task' : 'Create Task'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Project Container</label>
                <select 
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Optimize React rendering"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Description</label>
                <textarea 
                  rows="2"
                  placeholder="Details and implementation requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Due Date</label>
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Sprint Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                >
                  {columns.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer"
              >
                {editingTask ? 'Save Task' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tasks;
