import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  MoreVertical,
  X,
  FileText
} from 'lucide-react';

const statusColors = {
  'Planning': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'In Progress': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planning');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setStatus('Planning');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || '');
    setStatus(project.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        // Edit project
        await api.put(`/projects/projects/${editingProject.id || editingProject._id}`, {
          name, description, status
        });
      } else {
        // Create project
        await api.post('/projects/projects', {
          name, description, status
        });
      }
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will delete all associated tasks too.')) return;
    try {
      await api.delete(`/projects/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project', error);
    }
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
      
      {/* Top Banner Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Workspace Projects</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">Initiate and control core repositories, structures, and goals.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id || project._id} 
              className="p-6 rounded-2xl glass border border-[#27272a]/20 flex flex-col justify-between hover-lift relative"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${statusColors[project.status] || 'bg-gray-500/10 text-gray-400'}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-base font-bold mt-4 line-clamp-1">{project.name}</h3>
                <p className="text-xs text-[#a1a1aa] mt-2 line-clamp-2 min-h-[32px]">{project.description || 'No description provided.'}</p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-[#27272a]/10 pt-4 mt-6">
                <span className="text-[10px] text-[#71717a]">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(project)}
                    className="p-1.5 rounded-lg border border-border/10 text-indigo-400 hover:bg-indigo-500/10 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id || project._id)}
                    className="p-1.5 rounded-lg border border-border/10 text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-[#27272a]/20 rounded-3xl glass">
          <FileText className="w-12 h-12 text-[#71717a] mx-auto mb-4" />
          <h3 className="text-base font-semibold">No Projects Found</h3>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-sm mx-auto">Get started by creating your first project container to host your tasks and milestones.</p>
          <button 
            onClick={handleOpenCreate}
            className="mt-6 bg-[#27272a] hover:bg-[#27272a]/80 text-[#f4f4f5] text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer border border-[#27272a]"
          >
            Create a Project
          </button>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              className="absolute top-4 right-4 text-[#a1a1aa] hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold mb-4">{editingProject ? 'Edit Project' : 'Create New Project'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. AI Portfolio Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Summarize the core target deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">Project Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-violet-600"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                {editingProject ? 'Save Changes' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
