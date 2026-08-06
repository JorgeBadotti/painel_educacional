import React, { useState } from 'react';
import { X, UserCheck, KeyRound, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { UserProfile } from '../types';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile } = useCockpit();

  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [municipality, setMunicipality] = useState(userProfile.municipality);
  const [email, setEmail] = useState(userProfile.email);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      name,
      role: role as any,
      email,
      municipality,
    });
    onClose();
  };

  const presetProfiles: UserProfile[] = [
    {
      name: 'Dr. Fernando Vasconcelos',
      role: 'Secretário(a) de Educação',
      email: 'secretario@educacao.gov.br',
      municipality: 'Valparaíso de Goiás',
    },
    {
      name: 'Profa. Marta Regina Costa',
      role: 'Diretor(a) Escolar',
      email: 'marta.costa@escola.gov.br',
      municipality: 'Valparaíso de Goiás',
    },
    {
      name: 'Prof. Carlos Eduardo Mendes',
      role: 'Coordenador(a) Pedagógico(a)',
      email: 'carlos.mendes@pedagogico.gov.br',
      municipality: 'Valparaíso de Goiás',
    },
    {
      name: 'Eng. Lucas Alencar',
      role: 'Técnico(a) de TI',
      email: 'ti@educacao.gov.br',
      municipality: 'Valparaíso de Goiás',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-[#0b132a] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold uppercase text-slate-100">
              Perfil do Usuário & Permissões
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selectors */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Simular Perfil de Acesso Predefinido
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setName(p.name);
                  setRole(p.role);
                  setEmail(p.email);
                  setMunicipality(p.municipality);
                }}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  role === p.role ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold truncate">{p.name}</div>
                <div className="text-[9px] text-slate-400 truncate">{p.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSave} className="space-y-3 text-xs pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Cargo / Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="Secretário(a) de Educação">Secretário(a) de Educação</option>
              <option value="Diretor(a) Escolar">Diretor(a) Escolar</option>
              <option value="Coordenador(a) Pedagógico(a)">Coordenador(a) Pedagógico(a)</option>
              <option value="Técnico(a) de TI">Técnico(a) de TI</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Município da Prefeitura</label>
            <input
              type="text"
              required
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
