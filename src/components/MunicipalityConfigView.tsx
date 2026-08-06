import React, { useState } from 'react';
import { useCockpit } from '../context/CockpitContext';
import { PRESET_MUNICIPALITIES, lookupOrGenerateMunicipalityConfig } from '../data/municipalityPresets';
import { MunicipalityConfig } from '../types';
import { GoalPlanningView } from './GoalPlanningView';
import {
  Building2,
  MapPin,
  Save,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  School,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Sliders,
  DollarSign,
  Info,
  Wand2,
  Target
} from 'lucide-react';

export const MunicipalityConfigView: React.FC = () => {
  const {
    municipalityConfig,
    setMunicipalityConfig,
    userProfile,
    setUserProfile,
    setActiveTab
  } = useCockpit();

  const [subTab, setSubTab] = useState<'metas' | 'municipio'>('metas');
  const [formConfig, setFormConfig] = useState<MunicipalityConfig>(municipalityConfig);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    PRESET_MUNICIPALITIES.find((m) => m.name.toLowerCase() === municipalityConfig.name.toLowerCase())?.id || 'custom'
  );
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isAutoFilledNotice, setIsAutoFilledNotice] = useState(false);

  // Auto-fill when name or UF changes
  const handleNameChange = (newName: string) => {
    const updated = lookupOrGenerateMunicipalityConfig(newName, formConfig.uf);
    setFormConfig(updated);
    setIsAutoFilledNotice(true);

    const matchPreset = PRESET_MUNICIPALITIES.find(
      (p) => p.name.toLowerCase() === newName.trim().toLowerCase()
    );
    if (matchPreset) {
      setSelectedPresetId(matchPreset.id);
    } else {
      setSelectedPresetId('custom');
    }
  };

  const handleUfChange = (newUf: string) => {
    const updated = lookupOrGenerateMunicipalityConfig(formConfig.name, newUf);
    setFormConfig(updated);
    setIsAutoFilledNotice(true);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') {
      return;
    }
    const preset = PRESET_MUNICIPALITIES.find((p) => p.id === presetId);
    if (preset) {
      setFormConfig(preset);
      setIsAutoFilledNotice(true);
    }
  };

  const handleForceAutoFill = () => {
    const auto = lookupOrGenerateMunicipalityConfig(formConfig.name, formConfig.uf);
    setFormConfig(auto);
    setIsAutoFilledNotice(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMunicipalityConfig(formConfig);
    setUserProfile({
      ...userProfile,
      municipality: formConfig.name,
      role: 'Secretário(a) de Educação'
    });

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 4000);
  };

  const handleResetDefault = () => {
    const defaultVal = PRESET_MUNICIPALITIES[0];
    setFormConfig(defaultVal);
    setSelectedPresetId(defaultVal.id);
  };

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto pb-12 animate-fade-in">
      {/* Configuration Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-[#0b1329] border border-slate-800 p-1.5 rounded-2xl max-w-2xl">
        <button
          onClick={() => setSubTab('metas')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            subTab === 'metas'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-950/50 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4" />
          🎯 Planejamento de Metas (Glide Path & Copilot IA)
        </button>

        <button
          onClick={() => setSubTab('municipio')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            subTab === 'municipio'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950/50 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          🏛️ Parâmetros do Município & Rede
        </button>
      </div>

      {subTab === 'metas' ? (
        <GoalPlanningView />
      ) : (
        <>
          {/* Toast Notification */}
          {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border-2 border-emerald-500 text-emerald-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-black text-sm text-white">Município Configurado com Sucesso!</h4>
            <p className="text-xs text-emerald-200">
              O painel foi atualizado para atuar em <strong>{formConfig.name} - {formConfig.uf}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Header & Intro */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#0f1d42] to-[#081024] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Configuração do Sistema
              </span>
              <span className="text-xs font-mono text-slate-400">Multi-Município Ativo</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              MUNICÍPIO DE ATUAÇÃO E PARÂMETROS DA REDE
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Defina qual município este Painel de Inteligência Educacional está gerando diagnósticos, monitorando escolas e calculando repasses de recursos federais. Todas as tabelas, alertas e relatórios filtram automaticamente os dados do município configurado aqui.
            </p>
          </div>

          {/* Active Municipality Card Badge */}
          <div className="bg-[#060b19]/90 border-2 border-amber-500/60 rounded-2xl p-4 shrink-0 text-right space-y-1 shadow-xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              MUNICÍPIO PROGRAMADO NO PAINEL
            </span>
            <div className="text-lg font-black text-amber-300 flex items-center justify-end gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>{municipalityConfig.name} - {municipalityConfig.uf}</span>
            </div>
            <div className="text-xs text-slate-300 font-medium flex items-center justify-end gap-3 pt-1 border-t border-slate-800">
              <span>🏫 {municipalityConfig.totalSchools} Escolas</span>
              <span>🎓 {municipalityConfig.totalStudents.toLocaleString('pt-BR')} Alunos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Selection Strip */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Selecione um Município Pré-Carregado ou Personalize</span>
          </h3>
          <span className="text-xs text-slate-400">Clique em um município para carregar sua estrutura</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {PRESET_MUNICIPALITIES.map((preset) => {
            const isSelected = selectedPresetId === preset.id && formConfig.name === preset.name;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10'
                    : 'bg-[#060b19] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-xs truncate text-white">{preset.name}</div>
                  <div className="text-[10px] text-slate-400">{preset.uf} • {preset.region}</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-1">
                  <span>{preset.totalSchools} Escolas</span>
                  <span className="font-bold text-amber-400">{preset.totalStudents.toLocaleString('pt-BR')} al.</span>
                </div>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handleSelectPreset('custom')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-center items-center h-20 text-center ${
              selectedPresetId === 'custom'
                ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                : 'bg-[#060b19] border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <Sparkles className="w-5 h-5 text-sky-400 mb-1" />
            <span className="font-bold text-xs">Novo Município</span>
            <span className="text-[9px] text-slate-500">Digitar do zero</span>
          </button>
        </div>
      </div>

      {/* Auto-fill notification alert */}
      {isAutoFilledNotice && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500/60 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-200 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Wand2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">Informações Carregadas Automática via MEC/IBGE!</strong>
              <span>Código INEP ({formConfig.inepCode}), SIOPE ({formConfig.siopeCode}), CNPJ, orçamento e estatísticas de matrículas ({formConfig.totalStudents.toLocaleString('pt-BR')} alunos) foram preenchidos.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg font-mono text-[10px] text-emerald-300 font-bold shrink-0">
            AUTO-FILL OK
          </span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Dados Cadastrais da Prefeitura & Secretaria de Educação
              </h3>
              <p className="text-xs text-slate-400">Digite o nome e a UF para carregar automaticamente todas as outras informações</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleForceAutoFill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/40 transition"
              title="Recalcular parâmetros automaticamente para este município"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-Preencher</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {/* Datalist for municipality suggestions */}
        <datalist id="municipality-list">
          {PRESET_MUNICIPALITIES.map((p) => (
            <option key={p.id} value={p.name}>
              {p.uf} - {p.region}
            </option>
          ))}
        </datalist>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Nome do Município */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>Nome do Município *</span>
                <span className="text-[10px] text-amber-400 font-normal font-mono">(Auto-Preenchimento)</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                list="municipality-list"
                value={formConfig.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Valparaíso de Goiás, Goiânia, Recife, Sobral..."
                className="w-full bg-[#060b19] border-2 border-amber-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-bold shadow-inner"
              />
              <Sparkles className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none opacity-80 animate-pulse" />
            </div>
          </div>

          {/* Estado UF */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Estado (UF) *</span>
              <span className="text-[10px] text-emerald-400 font-normal font-mono">Auto INEP</span>
            </label>
            <select
              value={formConfig.uf}
              onChange={(e) => handleUfChange(e.target.value)}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
            >
              {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(
                (uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Região Geográfica */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Região Geográfica</span>
              <span className="text-[9px] text-slate-500">Automático</span>
            </label>
            <input
              type="text"
              value={formConfig.region}
              onChange={(e) => setFormConfig({ ...formConfig, region: e.target.value })}
              placeholder="Ex: Entorno do DF / Centro-Oeste"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Prefeito(a) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Prefeito(a) / Gestor(a)</span>
              <span className="text-[9px] text-slate-500">Automático</span>
            </label>
            <input
              type="text"
              value={formConfig.mayorName}
              onChange={(e) => setFormConfig({ ...formConfig, mayorName: e.target.value })}
              placeholder="Ex: Marcus Vinícius"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Secretário(a) de Educação */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Secretário(a) de Educação</span>
              <span className="text-[9px] text-slate-500">Automático</span>
            </label>
            <input
              type="text"
              value={formConfig.secretaryName}
              onChange={(e) => setFormConfig({ ...formConfig, secretaryName: e.target.value })}
              placeholder="Ex: Dr. Fernando Vasconcelos"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* CNPJ da Prefeitura */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
              <span>CNPJ da Prefeitura / SEDUC</span>
              <span className="text-[9px] text-slate-500 font-mono">Automático</span>
            </label>
            <input
              type="text"
              value={formConfig.cnpj}
              onChange={(e) => setFormConfig({ ...formConfig, cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Código INEP do Município */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
              <span>Código INEP do Município</span>
              <span className="text-[9px] text-amber-400 font-mono">Gerado (MEC)</span>
            </label>
            <input
              type="text"
              value={formConfig.inepCode}
              onChange={(e) => setFormConfig({ ...formConfig, inepCode: e.target.value })}
              placeholder="Ex: 5221858"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Código SIOPE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
              <span>Código SIOPE (MEC/FNDE)</span>
              <span className="text-[9px] text-slate-500 font-mono">Automático</span>
            </label>
            <input
              type="text"
              value={formConfig.siopeCode}
              onChange={(e) => setFormConfig({ ...formConfig, siopeCode: e.target.value })}
              placeholder="Ex: GO-522185"
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Total de Matrículas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Total de Matrículas (Alunos)</span>
              <span className="text-[9px] text-emerald-400 font-mono">Estimado Censo</span>
            </label>
            <input
              type="number"
              value={formConfig.totalStudents}
              onChange={(e) => setFormConfig({ ...formConfig, totalStudents: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Número de Escolas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Número de Escolas Municipais</label>
            <input
              type="number"
              value={formConfig.totalSchools}
              onChange={(e) => setFormConfig({ ...formConfig, totalSchools: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Total de Professores */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Docentes / Professores</label>
            <input
              type="number"
              value={formConfig.totalTeachers}
              onChange={(e) => setFormConfig({ ...formConfig, totalTeachers: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Estimativa Fundeb VAAT */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Estimativa Fundeb VAAT (R$)</label>
            <input
              type="number"
              value={formConfig.fundebVaatValue}
              onChange={(e) => setFormConfig({ ...formConfig, fundebVaatValue: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#060b19] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Explain Box */}
        <div className="bg-[#060b19] border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-white">Impacto das Alterações no Painel:</h5>
            <p className="leading-relaxed">
              Ao clicar em <strong>Salvar e Aplicar Configuração</strong>, a aplicação vai recalibrar o nome do município no cabeçalho, nas capas de exportação em PDF, nos relatórios do Radar de Recursos, no módulo de comparativo entre escolas e nos planos de ação da secretaria.
            </p>
          </div>
        </div>

        {/* Form Footer Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('cockpit')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
          >
            Voltar ao Cockpit
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar e Aplicar Configuração no Painel</span>
          </button>
        </div>
      </form>
      </>
      )}
    </div>
  );
};
