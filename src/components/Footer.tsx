import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';

export const Footer: React.FC = () => {
  const { userProfile } = useCockpit();

  return (
    <footer className="mt-6 border-t border-slate-800/80 bg-[#060b19] text-slate-400 py-4 px-6">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Quote banner matching reference image */}
        <div className="flex items-center gap-2 text-slate-200 text-xs md:text-sm font-medium italic">
          <span className="text-2xl text-emerald-400 font-serif leading-none font-black">“</span>
          <span>
            Cada dado é um aluno. Cada indicador é uma oportunidade. Cada ação é um futuro melhor.
          </span>
          <span className="font-bold text-sky-400 not-italic ml-2 text-xs">#EducaçãoQueTransforma</span>
        </div>

        {/* Municipality brand watermark badge from screenshot */}
        <div className="flex items-center gap-2.5 opacity-90">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-[#060b19] rounded-[6px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-left">
            <span className="font-black uppercase tracking-widest text-amber-400 block text-[11px] leading-tight">
              EDUCAÇÃO QUE TRANSFORMA
            </span>
            <span className="font-extrabold uppercase tracking-widest text-amber-300/80 block text-[10px] leading-tight">
              FUTUROS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

