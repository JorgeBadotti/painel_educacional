import React, { useState } from 'react';
import { GraduationCap, KeyRound, Mail, User, Building2, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = [
  'Secretário(a) de Educação',
  'Diretor(a) Escolar',
  'Coordenador(a) Pedagógico(a)',
  'Técnico(a) de TI',
  'Professor(a)',
];

export const LoginScreen: React.FC = () => {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [municipality, setMunicipality] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, role, municipality });
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0b132a] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">Cockpit de Inteligência Educacional</h1>
            <p className="text-xs text-slate-400">Acesso restrito a servidores da Secretaria de Educação.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-900 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg text-xs font-bold transition ${mode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg text-xs font-bold transition ${mode === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white"
                  placeholder="Dr. Fernando Vasconcelos"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white"
                placeholder="secretario@educacao.gov.br"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Senha</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Cargo / Função</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white appearance-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Município / Escola</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white"
                    placeholder="Valparaíso de Goiás"
                  />
                </div>
              </div>
            </>
          )}

          {(localError || error) && (
            <div className="p-2.5 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-[11px] font-medium">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-lg shadow-lg transition mt-1"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isSubmitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
