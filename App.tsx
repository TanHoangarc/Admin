import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, ShieldCheck, Menu, X, LogOut } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProfileManager } from './components/ProfileManager';
import { Login } from './components/Login';
import { getProfiles, addProfile, deleteProfile, updateProfile } from './services/mockService';
import { checkSession, logout } from './services/authService';
import { WebNfcProfile, AuthUser } from './types';

type View = 'dashboard' | 'profiles';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [profiles, setProfiles] = useState<WebNfcProfile[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Check session on mount
  useEffect(() => {
    const sessionUser = checkSession();
    if (sessionUser) {
        setUser(sessionUser);
        // If it's a regular user, default to 'profiles' view as they might not see dashboard
        if (sessionUser.role === 'user') {
            setCurrentView('profiles');
        }
    }
  }, []);

  // Load profiles
  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  const handleLoginSuccess = (loggedInUser: AuthUser) => {
      setUser(loggedInUser);
      if (loggedInUser.role === 'user') {
          setCurrentView('profiles');
      } else {
          setCurrentView('dashboard');
      }
  };

  const handleLogout = () => {
      logout();
      setUser(null);
      setCurrentView('dashboard'); // Reset view for next login (though it will show login screen)
  };

  const handleAddProfile = (profileData: Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>) => {
    const newProfile = addProfile(profileData);
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  };

  const handleUpdateProfile = (id: string, updates: Partial<WebNfcProfile>) => {
    updateProfile(id, updates);
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm('Are you sure you want to remove this NFC profile?')) {
      deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // If not logged in, show Login Screen
  if (!user) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-4 z-40 justify-between">
        <div className="flex items-center gap-2 font-bold text-indigo-600">
          <ShieldCheck size={24} />
          <span>NFC Admin</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-slate-600">
            {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-white font-bold text-xl">
            <ShieldCheck className="text-indigo-400" />
            NFC Admin
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
            {/* Only Admin sees Dashboard */}
            {user.role === 'admin' && (
                <button 
                    onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </button>
            )}
            
            <button 
                onClick={() => { setCurrentView('profiles'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'profiles' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
                <List size={20} />
                {user.role === 'admin' ? 'Manage Pages' : 'My Profile'}
            </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
             <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-white truncate">{user.username}</p>
                    <p className="text-xs text-slate-500 uppercase">{user.role}</p>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white" title="Logout">
                    <LogOut size={18} />
                </button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0 h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {currentView === 'dashboard' && user.role === 'admin' && (
                <Dashboard 
                    profiles={profiles} 
                    onNavigateToManager={() => setCurrentView('profiles')} 
                />
            )}
            {currentView === 'profiles' && (
                <ProfileManager 
                    profiles={profiles} 
                    currentUser={user}
                    onAdd={handleAddProfile} 
                    onDelete={handleDeleteProfile}
                    onUpdate={handleUpdateProfile}
                />
            )}
        </div>
      </main>
    </div>
  );
}
