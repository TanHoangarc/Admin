
import React, { useState, useRef } from 'react';
import { WebNfcProfile, BASE_URL_PREFIX, SocialLink, Project } from '../types';
import { 
  ExternalLink, Edit3, Trash2, Plus, Search, Settings, Download, X, 
  Link as LinkIcon, Image as ImageIcon, User, Phone, Copy, Save, 
  Briefcase, Globe, FileText, ArrowLeft, Layout, ChevronDown
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: WebNfcProfile[];
  onAdd: (profileData: Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>) => void;
  onDelete: (id: string) => void;
}

// Preset Data from Screenshot
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

// Template for the generated HTML file
const generateHtmlTemplate = (profile: WebNfcProfile) => {
  const cleanPhone = (p: string) => p ? p.replace(/\D/g, '') : '';
  
  const formatPhone84 = (p: string) => {
      const clean = cleanPhone(p);
      if (!clean) return '';
      if (clean.startsWith('84')) return '+' + clean;
      if (clean.startsWith('0')) return '+84' + clean.substring(1);
      return '+84' + clean;
  };

  const formattedPhone = formatPhone84(profile.phoneNumber || '');
  const zaloContact = profile.zaloNumber || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCV Card - ${profile.name}</title>
    <meta name="description" content="${profile.bio || 'Personal NFC Profile'}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
        .profile-avatar { width: 120px; height: 120px; object-fit: cover; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .social-btn { transition: all 0.3s ease; }
        .social-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px -10px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

    <div id="app" class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[800px]">
        <!-- Content rendered by JS -->
    </div>

    <script>
        const config = {
            name: "${profile.name}",
            title: "${profile.name}",
            jobTitle: "${profile.title || ''}",
            jobTitleEn: "${profile.titleEn || ''}",
            bio: \`${profile.bio || ''}\`,
            bioEn: \`${profile.bioEn || ''}\`,
            avatar: "${profile.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profile.name}",
            cover: "${profile.coverUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80'}",
            phoneContact: "${formattedPhone}", 
            zaloContact: "${zaloContact}",
            
            socialLinks: [
                ${profile.socialLinks.map(link => `{
                    id: '${link.id}',
                    label: '${link.label}',
                    href: '${link.url}',
                    platform: '${link.platform}',
                    iconUrl: '${link.iconUrl || ''}',
                    qrImageUrl: '${link.qrImageUrl || ''}'
                },`).join('\n                ')}
            ],
            
            projects: [
                 ${(profile.projects || []).map(p => `{
                    name: "${p.name}",
                    desc: \`${p.description || ''}\`,
                    img: "${p.imageUrl || ''}",
                    url: "${p.url || '#'}",
                    details: [${(p.detailImageUrls || []).map(u => `"${u}"`).join(',')}]
                 },`).join('\n')}
            ]
        };

        const app = document.getElementById('app');
        let isEn = false;

        function render() {
            const title = isEn ? (config.jobTitleEn || config.jobTitle) : config.jobTitle;
            const bio = isEn ? (config.bioEn || config.bio) : config.bio;

            app.innerHTML = \`
                <div class="h-48 w-full relative">
                    <img src="\${config.cover}" class="w-full h-full object-cover">
                    <div class="absolute top-4 right-4 z-10">
                        <button onclick="toggleLang()" class="bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs border border-white/20 hover:bg-black/50 transition">
                            \${isEn ? 'EN' : 'VN'}
                        </button>
                    </div>
                </div>

                <div class="px-6 relative -mt-16 pb-8 text-center">
                    <div class="flex justify-center mb-4">
                        <img src="\${config.avatar}" class="profile-avatar bg-white">
                    </div>
                    
                    <h1 class="text-2xl font-bold text-slate-900 mb-1">\${config.name}</h1>
                    <p class="text-indigo-600 font-medium mb-3">\${title}</p>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">\${bio}</p>

                    <div class="flex justify-center gap-3 mb-8">
                        \${config.phoneContact ? \`
                        <a href="tel:\${config.phoneContact}" class="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-phone"></i> Call
                        </a>\` : ''}
                        <button onclick="saveContact()" class="flex-1 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-user-plus"></i> Save
                        </button>
                    </div>

                    <div class="space-y-3 mb-8">
                        \${config.socialLinks.map(link => \`
                            <a href="\${link.href}" target="_blank" class="social-btn block w-full bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg overflow-hidden border border-slate-100">
                                        \${link.iconUrl 
                                            ? \`<img src="\${link.iconUrl}" class="w-full h-full object-cover">\` 
                                            : \`<i class="fa-solid fa-link text-slate-400"></i>\`}
                                    </div>
                                    <div class="text-left">
                                        <span class="font-semibold text-slate-700 block leading-tight">\${link.label}</span>
                                        \${link.qrImageUrl ? '<span class="text-[10px] text-indigo-500 font-medium">View QR</span>' : ''}
                                    </div>
                                </div>
                                <i class="fa-solid fa-chevron-right text-slate-300 group-hover:text-indigo-400"></i>
                            </a>
                        \`).join('')}
                    </div>

                    \${config.projects.length > 0 ? \`
                        <div class="text-left mb-8">
                            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pl-2 border-l-4 border-indigo-500">Projects</h3>
                            <div class="grid gap-6">
                                \${config.projects.map(p => \`
                                    <div class="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                        \${p.img ? \`<img src="\${p.img}" class="w-full h-56 object-cover">\` : ''}
                                        <div class="p-5">
                                            <h4 class="font-bold text-lg text-slate-800">\${p.name}</h4>
                                            <p class="text-sm text-slate-600 mt-2 leading-relaxed">\${p.desc}</p>
                                            
                                            \${p.details && p.details.length > 0 ? \`
                                                <div class="grid grid-cols-2 gap-2 mt-4">
                                                    \${p.details.map(img => \`<img src="\${img}" class="w-full h-24 object-cover rounded-lg">\`).join('')}
                                                </div>
                                            \` : ''}
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </div>
                    \` : ''}
                    
                    <div class="mt-8 pt-6 border-t border-slate-100">
                        <p class="text-xs text-slate-400 font-medium">Made with NFC Admin</p>
                    </div>
                </div>
            \`;
        }

        window.toggleLang = () => {
            isEn = !isEn;
            render();
        };

        window.saveContact = () => {
            const vcard = \`BEGIN:VCARD
VERSION:3.0
FN:\${config.name}
TITLE:\${config.jobTitle}
TEL;TYPE=CELL:\${config.phoneContact}
URL:\${window.location.href}
NOTE:\${config.bio}
END:VCARD\`;
            const blob = new Blob([vcard], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${config.name.replace(/ /g, '_')}.vcf\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        
        render();
    </script>
</body>
</html>`;
};

type Tab = 'general' | 'images' | 'content_vn' | 'content_en' | 'social' | 'projects';

export const ProfileManager: React.FC<ProfileManagerProps> = ({ profiles, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>>({
    name: '',
    slug: '',
    title: '',
    bio: '',
    titleEn: '',
    bioEn: '',
    phoneNumber: '',
    zaloNumber: '',
    avatarUrl: '',
    coverUrl: '',
    socialLinks: [],
    projects: []
  });

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = () => {
    if (formData.name && formData.slug) {
      onAdd(formData);
      resetForm();
      setIsModalOpen(false);
    } else {
        alert("Please fill in at least the Name and Slug (General tab).");
    }
  };

  const resetForm = () => {
    setFormData({
        name: '',
        slug: '',
        title: '',
        bio: '',
        titleEn: '',
        bioEn: '',
        phoneNumber: '',
        zaloNumber: '',
        avatarUrl: '',
        coverUrl: '',
        socialLinks: [],
        projects: []
    });
    setActiveTab('general');
  };

  const addSocialLink = (presetId: string) => {
    const preset = SOCIAL_PRESETS.find(p => p.id === presetId);
    setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, {
            id: Date.now().toString(),
            platform: presetId as any,
            url: '',
            label: preset?.label || 'New Link',
            iconUrl: preset?.icon || '',
            qrImageUrl: ''
        }]
    }));
    setShowAddMenu(false);
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
      setFormData(prev => ({
          ...prev,
          socialLinks: prev.socialLinks.map(link => 
              link.id === id ? { ...link, [field]: value } : link
          )
      }));
  };

  const removeSocialLink = (id: string) => {
      setFormData(prev => ({
          ...prev,
          socialLinks: prev.socialLinks.filter(l => l.id !== id)
      }));
  };

  const addProject = () => {
      setFormData(prev => ({
          ...prev,
          projects: [...(prev.projects || []), {
              id: Date.now().toString(),
              name: '',
              url: '',
              description: '',
              imageUrl: '',
              detailImageUrls: []
          }]
      }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
      setFormData(prev => ({
          ...prev,
          projects: prev.projects?.map(p => 
              p.id === id ? { ...p, [field]: value } : p
          )
      }));
  };

  const handleDetailImagesChange = (id: string, text: string) => {
      const urls = text.split('\n').map(u => u.trim()).filter(u => u !== '');
      updateProject(id, 'detailImageUrls', urls);
  };

  const removeProject = (id: string) => {
      setFormData(prev => ({
          ...prev,
          projects: prev.projects?.filter(p => p.id !== id) || []
      }));
  };

  const handleEditRedirect = (profile: WebNfcProfile) => {
    setFormData({
        name: profile.name,
        slug: profile.slug.replace('.github.io', ''),
        title: profile.title,
        bio: profile.bio,
        titleEn: profile.titleEn,
        bioEn: profile.bioEn,
        phoneNumber: profile.phoneNumber,
        zaloNumber: profile.zaloNumber,
        avatarUrl: profile.avatarUrl,
        coverUrl: profile.coverUrl,
        socialLinks: profile.socialLinks || [],
        projects: profile.projects || []
    });
    setIsModalOpen(true);
  };

  const downloadProject = (profileData: any) => {
    const tempProfile: WebNfcProfile = {
        id: 'temp',
        visits: 0, 
        interactions: 0,
        lastActive: '',
        status: 'active',
        fullUrl: `${BASE_URL_PREFIX}${profileData.slug}`,
        ...profileData
    };
    
    const htmlContent = generateHtmlTemplate(tempProfile);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyJson = () => {
      navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      alert("Profile JSON copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Profiles</h2>
          <p className="text-slate-500">Manage your Web NFC deployments.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
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
                                    {profile.avatarUrl ? (
                                        <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                            {profile.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-medium text-slate-900 block">{profile.name}</span>
                                        {profile.title && <span className="text-xs text-slate-500">{profile.title}</span>}
                                    </div>
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
                                        onClick={() => downloadProject(profile)}
                                        title="Download Source Code"
                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleEditRedirect(profile)}
                                        title="Open Admin Mode"
                                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                    >
                                        <Settings size={16} />
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

      {/* Full Screen Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-in fade-in duration-200">
            
            {/* 1. Header */}
            <div className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow-md flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h3 className="font-semibold text-lg">Chỉnh sửa: {formData.name || 'New User'}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={copyJson}
                        className="hidden md:flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Copy size={16} />
                        <span>Copy JSON</span>
                    </button>
                    <button 
                        onClick={() => downloadProject(formData)}
                        className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Download size={16} />
                        <span>Tải Website (.html)</span>
                    </button>
                    <button 
                        onClick={handleAddSubmit}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Save size={16} />
                        <span>Lưu Thay Đổi</span>
                    </button>
                </div>
            </div>

            {/* 2. Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Sidebar Navigation */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
                    <div className="p-4 space-y-1">
                        {[
                            { id: 'general', label: 'Chung', icon: Settings },
                            { id: 'images', label: 'Hình ảnh', icon: ImageIcon },
                            { id: 'content_vn', label: 'Nội dung (VN)', icon: FileText },
                            { id: 'content_en', label: 'Nội dung (EN)', icon: Globe },
                            { id: 'social', label: 'Mạng Xã Hội', icon: LinkIcon },
                            { id: 'projects', label: 'Dự án', icon: Briefcase },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
                        
                        {/* Tab: General */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Thông tin cơ bản</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên quản lý (Admin) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="New User"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Slug / Domain <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={formData.slug}
                                        onChange={e => setFormData({...formData, slug: e.target.value})}
                                        placeholder="e.g. Andy.github.io"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại (Gọi)</label>
                                    <input 
                                        type="text" 
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                        placeholder="+84972133680"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Số Zalo (Liên hệ)</label>
                                    <input 
                                        type="text" 
                                        value={formData.zaloNumber}
                                        onChange={e => setFormData({...formData, zaloNumber: e.target.value})}
                                        placeholder="0972133680"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab: Images */}
                        {activeTab === 'images' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Hình ảnh hiển thị</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                                        <input 
                                            type="text" 
                                            value={formData.avatarUrl}
                                            onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                                            placeholder="https://..."
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                        />
                                        <div className="mt-4 w-32 h-32 bg-slate-100 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto">
                                            {formData.avatarUrl ? (
                                                <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={32} /></div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Cover Photo URL</label>
                                        <input 
                                            type="text" 
                                            value={formData.coverUrl}
                                            onChange={e => setFormData({...formData, coverUrl: e.target.value})}
                                            placeholder="https://..."
                                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                        />
                                        <div className="mt-4 w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            {formData.coverUrl ? (
                                                <img src={formData.coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={32} /></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Content VN */}
                        {activeTab === 'content_vn' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Nội dung Tiếng Việt</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Chức danh / Tiêu đề</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        placeholder="Ví dụ: Kiến trúc sư trưởng"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Giới thiệu bản thân (Bio)</label>
                                    <textarea 
                                        value={formData.bio}
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                        placeholder="Mô tả ngắn gọn về công việc và đam mê của bạn..."
                                        rows={6}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab: Content EN */}
                        {activeTab === 'content_en' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">English Content</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.titleEn}
                                        onChange={e => setFormData({...formData, titleEn: e.target.value})}
                                        placeholder="e.g. Senior Architect"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio / About</label>
                                    <textarea 
                                        value={formData.bioEn}
                                        onChange={e => setFormData({...formData, bioEn: e.target.value})}
                                        placeholder="Short description about yourself..."
                                        rows={6}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab: Social (Redesigned) */}
                        {activeTab === 'social' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                                    <h4 className="text-lg font-bold text-slate-900">Mạng xã hội</h4>
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowAddMenu(!showAddMenu)}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                                        >
                                            <Plus size={16} /> Thêm
                                        </button>
                                        {showAddMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10 max-h-80 overflow-y-auto">
                                                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Presets</div>
                                                {SOCIAL_PRESETS.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => addSocialLink(p.id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700"
                                                    >
                                                        <img src={p.icon} alt="" className="w-5 h-5 object-contain rounded-sm" />
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {formData.socialLinks.map((link, index) => (
                                        <div key={link.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            {/* Row 1: Header */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full border border-slate-200 p-1 flex-shrink-0 bg-white">
                                                    {link.iconUrl ? (
                                                        <img src={link.iconUrl} alt="" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                                                            <LinkIcon size={16} className="text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Label Input */}
                                                <input 
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) => updateSocialLink(link.id, 'label', e.target.value)}
                                                    className="w-40 font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none px-1 py-1 transition-colors bg-transparent"
                                                    placeholder="Label"
                                                />

                                                {/* Icon URL Input */}
                                                <div className="flex-1">
                                                    <input 
                                                        type="text"
                                                        value={link.iconUrl || ''}
                                                        onChange={(e) => updateSocialLink(link.id, 'iconUrl', e.target.value)}
                                                        placeholder="Icon URL..."
                                                        className="w-full text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    />
                                                </div>

                                                {/* Delete */}
                                                <button 
                                                    onClick={() => removeSocialLink(link.id)}
                                                    className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Row 2: Link URL */}
                                            <div className="mb-3">
                                                <input 
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                                                    placeholder="https://..."
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>

                                            {/* Row 3: QR Image URL */}
                                            <div>
                                                <input 
                                                    type="text"
                                                    value={link.qrImageUrl || ''}
                                                    onChange={(e) => updateSocialLink(link.id, 'qrImageUrl', e.target.value)}
                                                    placeholder="QR Image URL (Optional)"
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.socialLinks.length === 0 && (
                                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                            <p className="text-slate-500">No social links added yet.</p>
                                            <button onClick={() => setShowAddMenu(true)} className="text-indigo-600 font-medium text-sm mt-2 hover:underline">
                                                Add your first link
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab: Projects */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                                    <h4 className="text-lg font-bold text-slate-900">Dự Án</h4>
                                    <button 
                                        onClick={addProject}
                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <Plus size={16} /> Thêm Dự Án
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.projects && formData.projects.length > 0 ? formData.projects.map((project, index) => (
                                        <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h5 className="font-bold text-slate-800">Project #{index + 1}</h5>
                                                <button 
                                                    onClick={() => removeProject(project.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">TÊN DỰ ÁN</label>
                                                    <input 
                                                        type="text"
                                                        value={project.name}
                                                        onChange={e => updateProject(project.id, 'name', e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ẢNH THU NHỎ (THUMBNAIL)</label>
                                                    <input 
                                                        type="text"
                                                        value={project.imageUrl || ''}
                                                        onChange={e => updateProject(project.id, 'imageUrl', e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-slate-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">MÔ TẢ</label>
                                                    <textarea 
                                                        value={project.description || ''}
                                                        onChange={e => updateProject(project.id, 'description', e.target.value)}
                                                        rows={3}
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ẢNH CHI TIẾT (MỖI DÒNG 1 LINK)</label>
                                                    <textarea 
                                                        value={project.detailImageUrls?.join('\n') || ''}
                                                        onChange={e => handleDetailImagesChange(project.id, e.target.value)}
                                                        rows={3}
                                                        placeholder="https://image1.jpg&#10;https://image2.jpg"
                                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                            <p className="text-slate-500">Chưa có dự án nào.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
