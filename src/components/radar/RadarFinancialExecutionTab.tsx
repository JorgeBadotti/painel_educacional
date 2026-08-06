import React, { useState } from 'react';
import { EducationResourceProgram, FinancialExecutionTransaction, FinancialRubricBreakdown } from '../../types/radar';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  PlusCircle,
  Laptop,
  Building2,
  BookOpen,
  Apple,
  Bus,
  GraduationCap,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

interface RadarFinancialExecutionTabProps {
  programs: EducationResourceProgram[];
  onUpdateProgram: (updatedProgram: EducationResourceProgram) => void;
  onSelectProgram?: (program: EducationResourceProgram) => void;
}

export const RadarFinancialExecutionTab: React.FC<RadarFinancialExecutionTabProps> = ({
  programs,
  onUpdateProgram,
  onSelectProgram,
}) => {
  // Filter only adhered / active programs with captured values
  const adheredPrograms = programs.filter(
    (p) => p.isAdhered || p.capturedValue || p.status === 'Aprovado'
  );

  const [selectedRubricFilter, setSelectedRubricFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyRiskDeadline, setOnlyRiskDeadline] = useState<boolean>(false);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  // Modal State for New Expense Transaction
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetProgram, setTargetProgram] = useState<EducationResourceProgram | null>(null);
  const [formRubric, setFormRubric] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formSupplier, setFormSupplier] = useState<string>('');
  const [formInvoice, setFormInvoice] = useState<string>('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [modalError, setModalError] = useState<string | null>(null);

  // Helper formatting currency
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // 1. Calculate Aggregated KPIs
  const totalCaptured = adheredPrograms.reduce((sum, p) => sum + (p.capturedValue || p.estimatedValue || 0), 0);
  const totalSpent = adheredPrograms.reduce((sum, p) => sum + (p.spentValue || 0), 0);
  const totalBalanceToSpend = totalCaptured - totalSpent;

  // Compute expiration risk programs (< 60 days to deadline with remaining balance > 0)
  const expiringPrograms = adheredPrograms.filter((p) => {
    const remaining = (p.capturedValue || p.estimatedValue || 0) - (p.spentValue || 0);
    return remaining > 0 && p.daysToDeadline <= 60;
  });

  const criticalExpiringCount = expiringPrograms.filter((p) => p.daysToDeadline <= 30).length;

  // 2. Aggregate breakdown per Rubric / Duto across all adhered programs
  const rubricStatsMap: Record<
    string,
    { name: string; icon: any; allocated: number; spent: number }
  > = {
    'TI & Informática': { name: 'TI & Informática', icon: Laptop, allocated: 0, spent: 0 },
    'Infraestrutura & Obras': { name: 'Infraestrutura & Obras', icon: Building2, allocated: 0, spent: 0 },
    'Material Pedagógico': { name: 'Material Pedagógico', icon: BookOpen, allocated: 0, spent: 0 },
    'Merenda Escolar': { name: 'Merenda & Alimentação Escolar', icon: Apple, allocated: 0, spent: 0 },
    'Transporte Escolar': { name: 'Transporte Escolar', icon: Bus, allocated: 0, spent: 0 },
    'Valorização do Magistério': { name: 'Valorização do Magistério', icon: GraduationCap, allocated: 0, spent: 0 },
    'Formação de Professores': { name: 'Formação & Capacitação', icon: GraduationCap, allocated: 0, spent: 0 },
    'Outros / Custeio Gerais': { name: 'Outros & Custeio Geral', icon: Wrench, allocated: 0, spent: 0 },
  };

  adheredPrograms.forEach((p) => {
    if (p.rubricBreakdown && p.rubricBreakdown.length > 0) {
      p.rubricBreakdown.forEach((rub) => {
        const key =
          Object.keys(rubricStatsMap).find((k) => k.toLowerCase() === rub.rubricName.toLowerCase()) ||
          (rub.rubricName.includes('TI') || rub.rubricName.includes('Informática')
            ? 'TI & Informática'
            : rub.rubricName.includes('Infraestrutura') || rub.rubricName.includes('Obras')
            ? 'Infraestrutura & Obras'
            : rub.rubricName.includes('Pedagógico') || rub.rubricName.includes('Material')
            ? 'Material Pedagógico'
            : rub.rubricName.includes('Merenda') || rub.rubricName.includes('Alimentação')
            ? 'Merenda Escolar'
            : rub.rubricName.includes('Transporte')
            ? 'Transporte Escolar'
            : rub.rubricName.includes('Magistério')
            ? 'Valorização do Magistério'
            : rub.rubricName.includes('Formação')
            ? 'Formação de Professores'
            : 'Outros / Custeio Gerais');

        rubricStatsMap[key].allocated += rub.allocatedValue;
        rubricStatsMap[key].spent += rub.spentValue;
      });
    } else {
      // Default fallback if rubricBreakdown is empty
      const catName = p.legalDestination?.category || 'Outros / Custeio Gerais';
      const key =
        catName.includes('Tecnologia')
          ? 'TI & Informática'
          : catName.includes('Infraestrutura')
          ? 'Infraestrutura & Obras'
          : catName.includes('Merenda')
          ? 'Merenda Escolar'
          : catName.includes('Transporte')
          ? 'Transporte Escolar'
          : catName.includes('Magistério')
          ? 'Valorização do Magistério'
          : catName.includes('Material') || catName.includes('Formação')
          ? 'Material Pedagógico'
          : 'Outros / Custeio Gerais';

      rubricStatsMap[key].allocated += p.capturedValue || p.estimatedValue || 0;
      rubricStatsMap[key].spent += p.spentValue || 0;
    }
  });

  // Filter list of programs according to user search and rubric criteria
  const filteredPrograms = adheredPrograms.filter((p) => {
    const matchesSearch =
      p.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organ.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.responsible.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = !onlyRiskDeadline || p.daysToDeadline <= 45;

    let matchesRubric = true;
    if (selectedRubricFilter !== 'todas') {
      if (p.rubricBreakdown && p.rubricBreakdown.length > 0) {
        matchesRubric = p.rubricBreakdown.some((r) =>
          r.rubricName.toLowerCase().includes(selectedRubricFilter.toLowerCase())
        );
      } else {
        matchesRubric = p.legalDestination?.category
          .toLowerCase()
          .includes(selectedRubricFilter.toLowerCase()) || false;
      }
    }

    return matchesSearch && matchesRisk && matchesRubric;
  });

  // Open Modal Handler
  const handleOpenExpenseModal = (program: EducationResourceProgram) => {
    setTargetProgram(program);
    setFormRubric(program.rubricBreakdown?.[0]?.rubricName || 'TI & Informática');
    setFormDescription('');
    setFormSupplier('');
    setFormInvoice('');
    setFormAmount('');
    setModalError(null);
    setIsModalOpen(true);
  };

  // Save Expense Handler
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProgram) return;

    const numAmount = parseFloat(formAmount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      setModalError('Informe um valor de despesa válido maior que zero.');
      return;
    }

    const currentCap = targetProgram.capturedValue || targetProgram.estimatedValue || 0;
    const currentSpent = targetProgram.spentValue || 0;
    const remainingBalance = currentCap - currentSpent;

    if (numAmount > remainingBalance) {
      setModalError(
        `O valor informado (R$ ${numAmount.toFixed(2)}) ultrapassa o saldo disponível do programa (${formatCurrency(
          remainingBalance
        )}).`
      );
      return;
    }

    // Build new transaction
    const newTx: FinancialExecutionTransaction = {
      id: `tx-${Date.now()}`,
      programId: targetProgram.id,
      date: formDate,
      description: formDescription || 'Lançamento de despesa executada',
      supplier: formSupplier || 'Fornecedor Cadastrado',
      rubricName: formRubric,
      amount: numAmount,
      invoiceNumber: formInvoice || undefined,
    };

    // Update rubric breakdown inside program
    const updatedRubrics = (targetProgram.rubricBreakdown || []).map((rub) => {
      if (rub.rubricName.toLowerCase() === formRubric.toLowerCase()) {
        return { ...rub, spentValue: rub.spentValue + numAmount };
      }
      return rub;
    });

    // If rubric didn't exist, append it
    if (!updatedRubrics.some((r) => r.rubricName.toLowerCase() === formRubric.toLowerCase())) {
      updatedRubrics.push({
        id: `rub-${Date.now()}`,
        rubricName: formRubric,
        allocatedValue: numAmount,
        spentValue: numAmount,
      });
    }

    const newTotalSpent = currentSpent + numAmount;

    const updatedProgram: EducationResourceProgram = {
      ...targetProgram,
      spentValue: newTotalSpent,
      rubricBreakdown: updatedRubrics,
      transactions: [newTx, ...(targetProgram.transactions || [])],
    };

    onUpdateProgram(updatedProgram);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Risk Alert Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d162d] to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" />
                Gestão de Verbas Aderidas & Execução Real
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                {adheredPrograms.length} Programas em Acompanhamento
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
              💰 Balanço Geral de Recursos Captados
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Monitore os recursos repassados ao município, o saldo disponível por duto de gasto (TI, Infraestrutura, Merenda) e o prazo limite de execução para evitar devolução de verbas ao FNDE.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (adheredPrograms.length > 0) {
                  handleOpenExpenseModal(adheredPrograms[0]);
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nova Despesa</span>
            </button>
          </div>
        </div>

        {/* Expiration Risk Banner Alert */}
        {criticalExpiringCount > 0 && (
          <div className="mt-4 p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-xl flex items-center justify-between gap-3 text-rose-200 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-rose-300 tracking-wide">
                  🚨 Alerta Crítico: {criticalExpiringCount} Verba(s) Aderida(s) Próxima(s) da Data Limite!
                </p>
                <p className="text-[11px] text-rose-200">
                  Os recursos não executados até o prazo final deverão ser devolvidos à União/FNDE com juros. Empenhe ou execute os saldos pendentes urgentemente.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOnlyRiskDeadline(!onlyRiskDeadline)}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-lg text-[11px] uppercase whitespace-nowrap shadow transition"
            >
              {onlyRiskDeadline ? 'Ver Todos' : 'Filtrar Críticos'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Repasse Total / Captado */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Captado / Aderido</span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalCaptured)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">100%</span> da verba pactuada via FNDE / MEC
          </p>
        </div>

        {/* KPI 2: Total Executado / Gasto */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Executado (Gasto)</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(totalSpent)}
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalSpent / Math.max(1, totalCaptured)) * 100))}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            <strong className="text-emerald-300">
              {((totalSpent / Math.max(1, totalCaptured)) * 100).toFixed(1)}%
            </strong>{' '}
            da verba executada e liquidada
          </p>
        </div>

        {/* KPI 3: Saldo Disponível A Gastar */}
        <div className="bg-[#0b1329] border border-amber-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#0b1329] to-amber-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Saldo Livre a Executar</span>
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            {formatCurrency(totalBalanceToSpend)}
          </p>
          <p className="text-[10px] text-amber-200/80 mt-1 flex items-center gap-1">
            <span>Disponível nos dutos de investimento</span>
          </p>
        </div>

        {/* KPI 4: Devolução / Risco Limite */}
        <div className="bg-[#0b1329] border border-rose-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#0b1329] to-rose-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">Risco de Devolução (Prazo)</span>
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
            {expiringPrograms.length} <span className="text-xs font-normal text-rose-200">Verbas &lt; 60 dias</span>
          </p>
          <p className="text-[10px] text-rose-300/80 mt-1">
            {criticalExpiringCount > 0 ? (
              <span className="text-rose-400 font-bold">⚠️ Ação urgente necessária em {criticalExpiringCount} programa(s)</span>
            ) : (
              'Prazos de execução dentro da margem de segurança'
            )}
          </p>
        </div>
      </div>

      {/* 3. Dutos de Gastos / Breakdown por Categoria (TI, Infraestrutura, Merenda, etc.) */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              Saldos Disponíveis por Duto / Categoria de Gasto
            </h3>
            <p className="text-xs text-slate-400">
              Saiba exatamente quanto recurso está liberado e carimbado para investir em cada setor.
            </p>
          </div>

          <button
            onClick={() => setSelectedRubricFilter('todas')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedRubricFilter === 'todas'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ver Todas Categorias
          </button>
        </div>

        {/* Rubric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(rubricStatsMap).map(([key, stat]) => {
            if (stat.allocated === 0 && stat.spent === 0) return null;
            const Icon = stat.icon;
            const balance = stat.allocated - stat.spent;
            const pctSpent = stat.allocated > 0 ? Math.round((stat.spent / stat.allocated) * 100) : 0;
            const isSelected = selectedRubricFilter.toLowerCase() === key.toLowerCase();

            return (
              <div
                key={key}
                onClick={() => setSelectedRubricFilter(isSelected ? 'todas' : key)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-[#060b19] border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-200 truncate flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {stat.name}
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {pctSpent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Verba Alocada:</span>
                      <span className="font-bold text-slate-200">{formatCurrency(stat.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Já Executado:</span>
                      <span className="font-bold text-emerald-400">{formatCurrency(stat.spent)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] text-amber-300 font-bold uppercase">Saldo Restante:</span>
                    <span className="font-black text-amber-400">{formatCurrency(balance)}</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, pctSpent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Controls & Filters Bar */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar programa, órgão ou responsável..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060b19] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setOnlyRiskDeadline(!onlyRiskDeadline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
              onlyRiskDeadline
                ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                : 'bg-[#060b19] text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>Apenas Com Risco de Prazo (&lt; 45 dias)</span>
          </button>
        </div>
      </div>

      {/* 5. Main Programs Table with Detailed Rubrics & Transactions */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Detalhamento de Programas & Execução por Duto
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            Mostrando {filteredPrograms.length} de {adheredPrograms.length} programas
          </span>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="p-8 text-center bg-[#060b19] rounded-xl border border-slate-800 text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-xs font-bold">Nenhum programa encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map((program) => {
              const cap = program.capturedValue || program.estimatedValue || 0;
              const spent = program.spentValue || 0;
              const remaining = cap - spent;
              const pctSpent = cap > 0 ? Math.round((spent / cap) * 100) : 0;
              const isExpanded = expandedProgramId === program.id;

              const isCriticalDeadline = program.daysToDeadline <= 30 && remaining > 0;
              const isWarningDeadline = program.daysToDeadline <= 60 && remaining > 0;

              return (
                <div
                  key={program.id}
                  className={`bg-[#060b19] border rounded-xl transition overflow-hidden ${
                    isCriticalDeadline
                      ? 'border-rose-500/60 shadow-lg shadow-rose-950/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300">
                          {program.organ}
                        </span>

                        {isCriticalDeadline ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            CRÍTICO: Expira em {program.daysToDeadline} dias!
                          </span>
                        ) : isWarningDeadline ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Atenção: Expira em {program.daysToDeadline} dias
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Prazo Regular: {program.daysToDeadline} dias
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          Data limite: <strong className="text-slate-200">{program.executionDeadline || program.deadline}</strong>
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white">{program.program}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{program.description}</p>
                    </div>

                    {/* Financial Summary Controls */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Saldo a Gastar</span>
                        <span className="text-base font-black text-amber-400">
                          {formatCurrency(remaining)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Total: {formatCurrency(cap)} ({pctSpent}% gasto)
                        </span>
                      </div>

                      {onSelectProgram && (
                        <button
                          onClick={() => onSelectProgram(program)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow cursor-pointer"
                          title="Abrir ficha técnica, parecer jurídico e documentos"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Ver Recurso</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenExpenseModal(program)}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Lançar Gasto</span>
                      </button>

                      <button
                        onClick={() => setExpandedProgramId(isExpanded ? null : program.id)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Ver detalhes de dutos e histórico"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Rubric Breakdown Pills Bar */}
                  <div className="px-4 py-2.5 bg-[#03060f] flex flex-wrap items-center gap-3 text-xs border-b border-slate-800/50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <PieChart className="w-3.5 h-3.5 text-amber-400" />
                      Dutos Destinados:
                    </span>

                    {program.rubricBreakdown && program.rubricBreakdown.length > 0 ? (
                      program.rubricBreakdown.map((rub) => {
                        const rubBal = rub.allocatedValue - rub.spentValue;
                        return (
                          <div
                            key={rub.id}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-center gap-2"
                          >
                            <span className="font-bold text-slate-300">{rub.rubricName}:</span>
                            <span className="text-emerald-400 font-bold">{formatCurrency(rub.spentValue)}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-400">{formatCurrency(rub.allocatedValue)}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Livre: {formatCurrency(rubBal)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        Categoria única: {program.legalDestination?.category || 'Custeio Geral'}
                      </span>
                    )}
                  </div>

                  {/* Expanded Section: Transactions History & Legal Guidelines */}
                  {isExpanded && (
                    <div className="p-4 bg-[#080d1e] space-y-4 border-t border-slate-800 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Legal Usage Rules */}
                        {program.legalDestination && (
                          <div className="bg-[#0b1329] p-3.5 rounded-xl border border-slate-800 space-y-2">
                            <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              Regras de Gastos Permitidos (Base Legal: {program.legalDestination.legalBasis})
                            </h5>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {program.legalDestination.allowedUses.map((use, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                                  <span className="text-emerald-400 font-bold">✓</span>
                                  <span>{use}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recent Execution Transactions */}
                        <div className="bg-[#0b1329] p-3.5 rounded-xl border border-slate-800 space-y-2">
                          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Histórico de Lançamentos ({program.transactions?.length || 0})
                          </h5>

                          {program.transactions && program.transactions.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {program.transactions.map((tx) => (
                                <div
                                  key={tx.id}
                                  className="p-2 bg-[#060b19] border border-slate-800 rounded-lg flex items-center justify-between gap-2 text-xs"
                                >
                                  <div>
                                    <p className="font-bold text-slate-200">{tx.description}</p>
                                    <p className="text-[10px] text-slate-400">
                                      {tx.supplier} • {tx.rubricName} • Data: {tx.date}{' '}
                                      {tx.invoiceNumber && `• NF: ${tx.invoiceNumber}`}
                                    </p>
                                  </div>
                                  <span className="font-black text-emerald-400 shrink-0">
                                    {formatCurrency(tx.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Nenhuma despesa lançada individualmente ainda para este programa.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Modal Form to Record New Expense */}
      {isModalOpen && targetProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-[#0d162d] to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  Registrar Lançamento de Despesa
                </h3>
                <p className="text-xs text-slate-400">{targetProgram.program}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveExpense} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Duto / Rubric Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Duto / Rubrica de Destino *
                </label>
                <select
                  value={formRubric}
                  onChange={(e) => setFormRubric(e.target.value)}
                  className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  required
                >
                  {targetProgram.rubricBreakdown && targetProgram.rubricBreakdown.length > 0 ? (
                    targetProgram.rubricBreakdown.map((r) => (
                      <option key={r.id} value={r.rubricName}>
                        {r.rubricName} (Disponível: {formatCurrency(r.allocatedValue - r.spentValue)})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="TI & Informática">TI & Informática (Equipamentos/Softwares)</option>
                      <option value="Infraestrutura & Obras">Infraestrutura & Obras</option>
                      <option value="Material Pedagógico">Material Didático & Pedagógico</option>
                      <option value="Merenda Escolar">Merenda & Alimentação Escolar</option>
                      <option value="Transporte Escolar">Transporte Escolar</option>
                      <option value="Valorização do Magistério">Valorização do Magistério (Folha)</option>
                      <option value="Formação de Professores">Formação de Professores</option>
                    </>
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Descrição do Item / Serviço *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aquisição de 15 Chromebooks para laboratório"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Supplier */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Fornecedor / Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: TechEduca Distribuidora"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Invoice Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Nº Nota Fiscal / Empenho
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: NF-10492"
                    value={formInvoice}
                    onChange={(e) => setFormInvoice(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Valor Executado (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 45000.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition font-bold text-amber-400"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Data da Despesa *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#060b19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
