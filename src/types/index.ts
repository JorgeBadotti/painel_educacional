export type RiskLevel = 'destaque' | 'atencao' | 'critico';

export type TeachingStage = 'todas' | 'educacao_infantil' | 'anos_iniciais' | 'anos_finais' | 'eja';

export type KpiCategory = 
  | 'visao_geral'
  | 'aprendizagem'
  | 'permanencia'
  | 'professores'
  | 'gestao_escolar'
  | 'infraestrutura'
  | 'tecnologia'
  | 'financeiro'
  | 'inclusao';

export interface HistoricalPoint {
  period: string; // e.g. '2021', '2022', '2023', '2024.1', '2024.2', '2025'
  value: number;
  isAfterImplementation?: boolean;
}

export interface KpiIndicator {
  id: string;
  name: string;
  category: KpiCategory;
  unit: '%' | 'pts' | 'R$' | 'unid' | 'ratio';
  subtitle?: string;
  historyBefore: HistoricalPoint[]; // 3 historical points before system
  historyAfter: HistoricalPoint[];  // 3 historical points after system
  currentValue: number;
  target2025: number;
  targetExcellence: number;
  status: 'em_evolucao' | 'atencao' | 'critico';
  description: string;
  responsibleArea: string;
  impactScore: number;
  metaPlanejadaMonthly?: number[]; // [Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez]
}

export interface School {
  id: string;
  code: string;
  name: string;
  region: 'Norte' | 'Sul' | 'Leste' | 'Oeste' | 'Centro';
  director: string;
  status: RiskLevel;
  studentCount: number;
  teacherCount: number;
  stages: ('educacao_infantil' | 'anos_iniciais' | 'anos_finais' | 'eja')[];
  ideb: number;
  frequencia: number;
  alfabetizacao: number;
  taxaAprovacao: number;
  taxaAbandono: number;
  distorcaoIdadeSerie: number;
  execucaoFinanceira: number;
  alunosEmRisco: number;
  professoresSemFormacao: number;
  hasInternetIssues: boolean;
  address: string;
  phone: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: KpiCategory;
  schoolId?: string;
  schoolName?: string;
  kpiId?: string;
  dateCreated: string;
  resolved: boolean;
  actionPlanId?: string;
}

export interface PositiveHighlight {
  id: string;
  title: string;
  description: string;
  schoolId?: string;
  schoolName?: string;
  metricChange: string;
  date: string;
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  schoolId?: string;
  schoolName?: string;
  kpiId?: string;
  kpiName?: string;
  responsible: string;
  deadline: string;
  status: 'a_fazer' | 'em_andamento' | 'concluido' | 'em_atraso';
  priority: 'alta' | 'media' | 'baixa';
  completionPercentage: number;
  steps: { id: string; description: string; done: boolean }[];
  createdDate: string;
}

export interface UserProfile {
  name: string;
  role: 'Secretário(a) de Educação' | 'Diretor(a) Escolar' | 'Coordenador(a) Pedagógico(a)' | 'Técnico(a) de TI';
  email: string;
  municipality: string;
}

export interface MunicipalityConfig {
  id: string;
  name: string; // e.g. 'Valparaíso de Goiás'
  uf: string; // e.g. 'GO'
  region: string; // e.g. 'Entorno do DF' / 'Centro-Oeste'
  mayorName: string; // e.g. 'Marcus Vinícius'
  secretaryName: string; // e.g. 'Dr. Fernando Vasconcelos'
  inepCode: string; // e.g. '5221858'
  cnpj: string; // e.g. '01.613.385/0001-89'
  siopeCode: string; // e.g. 'GO-522185'
  totalStudents: number; // e.g. 28500
  totalSchools: number; // e.g. 48
  totalTeachers: number; // e.g. 1420
  fundebVaatValue: number; // e.g. 1250000
  pnaeValue: number; // e.g. 620000
  lastCensoYear: string; // e.g. '2024'
}

export interface ApiContractEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  requestBodyExample?: string;
  responseExample: string;
}
