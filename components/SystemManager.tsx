
import React, { useState, useEffect } from 'react';
import { Users, Save, Database, Upload, Download, Trash2, Edit2, Plus, X, Check, Shield } from 'lucide-react';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../services/authService';
import { exportSystemData, importSystemData } from '../services/mockService';
import { WebNfcProfile, UserRole } from '../types';

interface SystemManagerProps {
    profiles: WebNfcProfile[];
}

export const SystemManager: React.FC<SystemManagerProps> = ({ profiles }) => {
    const [activeTab, setActiveTab] = useState<'accounts' | 'data'>('accounts');
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({ username: '', password: '', role: 'account', allowedProfileIds: [] });
    
    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = () => {
        setAccounts(getAccounts());
    };

    const handleSaveAccount = () => {
        if (!editForm.username || !editForm.password) return alert("Vui lòng nhập tên đăng nhập và mật khẩu");
        
        if (editForm.id) {
            updateAccount(editForm.id, editForm);
        } else {
            const success = createAccount(editForm);
            if (!success) return alert("Tên đăng nhập đã tồn tại");
        }
        setIsEditing(false);
        setEditForm({ username: '', password: '', role: 'account', allowedProfileIds: [] });
        loadAccounts();
    };

    const handleDeleteAccount = (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
            deleteAccount(id);
            loadAccounts();
        }
    };

    const openEdit = (acc: any) => {
        setEditForm({ ...acc });
        setIsEditing(true);
    };

    const handleExport = () => {
        const data = exportSystemData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nfc_system_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            if (importSystemData(content)) {
                alert("Khôi phục dữ liệu thành công! Trang sẽ được tải lại.");
                window.location.reload();
            } else {
                alert("File không hợp lệ.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Hệ Thống</h2>
                    <p className="text-slate-500">Quản lý tài khoản và sao lưu dữ liệu.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('accounts')} 
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'accounts' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Tài Khoản
                    </button>
                    <button 
                        onClick={() => setActiveTab('data')} 
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'data' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Dữ Liệu
                    </button>
                </div>
            </div>

            {activeTab === 'accounts' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2"><Users className="text-indigo-600"/> Danh sách người dùng</h3>
                        <button onClick={() => { setEditForm({ username: '', password: '', role: 'account', allowedProfileIds: [] }); setIsEditing(true); }} className="bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-emerald-700">
                            <Plus size={16}/> Thêm User
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Password</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Access</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {accounts.map(acc => (
                                    <tr key={acc.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">{acc.username}</td>
                                        <td className="px-4 py-3 text-slate-400 font-mono">••••••</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${acc.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : acc.role === 'sales' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{acc.role}</span></td>
                                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">
                                            {acc.role === 'sales' ? (acc.allowedProfileIds?.length ? `${acc.allowedProfileIds.length} profiles` : 'None') : 'All'}
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => openEdit(acc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDeleteAccount(acc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isEditing && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
                                <h3 className="text-xl font-bold mb-4">{editForm.id ? 'Sửa tài khoản' : 'Tạo tài khoản mới'}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                                        <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} className="w-full border p-2 rounded"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                                        <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full border p-2 rounded"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Vai trò (Role)</label>
                                        <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})} className="w-full border p-2 rounded">
                                            <option value="account">Account (Xem Tools)</option>
                                            <option value="sales">Sales (Quản lý Profile được gán)</option>
                                            <option value="admin">Admin (Toàn quyền)</option>
                                        </select>
                                    </div>
                                    {editForm.role === 'sales' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Gán Profile quản lý</label>
                                            <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                                                {profiles.map(p => (
                                                    <label key={p.id} className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={editForm.allowedProfileIds?.includes(p.id)} 
                                                            onChange={(e) => {
                                                                const current = editForm.allowedProfileIds || [];
                                                                if (e.target.checked) setEditForm({...editForm, allowedProfileIds: [...current, p.id]});
                                                                else setEditForm({...editForm, allowedProfileIds: current.filter((id:string) => id !== p.id)});
                                                            }}
                                                            className="rounded text-indigo-600"
                                                        />
                                                        <span className="text-sm">{p.name} <span className="text-slate-400 text-xs">({p.slug})</span></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
                                    <button onClick={handleSaveAccount} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Lưu</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'data' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4"><Download size={24}/></div>
                        <h3 className="text-lg font-bold mb-2">Sao lưu dữ liệu (Backup)</h3>
                        <p className="text-slate-500 text-sm mb-6">Tải xuống toàn bộ dữ liệu Profiles và Tài khoản dưới dạng file JSON. Bạn có thể dùng file này để chuyển dữ liệu sang máy khác.</p>
                        <button onClick={handleExport} className="w-full py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2">
                            <Download size={18}/> Tải về máy (.json)
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4"><Upload size={24}/></div>
                        <h3 className="text-lg font-bold mb-2">Khôi phục dữ liệu (Restore)</h3>
                        <p className="text-slate-500 text-sm mb-6">Chọn file JSON đã sao lưu để khôi phục dữ liệu. <span className="text-red-500 font-medium">Cảnh báo: Dữ liệu hiện tại trên máy này sẽ bị ghi đè.</span></p>
                        <label className="w-full py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <Upload size={18}/> Chọn file khôi phục
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                    </div>

                    <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-4">
                        <div className="flex-shrink-0 text-blue-500 mt-1"><Database size={20}/></div>
                        <div>
                            <h4 className="font-bold text-blue-800 text-sm mb-1">Cách đồng bộ dữ liệu giữa các thiết bị</h4>
                            <p className="text-sm text-blue-700">Hiện tại hệ thống chạy cục bộ trên trình duyệt. Để xem dữ liệu trên máy khác:</p>
                            <ol className="list-decimal list-inside text-sm text-blue-700 mt-1 pl-1 space-y-1">
                                <li>Trên máy cũ: Vào mục <strong>Sao lưu dữ liệu</strong> và tải file về.</li>
                                <li>Gửi file này sang máy mới (qua Zalo, Email, USB...).</li>
                                <li>Trên máy mới: Vào mục <strong>Khôi phục dữ liệu</strong> và chọn file vừa tải.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
