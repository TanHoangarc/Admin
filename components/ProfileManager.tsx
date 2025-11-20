import React, { useState } from 'react';
import { WebNfcProfile, BASE_URL_PREFIX } from '../types';
import { ExternalLink, Edit3, Trash2, Plus, Search, Globe, Settings } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog'; // Note: Using standard HTML/CSS for modal to avoid heavy dependencies if radix isn't installed, sticking to raw React for simplicity in this prompt context.

interface ProfileManagerProps {
  profiles: WebNfcProfile[];
  onAdd: (name: string, slug: string) => void;
  onDelete: (id: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ profiles, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newSlug) {
      onAdd(newName, newSlug);
      setNewName('');
      setNewSlug('');
      setIsModalOpen(false);
    }
  };

  const handleEditRedirect = (profile: WebNfcProfile) => {
    // Core feature: Redirect to the admin mode of the specific NFC page
    const adminUrl = `${profile.fullUrl}?admin=true`;
    window.open(adminUrl, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Profiles</h2>
          <p className="text-slate-500">Manage your Web NFC deployments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus size={18} />
          New Profile
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
        </div>
        <input 
            type="text" 
            placeholder="Search profiles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-96 bg-white border border-slate-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700">Profile Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-700">URL Slug</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Traffic</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-center">Status</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.length > 0 ? filteredProfiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-900">{profile.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <a 
                                    href={profile.fullUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 truncate max-w-[200px]"
                                >
                                    {profile.slug}
                                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-slate-600">
                                {profile.visits.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    profile.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                    {profile.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditRedirect(profile)}
                                        title="Open Admin Mode"
                                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-2 border border-transparent hover:border-indigo-100"
                                    >
                                        <Settings size={16} />
                                        <span className="text-xs font-medium">Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => onDelete(profile.id)}
                                        title="Delete Profile"
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                No profiles found. Create one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Simple Modal for Adding Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-900">New NFC Profile</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                        <input 
                            type="text" 
                            required
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="e.g. Andy"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Repository/Slug</label>
                        <div className="flex items-center">
                             <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                                .../
                            </span>
                            <input 
                                type="text" 
                                required
                                value={newSlug}
                                onChange={e => setNewSlug(e.target.value)}
                                placeholder="Andy.github.io"
                                className="w-full border border-slate-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Final URL will be {BASE_URL_PREFIX}{newSlug || '...'}/</p>
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                        >
                            Create Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};