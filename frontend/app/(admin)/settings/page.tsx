'use client';
import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  Save,
  Moon,
  Sun,
  Globe,
  Zap,
  Download,
  Loader2
} from 'lucide-react';
import Toast from '@/components/ui/Toast';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Real Local State for Settings
  const [workspaceName, setWorkspaceName] = useState('Atelier Inventory');
  const [accentColor, setAccentColor] = useState('bg-zinc-900');
  const [isExporting, setIsExporting] = useState(false);
  
  const [alerts, setAlerts] = useState({
    stock: true,
    revenue: true,
    supplier: false
  });

  const handleSave = () => {
    setToastMsg(`Configuration for ${workspaceName} saved successfully!`);
    setShowToast(true);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMsg('All Entries exported to CSV successfully!');
      setShowToast(true);
    }, 2000);
  };

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SECTIONS = [
    { id: 'security', icon: Shield, label: 'Security & Access', desc: 'Secure the vault with multi-layered master keys and role permissions.' },
    { id: 'alerts', icon: Bell, label: 'Audit Alerts', desc: 'Manage your stock thresholds and automated revenue notifications.' },
    { id: 'branding', icon: Palette, label: 'Atelier Branding', desc: 'Tailor the visual soul of your inventory system to match your brand.' },
    { id: 'data', icon: Database, label: 'Data Governance', desc: 'Exports, backups, and structural ledger integrity management.' },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {!selectedSection ? (
        <div className="animate-fade-in space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">System Settings</h1>
            <p className="text-zinc-500 font-medium tracking-tight">Customize your atelier operations and global preferences.</p>
          </div>

          <div className="grid gap-6">
            {SECTIONS.map((item) => (
              <section 
                key={item.id} 
                onClick={() => setSelectedSection(item.id)}
                className="p-8 bg-white dark:bg-gray-500 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-sm flex items-center gap-8 group hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-zinc-900 dark:hover:border-l-blue-500"
              >
                <div className="w-16 h-16 rounded-[24px] bg-zinc-50 dark:bg-gray-500 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <item.icon className="w-7 h-7" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{item.label}</h3>
                  <p className="text-zinc-400 text-xs font-medium max-w-md">{item.desc}</p>
                </div>
                <button className="bg-zinc-50 dark:bg-gray-500 text-zinc-900 dark:text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 dark:hover:bg-zinc-700 hover:text-white transition-all">Configure</button>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-slide-in space-y-12 pb-20">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Overview
            </button>
            <button 
              onClick={handleSave}
              className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-colors shadow-lg shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-[10px]"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

          <div className="bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-2xl overflow-hidden p-12">
            {selectedSection === 'branding' && (
              <div className="space-y-12">
                <div>
                   <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Atelier Branding</h2>
                   <p className="text-zinc-400 font-medium">Fine-tune the visual identity of your portal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Workspace Name</label>
                      <input 
                        type="text" 
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Atelier Inventory" 
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-gray-500 text-zinc-900 dark:text-white rounded-2xl border-none font-bold focus:ring-2 focus:ring-zinc-900 dark:focus:ring-blue-500 transition-all outline-none" 
                      />
                   </div>
                   <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Accent Color Profile</label>
                      <div className="flex gap-3">
                         {['bg-zinc-900', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-emerald-600'].map(c => (
                           <button 
                             key={c} 
                             onClick={() => setAccentColor(c)}
                             className={`w-10 h-10 ${c} rounded-full border-4 ${accentColor === c ? 'border-amber-400' : 'border-zinc-50 dark:border-gray-500/30'} hover:scale-110 transition-all`}
                           ></button>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="pt-10 border-t border-zinc-50 dark:border-gray-500/30 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-gray-500 rounded-2xl flex items-center justify-center">
                        {theme === 'light' ? <Sun className="w-6 h-6 text-orange-500" /> : <Moon className="w-6 h-6 text-blue-500" />}
                      </div>
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white">Theme Mode</p>
                         <p className="text-xs text-zinc-400 font-medium tracking-tight uppercase tracking-wider">{theme} mode active</p>
                      </div>
                   </div>
                   <div className="flex bg-zinc-100 dark:bg-gray-500 p-1 rounded-2xl">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white dark:bg-zinc-700 shadow-md text-zinc-900 dark:text-white font-bold' : 'text-zinc-400'}`}
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-900 dark:bg-white shadow-md text-white dark:text-white font-bold' : 'text-zinc-400'}`}
                      >
                        <Moon className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            )}

            {selectedSection === 'security' && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-serif italic tracking-tight">Identity & Vault</h2>
                  <p className="text-zinc-400 font-medium">Manage master access keys and administrative credentials.</p>
                </div>
                <div className="space-y-8">
                   <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-6">
                      <div className="w-12 h-12 bg-white dark:bg-gray-500 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Lock className="w-6 h-6" /></div>
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white">Change Master Password</p>
                         <p className="text-xs text-zinc-400 font-medium">Update your digital vault key regularly for security.</p>
                      </div>
                      <button onClick={handleSave} className="ml-auto bg-white dark:bg-gray-500 border border-blue-200 dark:border-zinc-700 text-blue-600 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Update</button>
                   </div>
                   <div className="p-6 bg-zinc-50 dark:bg-gray-500/50 rounded-3xl border border-zinc-100 dark:border-gray-500/30 flex items-center gap-6 opacity-60">
                      <div className="w-12 h-12 bg-white dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 shadow-sm"><Smartphone className="w-6 h-6" /></div>
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white">Multi-Factor Authentication</p>
                         <p className="text-xs text-zinc-400 font-medium">Add an extra layer of protection via mobile device.</p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Coming Soon</span>
                   </div>
                </div>
              </div>
            )}

            {selectedSection === 'alerts' && (
              <div className="space-y-12">
                <div>
                   <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Audit Notifications</h2>
                   <p className="text-zinc-400 font-medium">Stay informed on stock levels and financial milestones.</p>
                </div>
                <div className="grid gap-6">
                   <div className="flex items-center justify-between p-6 bg-zinc-50/50 dark:bg-gray-500/50 rounded-[32px] border border-zinc-100 dark:border-gray-500/30">
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700">Critical Stock Alerts</p>
                         <p className="text-xs text-zinc-400 font-medium">Notify when fabrics fall below 5 meters threshold</p>
                      </div>
                      <div onClick={() => toggleAlert('stock')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${alerts.stock ? 'bg-zinc-900 dark:bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                         <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${alerts.stock ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-6 bg-zinc-50/50 dark:bg-gray-500/50 rounded-[32px] border border-zinc-100 dark:border-gray-500/30">
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700">Revenue Milestones</p>
                         <p className="text-xs text-zinc-400 font-medium">Weekly summary of financial ledger activity</p>
                      </div>
                      <div onClick={() => toggleAlert('revenue')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${alerts.revenue ? 'bg-zinc-900 dark:bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                         <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${alerts.revenue ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-6 bg-zinc-50/50 dark:bg-gray-500/50 rounded-[32px] border border-zinc-100 dark:border-gray-500/30">
                      <div>
                         <p className="font-bold text-zinc-900 dark:text-white underline-offset-4 decoration-zinc-200 dark:decoration-zinc-700">Supplier Overdue</p>
                         <p className="text-xs text-zinc-400 font-medium">Alert when purchase orders exceed expected delivery date</p>
                      </div>
                      <div onClick={() => toggleAlert('supplier')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${alerts.supplier ? 'bg-zinc-900 dark:bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                         <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${alerts.supplier ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {selectedSection === 'data' && (
              <div className="space-y-12">
                <div>
                   <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Data Governance</h2>
                   <p className="text-zinc-400 font-medium">Export assets and manage system integrity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-zinc-50 dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500/30 space-y-4">
                      <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white"><Download className="w-6 h-6 shadow-sm" /></div>
                      <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Full Ledger Export</h4>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">Download your entire transaction history, customer debts, and stock value as a structural CSV.</p>
                      <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-4 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-900 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                         {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                         {isExporting ? 'Exporting...' : 'Initialize Export'}
                      </button>
                   </div>
                   <div className="p-8 bg-zinc-900 dark:bg-blue-900/20 rounded-[40px] text-white space-y-4 shadow-2xl relative overflow-hidden group border border-transparent dark:border-blue-900/30">
                      <div className="w-12 h-12 bg-gray-500/30 rounded-2xl flex items-center justify-center text-blue-400"><Zap className="w-6 h-6" /></div>
                      <h4 className="font-bold uppercase tracking-tight">Cloud Backup</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">Automatic daily synchronization is currently active. 7 Restore points available.</p>
                      <button 
                        onClick={() => { setToastMsg('Manual sync started...'); setShowToast(true); }}
                        className="w-full py-4 bg-gray-500/30 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-zinc-900 transition-all z-10 relative"
                      >
                        Verify Sync
                      </button>
                      <Database className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity" />
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />
    </div>
  );
}
