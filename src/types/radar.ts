export type EligibilityStatus = 'elegivel' | 'pendente' | 'risco' | 'encerrado';
export type ProgramStatus = 'Aberto' | 'Em Análise' | 'Prestação Pendente' | 'Aprovado' | 'Encerrado';
export type ProgramPriority = 'Alta' | 'Média' | 'Baixa';
export type FundingRisk = 'Baixo' | 'Médio' | 'Alto' | 'Crítico';

export interface DocChecklistItem {
  id: string;
  docName: string;
  required: boolean;
  uploaded: boolean;
  notes?: string;
}

export interface FinancialRubricBreakdown {
  id: string;
  rubricName: string; // e.g., 'TI & Informática', 'Infraestrutura & Obras', 'Material Pedagógico', 'Merenda Escolar', 'Transporte Escolar', 'Formação'
  allocatedValue: number;
  spentValue: number;
}

export interface FinancialExecutionTransaction {
  id: string;
  programId: string;
  date: string;
  description: string;
  supplier: string;
  rubricName: string;
  amount: number;
  invoiceNumber?: string;
}

export type LegalCategory = 
  | 'Tecnologia & Equipamentos'
  | 'Infraestrutura & Obras'
  | 'Merenda Escolar'
  | 'Transporte Escolar'
  | 'Valorização do Magistério'
  | 'Material Didático & Formação'
  | 'Manutenção & Custeio Geral';

export interface LegalDestination {
  category: LegalCategory;
  expenseType: 'Custeio (Despesa Corrente)' | 'Capital (Investimento)' | 'Misto (Custeio e Capital)';
  allowedUses: string[]; // ex: ["Aquisição de Chromebooks", "Laboratórios de Robótica", "Softwares de gestão"]
  forbiddenUses: string[]; // ex: ["NÃO PODE pagar merenda escolar", "NÃO PODE folha de pessoal", "NÃO PODE obras civis"]
  legalBasis: string; // ex: "Lei nº 14.172/2021 & Resolução FNDE nº 12/2023"
  legalOpinionSummary: string; // Parecer Jurídico Simplificado do Advogado de Educação
}

export interface EducationResourceProgram {
  id: string;
  municipality: string;
  program: string;
  organ: string;
  description: string;
  criteria: string;
  eligible: boolean;
  eligibilityStatus: EligibilityStatus;
  estimatedValue: number; // in BRL (R$)
  deadline: string; // ISO date or readable date string
  daysToDeadline: number;
  pendingIssues: string[];
  status: ProgramStatus;
  priority: ProgramPriority;
  responsible: string;
  fundingSource: string;
  risk: FundingRisk;
  observations: string;
  iarContribution: number; // Score impact 0-10
  checklist: DocChecklistItem[];
  legalDestination?: LegalDestination;
  lastUpdated?: string;
  isAdhered?: boolean; // Se o município aderiu ao programa e captou o recurso
  capturedValue?: number; // Valor Total Aderido / Captado em Conta (R$)
  spentValue?: number; // Valor Efetivamente Executado / Gasto (R$)
  executionDeadline?: string; // Data limite para usar a verba sob pena de devolução
  rubricBreakdown?: FinancialRubricBreakdown[];
  transactions?: FinancialExecutionTransaction[];
}

export interface SimulationParameters {
  enrollmentIncreasePercent: number; // e.g. 5, 10, 15
  dropoutReductionPercent: number; // e.g. 2, 5
  fullTimeStudentsCount: number; // e.g. 0, 150, 300, 500
  attendanceRatePercent: number; // e.g. 85, 90, 95
}

export interface RadarSummaryMetrics {
  totalMonitoredPrograms: number;
  totalOpportunities: number;
  programsAtRisk: number;
  totalPotentialValue: number;
  upcomingDeadlinesCount: number;
  documentPendingCount: number;
  iarIndex: number; // 0 - 100
  iarStatusText: string;
  iarStatusColor: 'green' | 'yellow' | 'red';
}
