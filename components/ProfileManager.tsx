import React, { useState, useRef } from 'react';
import { WebNfcProfile, BASE_URL_PREFIX, SocialLink, Project, AuthUser } from '../types';
import { 
  ExternalLink, Edit3, Trash2, Plus, Search, Settings, Download, X, 
  Link as LinkIcon, Image as ImageIcon, User, Phone, Copy, Save, 
  Briefcase, Globe, FileText, ArrowLeft, Layout, ChevronDown, QrCode
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: WebNfcProfile[];
  currentUser: AuthUser;
  onAdd: (profileData: Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WebNfcProfile>) => void;
}

// Preset Data
const SOCIAL_PRESETS = [
    { id: 'zalo', label: 'Zalo', icon: 'https://i.ibb.co/d4nRhVQV/Zalo.png' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'https://i.ibb.co/XxqRB3Qg/Whatsapp.png' },
    { id: 'wechat', label: 'WeChat', icon: 'https://i.ibb.co/Zz41gSrk/Wechat.png' },
    { id: 'email', label: 'Email', icon: 'https://i.ibb.co/nqyMXyNM/Email.png' },
    { id: 'map', label: 'Địa Chỉ', icon: 'https://i.ibb.co/7dTZHSwV/Map.png' },
    { id: 'website', label: 'Website', icon: 'https://i.ibb.co/Gf69QR4R/Website.png' },
    { id: 'profile', label: 'Profile', icon: 'https://i.ibb.co/VY01h09d/Profile.png' },
    { id: 'facebook', label: 'Facebook', icon: 'https://i.ibb.co/67VF7N5R/Facebook.png' },
    { id: 'tiktok', label: 'TikTok', icon: 'https://i.ibb.co/cStFGVqG/Tiktok.png' },
    { id: 'instagram', label: 'Instagram', icon: 'https://i.ibb.co/39gCrw9n/Instagram.png' },
    { id: 'momo', label: 'Momo', icon: 'https://i.ibb.co/KpRgSv04/Momo.png' },
    { id: 'vcb', label: 'VCB', icon: 'https://i.ibb.co/WNDG8rdx/Vietcombank.png' },
    { id: 'tcb', label: 'TCB', icon: 'https://i.ibb.co/FktVzW2z/Tcb.png' },
];

const DEFAULT_SOCIAL_URLS: Record<string, string> = {
    zalo: "https://zalo.me/",
    email: "mailto:@longhoanglogistics.com",
    map: "https://maps.app.goo.gl/ZSVFYotTCuGWNQmW8",
    website: "https://www.longhoanglogistics.com",
    profile: "https://drive.google.com/file/d/1wyPCBaCLTiUx3aWMwIX3X1WryfnTL-Lp/view?usp=drive_link"
};

const DEFAULT_TITLES = [
  "Accounting Department",
  "Documentation Department",
  "Business Development Department",
  "Overseas Sales",
  "Overseas Manager",
  "Leader Business Development"
];

const DEFAULT_ROLES = [
  "Account – Công ty Long Hoàng Logistics",
  "Documentation – Công ty Long Hoàng Logistics",
  "Sales Logistics – Công ty Long Hoàng Logistics",
  "Overseas Sales – Công ty Long Hoàng Logistics",
  "Overseas Manager – Công ty Long Hoàng Logistics",
  "Leader Team Sale 1 – Công ty Long Hoàng Logistics"
];

const DEFAULT_ROLES_EN = [
  "Account – Long Hoang Logistics Company",
  "Documentation – Long Hoang Logistics Company",
  "Sales Logistics – Long Hoang Logistics Company",
  "Overseas Sales – Long Hoang Logistics Company",
  "Overseas Manager – Long Hoang Logistics Company",
  "Leader Team Sale 1 – Long Hoang Logistics Company"
];

export const ProfileManager: React.FC<ProfileManagerProps> = ({ 
    profiles, 
    currentUser,
    onAdd, 
    onDelete, 
    onUpdate 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<WebNfcProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'content_vi' | 'content_en' | 'social' | 'projects' | 'design'>('general');

  // Form States
  const [formData, setFormData] = useState<Partial<WebNfcProfile>>({});

  // Determine which profiles to show
  const visibleProfiles = React.useMemo(() => {
    let filtered = profiles;
    
    // Role based filtering
    if (currentUser.role !== 'admin') {
        // If user, only show profiles matching their username (phone number)
        filtered = profiles.filter(p => p.phoneNumber === currentUser.username || p.zaloNumber === currentUser.username || p.name === currentUser.username);
    }

    // Search filtering
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lower) || 
            p.title?.toLowerCase().includes(lower) ||
            p.slug.toLowerCase().includes(lower)
        );
    }
    return filtered;
  }, [profiles, currentUser, searchTerm]);

  const handleEditClick = (profile: WebNfcProfile) => {
    setEditingProfile(profile);
    setFormData(JSON.parse(JSON.stringify(profile)));
    setActiveTab('general');
  };

  const handleAddClick = () => {
    setEditingProfile(null);
    setFormData({
      name: '',
      slug: '',
      title: '',
      socialLinks: [],
      projects: [],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
    });
    setActiveTab('general');
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    if (editingProfile) {
      onUpdate(editingProfile.id, formData);
      setEditingProfile(null);
    } else {
      if (formData.name && formData.slug) {
        onAdd(formData as any);
        setIsAddModalOpen(false);
      }
    }
  };

  const updateField = (field: keyof WebNfcProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Social Link Helpers
  const addSocialLink = (platformId: string) => {
    const preset = SOCIAL_PRESETS.find(p => p.id === platformId);
    if (!preset) return;

    const defaultUrl = DEFAULT_SOCIAL_URLS[platformId] || '';

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: platformId as any,
      label: preset.label,
      url: defaultUrl,
      iconUrl: preset.icon
    };

    setFormData(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink]
    }));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const removeSocialLink = (id: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter(l => l.id !== id)
    }));
  };

  // Project Helpers
  const addProject = () => {
    const newProject: Project = {
        id: Date.now().toString(),
        name: 'New Project',
        description: ''
    };
    setFormData(prev => ({
        ...prev,
        projects: [...(prev.projects || []), newProject]
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setFormData(prev => ({
        ...prev,
        projects: prev.projects?.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removeProject = (id: string) => {
    setFormData(prev => ({
        ...prev,
        projects: prev.projects?.filter(p => p.id !== id)
    }));
  };

  // Download QR
  const qrRef = useRef<HTMLDivElement>(null);
  const downloadQR = (slug: string) => {
    // Placeholder for actual QR download logic using canvas or library
    alert(`Downloading QR for ${slug}... (Integration pending)`);
  };

  // Render Modal Content
  const renderModalContent = () => {
    return (
      <div className="flex h-full flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-48 bg-slate-50 border-r border-slate-200 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {[
            { id: 'general', label: 'General', icon: User },
            { id: 'content_vi', label: 'Vietnamese', icon: FileText },
            { id: 'content_en', label: 'English', icon: Globe },
            { id: 'social', label: 'Social Links', icon: LinkIcon },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'design', label: 'Design', icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Internal Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Andy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 p-2 rounded-l-md text-slate-500 text-sm">
                    {BASE_URL_PREFIX.replace('https://', '')}
                  </span>
                  <input
                    type="text"
                    value={formData.slug?.replace('.github.io', '') || ''}
                    onChange={e => updateField('slug', e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded-r-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="andy"
                  />
                  <span className="ml-2 text-slate-500 text-sm">.github.io</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                    type="text"
                    value={formData.phoneNumber || ''}
                    onChange={e => updateField('phoneNumber', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Zalo Number</label>
                    <input
                    type="text"
                    value={formData.zaloNumber || ''}
                    onChange={e => updateField('zaloNumber', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md outline-none"
                    />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content_vi' && (
             <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Vietnamese Content</h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Header Title (Tên hiển thị)</label>
                    <input
                        type="text"
                        value={formData.headerTitleVi || ''}
                        onChange={e => updateField('headerTitleVi', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md outline-none"
                        placeholder="Lâm Ngọc Vũ"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle (Chức danh ngắn)</label>
                    <div className="relative">
                        <input
                            type="text"
                            list="vi-titles"
                            value={formData.title || ''}
                            onChange={e => updateField('title', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md outline-none"
                            placeholder="Leader Business Development"
                        />
                        <datalist id="vi-titles">
                            {DEFAULT_TITLES.map(t => <option key={t} value={t} />)}
                        </datalist>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio (Giới thiệu)</label>
                    <textarea
                        rows={4}
                        value={formData.bio || ''}
                        onChange={e => updateField('bio', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md outline-none"
                        placeholder="Kinh nghiệm..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Footer Role (Chức vụ cuối trang)</label>
                    <div className="relative">
                        <input
                            type="text"
                            list="vi-roles"
                            value={formData.footerRoleVi || ''}
                            onChange={e => updateField('footerRoleVi', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md outline-none"
                            placeholder="Leader Team Sale 1..."
                        />
                         <datalist id="vi-roles">
                            {DEFAULT_ROLES.map(r => <option key={r} value={r} />)}
                        </datalist>
                    </div>
                </div>
             </div>
          )}

          {activeTab === 'content_en' && (
             <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">English Content</h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Header Title</label>
                    <input
                        type="text"
                        value={formData.headerTitleEn || ''}
                        onChange={e => updateField('headerTitleEn', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md outline-none"
                        placeholder="Mr. Andy"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                    <div className="relative">
                        <input
                            type="text"
                            list="en-titles"
                            value={formData.titleEn || ''}
                            onChange={e => updateField('titleEn', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md outline-none"
                            placeholder="Leader Business Development"
                        />
                         <datalist id="en-titles">
                            {DEFAULT_TITLES.map(t => <option key={t} value={t} />)}
                        </datalist>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio (English)</label>
                    <textarea
                        rows={4}
                        value={formData.bioEn || ''}
                        onChange={e => updateField('bioEn', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md outline-none"
                        placeholder="Experience in..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Footer Role</label>
                    <div className="relative">
                        <input
                            type="text"
                            list="en-roles"
                            value={formData.footerRoleEn || ''}
                            onChange={e => updateField('footerRoleEn', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md outline-none"
                            placeholder="Leader Team Sale 1..."
                        />
                        <datalist id="en-roles">
                            {DEFAULT_ROLES_EN.map(r => <option key={r} value={r} />)}
                        </datalist>
                    </div>
                </div>
             </div>
          )}

          {activeTab === 'social' && (
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {SOCIAL_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addSocialLink(p.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-xs border border-slate-200 transition-colors"
                  >
                    <img src={p.icon} alt="" className="w-4 h-4 object-contain" />
                    {p.label}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                {formData.socialLinks?.map((link, idx) => (
                  <div key={link.id} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="mt-2">
                        {link.iconUrl && <img src={link.iconUrl} className="w-8 h-8 object-contain" alt={link.platform} />}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={link.label}
                                onChange={e => updateSocialLink(link.id, { label: e.target.value })}
                                className="flex-1 p-1 text-sm border border-slate-300 rounded"
                                placeholder="Label"
                            />
                            <button onClick={() => removeSocialLink(link.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={link.url}
                            onChange={e => updateSocialLink(link.id, { url: e.target.value })}
                            className="w-full p-1 text-sm border border-slate-300 rounded font-mono text-xs text-slate-600"
                            placeholder="URL"
                        />
                    </div>
                  </div>
                ))}
                {formData.socialLinks?.length === 0 && (
                    <p className="text-center text-slate-400 py-4 text-sm">No social links added yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
              <div>
                  <div className="mb-4 flex justify-end">
                      <button onClick={addProject} className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                          <Plus size={16} /> Add Project
                      </button>
                  </div>
                  <div className="space-y-4">
                      {formData.projects?.map(project => (
                          <div key={project.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                               <div className="flex justify-between mb-2">
                                   <input 
                                        className="font-medium bg-transparent border-b border-transparent focus:border-indigo-300 outline-none"
                                        value={project.name}
                                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                        placeholder="Project Name"
                                   />
                                   <button onClick={() => removeProject(project.id)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                               </div>
                               <textarea 
                                    className="w-full text-sm p-2 border border-slate-200 rounded mb-2"
                                    rows={2}
                                    value={project.description || ''}
                                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                    placeholder="Project Description"
                               />
                               <input 
                                    className="w-full text-xs p-2 border border-slate-200 rounded font-mono"
                                    value={project.url || ''}
                                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                                    placeholder="Project URL"
                               />
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Avatar</label>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-white">
                        <img src={formData.avatarUrl || 'https://via.placeholder.com/100'} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <input 
                        type="text" 
                        className="flex-1 p-2 border border-slate-300 rounded-md text-sm"
                        value={formData.avatarUrl || ''}
                        onChange={(e) => updateField('avatarUrl', e.target.value)}
                        placeholder="Image URL"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                    {formData.coverUrl && <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Preview</span>
                    </div>
                </div>
                <input 
                    type="text" 
                    className="w-full mt-2 p-2 border border-slate-300 rounded-md text-sm"
                    value={formData.coverUrl || ''}
                    onChange={(e) => updateField('coverUrl', e.target.value)}
                    placeholder="Cover Image URL"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="md:hidden border-t p-4 bg-slate-50 flex justify-end gap-2 sticky bottom-0">
             <button onClick={() => { setIsAddModalOpen(false); setEditingProfile(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
             <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Save Changes</button>
        </div>
      </div>
    );
  };

  if (isAddModalOpen || editingProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                    {editingProfile ? 'Edit Profile' : 'Create New Profile'}
                </h3>
                <div className="flex items-center gap-2">
                     <button onClick={() => { setIsAddModalOpen(false); setEditingProfile(null); }} className="p-2 hover:bg-slate-100 rounded-full hidden md:block">
                        <X size={20} className="text-slate-500" />
                    </button>
                    <button onClick={handleSave} className="hidden md:block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        Save Changes
                    </button>
                </div>
            </div>
            {renderModalContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Profile Management</h2>
          <p className="text-slate-500">Create and edit NFC landing pages.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search profiles..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            {/* Only Admin can add new profiles */}
            {currentUser.role === 'admin' && (
                <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Profile</span>
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProfiles.map(profile => (
          <div key={profile.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Card Header */}
            <div className="h-24 bg-slate-100 relative">
                {profile.coverUrl ? (
                    <img src={profile.coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                )}
                <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                        <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold bg-white/90 backdrop-blur text-slate-700 shadow-sm ${profile.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                    {profile.status === 'active' ? 'Active' : 'Maintenance'}
                </div>
            </div>

            {/* Card Body */}
            <div className="pt-10 px-6 pb-6">
                <h3 className="font-bold text-lg text-slate-900">{profile.headerTitleVi || profile.name}</h3>
                <p className="text-sm text-slate-500 mb-4 truncate">{profile.slug}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <p className="text-slate-400 text-xs uppercase font-semibold">Visits</p>
                        <p className="font-bold text-slate-700">{profile.visits}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <p className="text-slate-400 text-xs uppercase font-semibold">Taps</p>
                        <p className="font-bold text-slate-700">{profile.interactions}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleEditClick(profile)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors tooltip-trigger"
                            title="Edit Configuration"
                        >
                            <Settings size={18} />
                        </button>
                        <button 
                            onClick={() => downloadQR(profile.slug)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download QR"
                        >
                            <QrCode size={18} />
                        </button>
                        
                        {/* Only Admin can delete */}
                        {currentUser.role === 'admin' && (
                            <button 
                                onClick={() => onDelete(profile.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Profile"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <a 
                        href={profile.fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Visit Page <ExternalLink size={14} />
                    </a>
                </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {visibleProfiles.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No profiles found</h3>
                <p className="text-slate-500">Try adjusting your search {currentUser.role === 'admin' && 'or add a new profile'}.</p>
            </div>
        )}
      </div>
    </div>
  );
};
