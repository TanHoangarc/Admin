import React, { useState, useRef } from 'react';
import { WebNfcProfile, BASE_URL_PREFIX, SocialLink, Project } from '../types';
import { 
  ExternalLink, Edit3, Trash2, Plus, Search, Settings, Download, X, 
  Link as LinkIcon, Image as ImageIcon, User, Phone, Copy, Save, 
  Briefcase, Globe, FileText, ArrowLeft, Layout, ChevronDown, QrCode
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: WebNfcProfile[];
  onAdd: (profileData: Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WebNfcProfile>) => void;
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

const DEFAULT_SOCIAL_URLS: Record<string, string> = {
    zalo: "https://zalo.me/",
    email: "mailto:@longhoanglogistics.com",
    map: "https://maps.app.goo.gl/ZSVFYotTCuGWNQmW8",
    website: "https://www.longhoanglogistics.com"
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
  "Leader Team Sale 1 Long Hoàng",
  "Leader Team Sale 2 Long Hoàng",
  "Leader Team Sale 3 Long Hoàng"
];

const DEFAULT_ROLES_EN = [
  "Account – Long Hoang Logistics Co.,ltd",
  "Documentation – Long Hoang Logistics Co.,ltd",
  "Sales Logistics – Long Hoang Logistics Co.,ltd",
  "Overseas Sales – Long Hoang Logistics Co.,ltd",
  "Overseas Manager – Long Hoang Logistics Co.,ltd",
  "Leader Team Sale 1 - Long Hoang Logistics Co.,ltd",
  "Leader Team Sale 2 - Long Hoang Logistics Co.,ltd",
  "Leader Team Sale 3 - Long Hoang Logistics Co.,ltd"
];

// Template for the generated HTML file
const generateHtmlTemplate = (profile: WebNfcProfile) => {
  // Map the current profile data to the structure expected by the new template
  const targetData = {
    id: profile.id,
    name: profile.name,
    phoneContact: profile.phoneNumber || '',
    zaloContact: profile.zaloNumber || '',
    assets: {
      avatar: profile.avatarUrl || 'https://i.ibb.co/4RKTydDT/Andy.jpg',
      avatarQr: profile.avatarUrl || '', 
      cover: profile.coverUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      roleIcon: "https://i.ibb.co/VY0kfHdv/Logo-Nhon-My-700x700-2-150x150.png",
      flagVi: "https://flagcdn.com/w40/vn.png",
      flagEn: "https://flagcdn.com/w40/us.png",
    },
    qrImages: {
      main: profile.mainQrUrl || profile.avatarUrl || '', 
      // In a real app, you might want dedicated QR fields. For now, we let the array handle custom QRs.
    },
    socialLinks: profile.socialLinks.map(link => ({
      id: link.id,
      label: link.label,
      iconUrl: link.iconUrl,
      href: link.url,
      qrImage: link.qrImageUrl
    })),
    projects: (profile.projects || []).map(p => ({
      id: p.id,
      title: p.name,
      thumbnail: p.imageUrl,
      description: p.description,
      images: p.detailImageUrls
    })),
    content: {
      vi: {
        title: profile.headerTitleVi || profile.name,
        subtitle: profile.title || '',
        description: (profile.bio || '').split('\n'),
        consultButton: "Đăng Ký Tư Vấn",
        roles: profile.footerRoleVi ? [profile.footerRoleVi] : [],
        saveContact: "Lưu Danh bạ",
        share: "Chia sẻ",
        scanQr: "Quét mã",
        close: "Đóng",
        projectsTitle: "Dự Án Tiêu Biểu",
        backToProjects: "Quay lại danh sách",
        consultationForm: { 
            title: "Yêu Cầu Báo Giá", 
            goodsType: "Loại Hàng hóa", 
            pol: "Cảng đi (POL)", 
            pod: "Cảng đến (POD)", 
            volume: "Khối lượng (Volume)", 
            submit: "Báo Giá Qua Zalo", 
            alertCopied: "Nội dung đã được copy! Vui lòng dán vào cuộc trò chuyện Zalo." 
        }
      },
      en: {
        title: profile.headerTitleEn || profile.headerTitleVi || profile.name,
        subtitle: profile.titleEn || profile.title || '',
        description: (profile.bioEn || profile.bio || '').split('\n'),
        consultButton: "Register for Consultation",
        roles: profile.footerRoleEn ? [profile.footerRoleEn] : (profile.footerRoleVi ? [profile.footerRoleVi] : []),
        saveContact: "Save Contact",
        share: "Share",
        scanQr: "Scan QR",
        close: "Close",
        projectsTitle: "Featured Projects",
        backToProjects: "Back to Projects",
        consultationForm: { 
            title: "Request Quotation", 
            goodsType: "Type of Goods", 
            pol: "Port of Loading", 
            pod: "Port of Discharge", 
            volume: "Volume", 
            submit: "Get Quote via Zalo", 
            alertCopied: "Content copied! Please paste into Zalo chat." 
        }
      }
    }
  };

  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#B2F2BB" />
    <title>NCV Card - ${profile.name}</title>
    
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <!-- Babel để dịch JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#B2F2BB',
              secondary: '#8b004f',
              accent: '#0033cc',
            },
            animation: {
              'fade-in': 'fadeIn 0.3s ease-out',
              'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
              fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
              slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
            }
          },
        },
      }
    </script>
    <style>
      body { background-color: #E5E5E5; margin: 0; padding: 0; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      const { useState, useEffect, useRef } = React;

      // --- ICONS (SVG Components) ---
      const Icons = {
        Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
        Share2: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
        Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
        Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
        Link2: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 0 1 0 10h-2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
        ScanLine: ({size=18}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>,
        X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
        Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>,
        AlertCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
        Container: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7.7c0-.8-.7-1.28-1.5-1.75L12 1l-8.5 4.95c-.8.47-1.5 1-1.5 1.75v8.6c0 .8.7 1.28 1.5 1.75L12 23l8.5-4.95c.8-.47 1.5-1 1.5-1.75z"/><path d="M2 7.7 12 13.44 22 7.7"/><path d="M12 22.96V13.44"/></svg>,
        Package: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
        Anchor: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>,
        Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
        Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
      };

      // --- CONFIG START ---
      // This object is dynamically populated by the builder
      const DEFAULT_PROFILE = ${JSON.stringify(targetData, null, 2)};
      // --- CONFIG END ---

      // --- COMPONENTS ---

      const ImageModal = ({ isOpen, imageUrl, onClose, onScanClick, title, description }) => {
        if (!isOpen || !imageUrl) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-gray-800">{title || 'QR Code'}</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition"><Icons.X /></button>
              </div>
              <div className="p-6 flex flex-col items-center justify-center bg-gray-50">
                <img src={imageUrl} alt="QR Display" className="w-64 h-64 object-contain rounded-lg shadow-lg border-4 border-white" />
                <p className="mt-4 text-sm text-gray-500 text-center">{description || 'Quét mã này để kết nối'}</p>
              </div>
              <div className="p-4 bg-white border-t flex gap-3">
                <button onClick={() => { window.open(imageUrl, '_blank'); }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"><Icons.Download /> <span>Lưu</span></button>
                {onScanClick && <button onClick={() => { onClose(); onScanClick(); }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-blue-200 shadow-lg"><Icons.ScanLine /> <span>Quét Mã</span></button>}
              </div>
            </div>
          </div>
        );
      };

      const QRScannerModal = ({ isOpen, onClose, label }) => {
        const videoRef = useRef(null);
        const [error, setError] = useState(null);

        useEffect(() => {
          let stream = null;
          if (isOpen) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
              .then(s => { stream = s; if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }})
              .catch(err => setError("Không thể truy cập camera. Vui lòng kiểm tra quyền hoặc sử dụng HTTPS."));
          }
          return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
        }, [isOpen]);

        if (!isOpen) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fade-in">
            <div className="relative w-full max-w-md h-full flex flex-col">
              <div className="flex justify-between items-center p-4 text-white bg-black bg-opacity-50 absolute top-0 w-full z-10">
                <h2 className="text-lg font-bold flex items-center gap-2"><Icons.Camera /> {label}</h2>
                <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><Icons.X /></button>
              </div>
              <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                {!error ? (
                  <>
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                    <div className="relative z-10 w-64 h-64 border-2 border-white/50 rounded-lg overflow-hidden"><div className="w-full h-1 bg-green-500 absolute top-0 animate-[scan_2s_infinite]"></div></div>
                  </>
                ) : <div className="text-white text-center p-4"><Icons.AlertCircle /><p className="mt-2">{error}</p></div>}
              </div>
            </div>
            <style>{\`@keyframes scan { 0% { top: 0%; opacity: 1; } 50% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }\`}</style>
          </div>
        );
      };

      const ConsultationModal = ({ isOpen, onClose, translations, zaloLink }) => {
        const [formData, setFormData] = useState({ goodsType: '', pol: '', pod: '', volume: '' });
        const [isCopied, setIsCopied] = useState(false);
        if (!isOpen) return null;
        
        const handleSubmit = async (e) => {
          e.preventDefault();
          const message = \`📢 *YÊU CẦU BÁO GIÁ*\\n📦 *\${translations.goodsType}:* \${formData.goodsType}\\n🚩 *\${translations.pol}:* \${formData.pol}\\n🏁 *\${translations.pod}:* \${formData.pod}\\n📊 *\${translations.volume}:* \${formData.volume}\`;
          try { await navigator.clipboard.writeText(message); setIsCopied(true); setTimeout(() => { window.open(zaloLink, '_blank'); setIsCopied(false); }, 1000); } 
          catch (err) { window.open(zaloLink, '_blank'); }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="bg-gradient-to-r from-[#8b004f] to-[#b20066] p-4 flex justify-between items-center text-white">
                <h2 className="text-lg font-bold flex items-center gap-2"><Icons.Container /> {translations.title}</h2>
                <button onClick={onClose}><Icons.X /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
                <div className="space-y-1"><label className="flex gap-2 text-sm font-medium"><Icons.Package /> {translations.goodsType}</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.goodsType} onChange={e => setFormData({...formData, goodsType: e.target.value})} /></div>
                <div className="space-y-1"><label className="flex gap-2 text-sm font-medium"><Icons.Anchor /> {translations.pol}</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.pol} onChange={e => setFormData({...formData, pol: e.target.value})} /></div>
                <div className="space-y-1"><label className="flex gap-2 text-sm font-medium"><Icons.Anchor /> {translations.pod}</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.pod} onChange={e => setFormData({...formData, pod: e.target.value})} /></div>
                <div className="space-y-1"><label className="flex gap-2 text-sm font-medium"><Icons.Box /> {translations.volume}</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} /></div>
                {isCopied && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">{translations.alertCopied}</div>}
                <button type="submit" className="w-full bg-[#0068FF] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"><Icons.Send /> {translations.submit}</button>
              </form>
            </div>
          </div>
        );
      };

      // --- MAIN HOME APP ---
      const App = () => {
        const [data] = useState(DEFAULT_PROFILE);
        const [lang, setLang] = useState('vi');
        const [qrOpen, setQrOpen] = useState(false);
        const [scanOpen, setScanOpen] = useState(false);
        const [consultOpen, setConsultOpen] = useState(false);
        const [activeQr, setActiveQr] = useState(null);

        const t = data.content[lang];

        const openQr = (url, title, desc) => { setActiveQr({url, title, desc}); setQrOpen(true); }
        
        const handleSaveContact = () => {
             const fullName = t.title || data.name;
             const phone = (data.phoneContact || "").replace(/\\s/g, '');
             const webObj = data.socialLinks.find(s => s.id === 'website');
             const website = webObj ? webObj.href : window.location.href;

             let vcard = "BEGIN:VCARD\\nVERSION:3.0\\n";
             vcard += \`FN:\${fullName}\\n\`;
             vcard += \`N:;\${fullName};;;\\n\`;
             if (phone) vcard += \`TEL;TYPE=CELL:\${phone}\\n\`;
             if (website) vcard += \`URL:\${website}\\n\`;
             vcard += "END:VCARD";

             const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = \`\${fullName.replace(/\\s+/g, '_')}.vcf\`;
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
        };

        return (
          <div className="min-h-screen bg-[#E5E5E5]">
            <div className="container max-w-md mx-auto bg-[#B2F2BB] min-h-screen sm:min-h-[calc(100vh-40px)] sm:my-5 sm:rounded-[30px] shadow-2xl overflow-hidden flex flex-col relative">
              
              {/* NAV */}
              <div className="bg-white/95 backdrop-blur z-30 flex items-center justify-between px-4 h-14 shadow-sm shrink-0 relative">
                <div className="flex flex-1 justify-center gap-6 h-full">
                   <button className="h-full flex flex-col justify-center px-2 text-sm font-bold uppercase text-[#8b004f] relative">
                      <div className="flex items-center gap-2"><Icons.Home /> Home</div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8b004f] rounded-t-full"></div>
                   </button>
                   {/* Optional: Link to a Project page if you have one, otherwise this is static */}
                   <a href="#" className="h-full flex flex-col justify-center px-2 text-sm font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors">
                      <div className="flex items-center gap-2"><Icons.Briefcase /> Project</div>
                   </a>
                </div>
                <div className="flex gap-2 absolute right-4">
                   <button onClick={() => setLang('vi')} className={\`w-7 h-5 rounded overflow-hidden transition-transform \${lang==='vi'?'ring-1 ring-green-500':'opacity-60'}\`}><img src={data.assets.flagVi} className="w-full h-full object-cover"/></button>
                   <button onClick={() => setLang('en')} className={\`w-7 h-5 rounded overflow-hidden transition-transform \${lang==='en'?'ring-1 ring-green-500':'opacity-60'}\`}><img src={data.assets.flagEn} className="w-full h-full object-cover"/></button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                <div className="w-full h-48 relative shrink-0">
                  <img src={data.assets.cover} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#B2F2BB] via-[#B2F2BB]/60 to-transparent"></div>
                </div>

                <div className="px-6 pb-6 text-center relative z-10 -mt-24 flex-1 animate-fade-in">
                   {/* Avatar */}
                   <div className="relative inline-block mb-2 group">
                      <div className="w-[240px] h-[240px] rounded-full border-4 border-white shadow-2xl overflow-hidden mx-auto bg-gray-200 relative z-10">
                         <img src={data.assets.avatar} className="w-full h-full object-cover" onClick={() => openQr(data.assets.avatar, t.title, '')}/>
                      </div>
                      <button onClick={() => openQr(data.qrImages.main, 'Personal QR')} className="absolute bottom-2 right-4 z-20 bg-white p-2 rounded-xl shadow-lg hover:scale-110 transition">
                          <img src={data.qrImages.main} className="w-14 h-14 object-contain" />
                          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full"><Icons.ScanLine size={12}/></div>
                      </button>
                   </div>
                   
                   <h1 className="text-2xl font-bold text-gray-800 mt-4">{t.title}</h1>
                   <p className="text-[#357] font-medium mb-6">{t.subtitle}</p>

                   {data.phoneContact && (
                   <a href={\`tel:\${data.phoneContact}\`} className="flex items-center justify-center gap-3 w-full bg-[#8b004f] text-white py-3.5 px-6 rounded-full shadow-lg hover:bg-[#700040] transition font-bold text-lg mb-6">
                      <Icons.Phone /> <span>{data.phoneContact}</span>
                   </a>
                   )}

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <button onClick={() => navigator.share ? navigator.share({title: t.title, url: window.location.href}) : alert('Copied!')} className="flex items-center justify-center gap-2 bg-gray-100/80 py-3 rounded-xl font-medium"><Icons.Share2 /> {t.share}</button>
                      <button onClick={handleSaveContact} className="flex items-center justify-center gap-2 bg-gray-100/80 py-3 rounded-xl font-medium"><Icons.Download /> {t.saveContact}</button>
                   </div>

                   <button onClick={() => setConsultOpen(true)} className="bg-[#0033cc] text-white px-8 py-3 rounded-xl font-bold shadow-lg w-full mb-6">{t.consultButton}</button>

                   <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 text-left shadow-sm mb-6">
                      <ul className="space-y-2 text-gray-800 text-sm">{t.description.map((l,i) => <li key={i} className="flex gap-2"><span className="text-green-600 font-bold">✓</span>{l}</li>)}</ul>
                   </div>

                   <div className="space-y-3 mb-8">
                      {t.roles.map((role, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#f0fff0] p-3 rounded-xl border border-green-100 shadow-sm">
                          <img src={data.assets.roleIcon} className="w-10 h-10 rounded-full" />
                          <span className="text-sm font-semibold text-gray-700 flex-1 text-left">{role}</span>
                          <Icons.Link2 className="text-gray-400"/>
                        </div>
                      ))}
                   </div>

                   <div className="grid grid-cols-4 gap-y-6 gap-x-2 mb-20">
                      {data.socialLinks.map(link => (
                        <button key={link.id} onClick={() => link.qrImage ? openQr(link.qrImage, link.label) : window.open(link.href, '_blank')} className="flex flex-col items-center group">
                           <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2 group-hover:scale-110 transition"><img src={link.iconUrl} className="w-10 h-10 object-contain"/></div>
                           <span className="text-xs font-medium text-gray-700">{link.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <ImageModal isOpen={qrOpen} imageUrl={activeQr?.url} title={activeQr?.title} description={activeQr?.desc} onClose={() => setQrOpen(false)} onScanClick={() => setScanOpen(true)} />
            <QRScannerModal isOpen={scanOpen} onClose={() => setScanOpen(false)} label={t.scanQr} />
            <ConsultationModal isOpen={consultOpen} onClose={() => setConsultOpen(false)} translations={t.consultationForm} zaloLink={\`https://zalo.me/\${data.zaloContact}\`} />
          </div>
        );
      };

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    </script>
  </body>
</html>`;
};

type Tab = 'general' | 'images' | 'content_vn' | 'content_en' | 'social' | 'projects';

export const ProfileManager: React.FC<ProfileManagerProps> = ({ profiles, onAdd, onDelete, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dynamic Lists State
  const [titlesList, setTitlesList] = useState<string[]>(DEFAULT_TITLES);
  const [rolesList, setRolesList] = useState<string[]>(DEFAULT_ROLES);
  
  const [titlesEnList, setTitlesEnList] = useState<string[]>(DEFAULT_TITLES);
  const [rolesEnList, setRolesEnList] = useState<string[]>(DEFAULT_ROLES_EN);

  // Form State
  const [formData, setFormData] = useState<Omit<WebNfcProfile, 'id' | 'visits' | 'interactions' | 'lastActive' | 'status' | 'fullUrl'>>({
    name: '',
    slug: '',
    title: '',
    bio: '',
    headerTitleVi: '',
    footerRoleVi: '',
    titleEn: '',
    bioEn: '',
    headerTitleEn: '',
    footerRoleEn: '',
    phoneNumber: '',
    zaloNumber: '',
    avatarUrl: '',
    coverUrl: '',
    mainQrUrl: '',
    socialLinks: [],
    projects: []
  });

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = () => {
    if (formData.name && formData.slug) {
      if (editingId) {
        let slug = formData.slug.trim();
        slug = slug.replace('https://', '').replace('http://', '').replace(BASE_URL_PREFIX, '');
        if (!slug.endsWith('.github.io')) {
           slug += '.github.io';
        }
        const fullUrl = `${BASE_URL_PREFIX}${slug}/`;

        onUpdate(editingId, { ...formData, slug, fullUrl });
      } else {
        onAdd(formData);
      }
      resetForm();
      setIsModalOpen(false);
    } else {
        alert("Please fill in at least the Name and Slug (General tab).");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
        name: '',
        slug: '',
        title: '',
        bio: '',
        headerTitleVi: '',
        footerRoleVi: '',
        titleEn: '',
        bioEn: '',
        headerTitleEn: '',
        footerRoleEn: '',
        phoneNumber: '',
        zaloNumber: '',
        avatarUrl: '',
        coverUrl: '',
        mainQrUrl: '',
        socialLinks: [],
        projects: []
    });
    setActiveTab('general');
  };

  const addSocialLink = (presetId: string) => {
    const preset = SOCIAL_PRESETS.find(p => p.id === presetId);
    const defaultUrl = DEFAULT_SOCIAL_URLS[presetId] || '';

    setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, {
            id: Date.now().toString(),
            platform: presetId as any,
            url: defaultUrl,
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
    setEditingId(profile.id);
    setFormData({
        name: profile.name,
        slug: profile.slug.replace('.github.io', ''),
        title: profile.title,
        bio: profile.bio,
        headerTitleVi: profile.headerTitleVi,
        footerRoleVi: profile.footerRoleVi,
        titleEn: profile.titleEn,
        bioEn: profile.bioEn,
        headerTitleEn: profile.headerTitleEn,
        footerRoleEn: profile.footerRoleEn,
        phoneNumber: profile.phoneNumber,
        zaloNumber: profile.zaloNumber,
        avatarUrl: profile.avatarUrl,
        coverUrl: profile.coverUrl,
        mainQrUrl: profile.mainQrUrl || '',
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

  const handleAddCustomTitle = () => {
      const newTitle = window.prompt("Nhập chức danh / tiêu đề mới:");
      if (newTitle && newTitle.trim()) {
          const trimmed = newTitle.trim();
          if (!titlesList.includes(trimmed)) {
              setTitlesList([...titlesList, trimmed]);
          }
          setFormData({ ...formData, title: trimmed });
      }
  };

  const handleAddCustomRole = () => {
      const newRole = window.prompt("Nhập chức vụ mới:");
      if (newRole && newRole.trim()) {
          const trimmed = newRole.trim();
          if (!rolesList.includes(trimmed)) {
              setRolesList([...rolesList, trimmed]);
          }
          setFormData({ ...formData, footerRoleVi: trimmed });
      }
  };

  const handleAddCustomTitleEn = () => {
      const newTitle = window.prompt("Enter new Job Title:");
      if (newTitle && newTitle.trim()) {
          const trimmed = newTitle.trim();
          if (!titlesEnList.includes(trimmed)) {
              setTitlesEnList([...titlesEnList, trimmed]);
          }
          setFormData({ ...formData, titleEn: trimmed });
      }
  };

  const handleAddCustomRoleEn = () => {
      const newRole = window.prompt("Enter new Footer Role:");
      if (newRole && newRole.trim()) {
          const trimmed = newRole.trim();
          if (!rolesEnList.includes(trimmed)) {
              setRolesEnList([...rolesEnList, trimmed]);
          }
          setFormData({ ...formData, footerRoleEn: trimmed });
      }
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
                    <h3 className="font-semibold text-lg">
                        {editingId ? 'Chỉnh sửa: ' : 'Tạo mới: '} {formData.name || 'User'}
                    </h3>
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
                        <span>{editingId ? 'Lưu Thay Đổi' : 'Tạo Profile'}</span>
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

                                    {/* NEW FIELD */}
                                    <div className="md:col-span-2 border-t border-slate-100 pt-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Main QR Code URL (Optional)</label>
                                        <div className="flex items-start gap-6">
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={formData.mainQrUrl || ''}
                                                    onChange={e => setFormData({...formData, mainQrUrl: e.target.value})}
                                                    placeholder="https://... (Link to your QR Code image)"
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Display this QR code when users click the QR button on your profile.</p>
                                            </div>
                                            <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                {formData.mainQrUrl ? (
                                                    <img src={formData.mainQrUrl} alt="QR Preview" className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400"><QrCode size={24} /></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Content VN */}
                        {activeTab === 'content_vn' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-emerald-800 border-b border-emerald-100 pb-4 mb-6">Nội dung Tiếng Việt</h4>
                                
                                <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mb-4 text-xs text-yellow-800">
                                    <strong>Lưu ý:</strong> "Tên tiêu đề" sẽ thay thế tên chính ở đầu trang.
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên tiêu đề (Tiêu đề trên cùng)</label>
                                    <input 
                                        type="text" 
                                        value={formData.headerTitleVi || ''}
                                        onChange={e => setFormData({...formData, headerTitleVi: e.target.value})}
                                        placeholder="Ví dụ: Lâm Ngọc Vũ"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Chức danh / Tiêu đề</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">-- Chọn Chức danh --</option>
                                            {titlesList.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                            {!titlesList.includes(formData.title) && formData.title && (
                                                <option value={formData.title}>{formData.title}</option>
                                            )}
                                        </select>
                                        <button 
                                            onClick={handleAddCustomTitle}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg border border-indigo-200 transition-colors"
                                            title="Thêm chức danh mới"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
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

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Chức vụ (Cuối trang)</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={formData.footerRoleVi || ''}
                                            onChange={e => setFormData({...formData, footerRoleVi: e.target.value})}
                                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">-- Chọn Chức vụ --</option>
                                            {rolesList.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                            {!rolesList.includes(formData.footerRoleVi || '') && formData.footerRoleVi && (
                                                <option value={formData.footerRoleVi}>{formData.footerRoleVi}</option>
                                            )}
                                        </select>
                                        <button 
                                            onClick={handleAddCustomRole}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg border border-indigo-200 transition-colors"
                                            title="Thêm chức vụ mới"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Content EN */}
                        {activeTab === 'content_en' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h4 className="text-lg font-bold text-indigo-800 border-b border-indigo-100 pb-4 mb-6">English Content</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Header Title (Top)</label>
                                    <input 
                                        type="text" 
                                        value={formData.headerTitleEn || ''}
                                        onChange={e => setFormData({...formData, headerTitleEn: e.target.value})}
                                        placeholder="e.g. Mr. Andy"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={formData.titleEn || ''}
                                            onChange={e => setFormData({...formData, titleEn: e.target.value})}
                                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">-- Select Job Title --</option>
                                            {titlesEnList.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                            {!titlesEnList.includes(formData.titleEn || '') && formData.titleEn && (
                                                <option value={formData.titleEn}>{formData.titleEn}</option>
                                            )}
                                        </select>
                                        <button 
                                            onClick={handleAddCustomTitleEn}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg border border-indigo-200 transition-colors"
                                            title="Add new Job Title"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
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

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Footer Role (Bottom)</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={formData.footerRoleEn || ''}
                                            onChange={e => setFormData({...formData, footerRoleEn: e.target.value})}
                                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">-- Select Footer Role --</option>
                                            {rolesEnList.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                            {!rolesEnList.includes(formData.footerRoleEn || '') && formData.footerRoleEn && (
                                                <option value={formData.footerRoleEn}>{formData.footerRoleEn}</option>
                                            )}
                                        </select>
                                        <button 
                                            onClick={handleAddCustomRoleEn}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg border border-indigo-200 transition-colors"
                                            title="Add new Footer Role"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
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
