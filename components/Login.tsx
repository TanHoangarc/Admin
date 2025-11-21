
import React, { useState } from 'react';
import { ShieldCheck, User, Lock, LogIn, UserPlus } from 'lucide-react';
import { login, signup } from '../services/authService';
import { AuthUser } from '../types';

interface LoginProps {
    onLoginSuccess: (user: AuthUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (isLoginView) {
            const user = login(username, password, remember);
            if (user) {
                onLoginSuccess(user);
            } else {
                setError('Tài khoản hoặc mật khẩu không chính xác.');
            }
        } else {
            // Sign Up
            const created = signup(username, password);
            if (created) {
                setSuccessMsg('Tạo tài khoản thành công! Vui lòng đăng nhập.');
                setIsLoginView(true);
                setPassword('');
            } else {
                setError('Tài khoản đã tồn tại.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
                <div className="w-full p-8">
                    <div className="text-center mb-8">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {isLoginView ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Hệ thống quản lý NFC Profile
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    
                    {successMsg && (
                        <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg text-center border border-emerald-100">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản / SĐT</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="Nhập tài khoản hoặc SĐT"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        {isLoginView && (
                            <div className="flex items-center">
                                <input 
                                    id="remember-me" 
                                    type="checkbox" 
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                        >
                            {isLoginView ? (
                                <>
                                    <LogIn size={20} /> Đăng Nhập
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} /> Đăng Ký
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-sm text-indigo-600 font-medium hover:underline"
                        >
                            {isLoginView ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
