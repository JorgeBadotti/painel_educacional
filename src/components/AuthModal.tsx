import React from 'react';
import { X, UserCheck, Mail, Building2, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold uppercase text-slate-100">Perfil do Usuário</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-slate-400">{user.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{user.municipality}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Conta autenticada no servidor</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  );
};
