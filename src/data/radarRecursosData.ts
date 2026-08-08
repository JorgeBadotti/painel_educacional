import { EducationResourceProgram } from '../types/radar';

export interface RadarCoreMetrics {
  totalMonitoredPrograms: number;
  totalOpportunities: number;
  programsAtRisk: number;
  totalPotentialValue: number;
  documentPendingCount: number;
  iarIndex: number;
}

// Shared by RadarRecursosView (full tab) and TopKpiCards (home banner preview)
// so the two never drift out of sync on the same underlying data.
export function calculateRadarCoreMetrics(programs: EducationResourceProgram[]): RadarCoreMetrics {
  const totalMonitoredPrograms = programs.length;
  const totalOpportunities = programs.filter((p) => p.eligibilityStatus === 'elegivel' || p.eligibilityStatus === 'pendente').length;
  const programsAtRisk = programs.filter((p) => p.eligibilityStatus === 'risco' || p.risk === 'Crítico' || p.risk === 'Alto').length;
  const totalPotentialValue = programs
    .filter((p) => p.eligibilityStatus !== 'encerrado')
    .reduce((sum, p) => sum + p.estimatedValue, 0);
  const documentPendingCount = programs.reduce((count, p) => count + p.checklist.filter((c) => !c.uploaded).length, 0);

  // IAR (Índice de Aproveitamento de Recursos) 0-100.
  // Formula: Base 72 + (Eligible Ratio * 25) - (Risk Penalty * 3) - (Doc Penalty * 0.8)
  const eligibleCount = programs.filter((p) => p.eligibilityStatus === 'elegivel').length;
  const ratioEligible = eligibleCount / Math.max(1, totalMonitoredPrograms);
  const iarIndex = Math.min(100, Math.max(0, Math.round(72 + ratioEligible * 25 - programsAtRisk * 3 - (documentPendingCount * 0.8))));

  return { totalMonitoredPrograms, totalOpportunities, programsAtRisk, totalPotentialValue, documentPendingCount, iarIndex };
}

export const INITIAL_RADAR_PROGRAMS: EducationResourceProgram[] = [
  {
    id: 'prog-fundeb-vaat',
    municipality: 'Valparaíso de Goiás',
    program: 'Fundeb - Complementação VAAT',
    organ: 'MEC / FNDE / STN',
    description: 'Complementação do Valor Aluno Ano Total para municípios que atingem os indicadores de equidade e arrecadação própria.',
    criteria: 'Alcançar a VAAT mínima nacional, transmitir dados do SIOPE dentro do prazo legal e comprovar investimento de ao menos 15% em Educação Infantil.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 1250000,
    deadline: '2025-08-30',
    daysToDeadline: 28,
    pendingIssues: ['Alocação detalhada de 15% na Primeira Infância'],
    status: 'Aberto',
    priority: 'Alta',
    responsible: 'Coordenadoria Financeira / SIOPE',
    fundingSource: 'Federal (União / Fundeb)',
    risk: 'Baixo',
    observations: 'Principal fonte de reforço caixa para infraestrutura e valorização do magistério.',
    iarContribution: 10,
    isAdhered: true,
    capturedValue: 1250000,
    spentValue: 890000,
    executionDeadline: '2025-10-31',
    rubricBreakdown: [
      { id: 'rub-1', rubricName: 'Valorização do Magistério', allocatedValue: 875000, spentValue: 680000 },
      { id: 'rub-2', rubricName: 'Infraestrutura & Obras', allocatedValue: 187500, spentValue: 120000 },
      { id: 'rub-3', rubricName: 'TI & Informática', allocatedValue: 187500, spentValue: 90000 }
    ],
    transactions: [
      { id: 'tx-1', programId: 'prog-fundeb-vaat', date: '2025-05-10', description: 'Aquisição de 40 Laptops Professores', supplier: 'TechEduca Distribuidora', rubricName: 'TI & Informática', amount: 90000, invoiceNumber: 'NF-8821' },
      { id: 'tx-2', programId: 'prog-fundeb-vaat', date: '2025-06-15', description: 'Folha Pagamento Professores Ativos - Parcela A', supplier: 'Folha Pessoal SEDUC', rubricName: 'Valorização do Magistério', amount: 680000, invoiceNumber: 'FOLHA-0625' },
      { id: 'tx-3', programId: 'prog-fundeb-vaat', date: '2025-07-02', description: 'Reforma de Telhado EMEB Paulo Freire', supplier: 'Construtora Alvorada Ltda', rubricName: 'Infraestrutura & Obras', amount: 120000, invoiceNumber: 'NF-1044' }
    ],
    checklist: [
      { id: 'chk-1', docName: 'Relatório de Transmissão SIOPE 2024.2', required: true, uploaded: true },
      { id: 'chk-2', docName: 'Comprovante de Aplicação de 15% Educação Infantil', required: true, uploaded: false, notes: 'Aguardando validação da contabilidade' },
      { id: 'chk-3', docName: 'Demonstrativo de Arrecadação Própria', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Valorização do Magistério',
      expenseType: 'Misto (Custeio e Capital)',
      allowedUses: [
        'Mínimo obrigatório de 70% para remuneração dos profissionais da educação básica em efetivo exercício (Magistério e Apoio)',
        'Mínimo obrigatório de 15% para investimentos em Educação Infantil (Creches e Pré-Escolas)',
        'Construção e reforma de salas de aula e creches',
        'Aquisição de material didático e equipamentos de tecnologia'
      ],
      forbiddenUses: [
        'PROIBIDO compra de merenda escolar (financiada via PNAE)',
        'PROIBIDO pagamento de aposentados e pensionistas com os 70% do magistério',
        'PROIBIDO despesas de custeio alheias à Manutenção e Desenvolvimento do Ensino (MDE)',
        'PROIBIDO obras de infraestrutura urbana fora do perímetro escolar'
      ],
      legalBasis: 'Lei Federal nº 14.113/2020 (Lei do Fundeb) & Art. 212-A da CF/88',
      legalOpinionSummary: 'Parecer do Especialista em Direito Financeiro: Verba altamente vinculada. Mínimo de 70% carimbado para a folha de pagamento dos docentes ativos. Qualquer desvio para merenda escolar ou custeio geral configura improbidade e descumprimento do limite constitucional.'
    }
  },
  {
    id: 'prog-pdde-basico',
    municipality: 'Valparaíso de Goiás',
    program: 'PDDE - Programa Dinheiro Direto na Escola',
    organ: 'FNDE / MEC',
    description: 'Repasse direto às Unidades Executoras Próprias (UEx) para manutenção e melhoria de infraestrutura física e pedagógica.',
    criteria: 'Manter cadastro no Censo Escolar atualizado, prestar contas do exercício anterior no SIGPC e ter UEx com situação cadastral ativa.',
    eligible: true,
    eligibilityStatus: 'pendente',
    estimatedValue: 280000,
    deadline: '2025-08-15',
    daysToDeadline: 13,
    pendingIssues: ['Prestação de contas pendente em 2 escolas municipais'],
    status: 'Prestação Pendente',
    priority: 'Alta',
    responsible: 'Coordenação de Acompanhamento do PDDE',
    fundingSource: 'Federal (FNDE)',
    risk: 'Médio',
    observations: 'Bloqueio parcial de repasse para 2 escolas até saneamento no SIGPC.',
    iarContribution: 8,
    isAdhered: true,
    capturedValue: 280000,
    spentValue: 195000,
    executionDeadline: '2025-08-30',
    rubricBreakdown: [
      { id: 'rub-4', rubricName: 'TI & Informática', allocatedValue: 100000, spentValue: 85000 },
      { id: 'rub-5', rubricName: 'Infraestrutura & Obras', allocatedValue: 100000, spentValue: 65000 },
      { id: 'rub-6', rubricName: 'Material Pedagógico', allocatedValue: 80000, spentValue: 45000 }
    ],
    transactions: [
      { id: 'tx-4', programId: 'prog-pdde-basico', date: '2025-04-12', description: 'Compra de Roteadores Wi-Fi para 8 Escolas', supplier: 'InfraNet Soluções', rubricName: 'TI & Informática', amount: 85000, invoiceNumber: 'NF-3320' },
      { id: 'tx-5', programId: 'prog-pdde-basico', date: '2025-05-20', description: 'Pintura e Reparo elétrico em 4 unidades', supplier: 'Serviços Gerais Valparaíso', rubricName: 'Infraestrutura & Obras', amount: 65000, invoiceNumber: 'NF-4102' },
      { id: 'tx-6', programId: 'prog-pdde-basico', date: '2025-06-08', description: 'Kits de Jogos Matemáticos e Leitura', supplier: 'Editora Saberes', rubricName: 'Material Pedagógico', amount: 45000, invoiceNumber: 'NF-1290' }
    ],
    checklist: [
      { id: 'chk-4', docName: 'Ata de Eleição dos ConseIhos Escolares', required: true, uploaded: true },
      { id: 'chk-5', docName: 'Prestação de Contas SIGPC 2024', required: true, uploaded: false, notes: 'Escolas EMEB Paulo Freire e EMEB Anísio Teixeira pendentes' }
    ],
    legalDestination: {
      category: 'Manutenção & Custeio Geral',
      expenseType: 'Misto (Custeio e Capital)',
      allowedUses: [
        'Pequenos consertos, reformas hidráulicas/elétricas e pintura de salas de aula',
        'Aquisição de material permanente, mobília e eletrodomésticos para refeitório',
        'Material pedagógico, livros e jogos educativos',
        'Periféricos de TI (impressoras, roteadores, no-breaks)'
      ],
      forbiddenUses: [
        'PROIBIDO aquisição de merenda escolar (gêneros alimentícios da rotina)',
        'PROIBIDO pagamento de pessoal de qualquer natureza (salários, abonos ou diárias)',
        'PROIBIDO grandes obras civis estruturais que exigem licitação direta da prefeitura',
        'PROIBIDO pagamento de tarifas bancárias ou tributos municipais'
      ],
      legalBasis: 'Resolução FNDE/CD nº 15/2021 & Decreto nº 6.094/2007',
      legalOpinionSummary: 'Parecer Jurídico: Recursos geridos pela própria escola (UEx). O gestor NÃO PODE usar esta verba para comprar comida da merenda ou pagar funcionários terceirizados. Foco exclusivo no custeio imediato e manutenção predial leve.'
    }
  },
  {
    id: 'prog-pnae-alimentacao',
    municipality: 'Valparaíso de Goiás',
    program: 'PNAE - Programa Nacional de Alimentação Escolar',
    organ: 'FNDE / MEC',
    description: 'Garantia de alimentação escolar saudável para todos os alunos da educação básica pública.',
    criteria: 'Executar ao menos 30% dos recursos com compra direta da Agricultura Familiar local e manter nutricionista responsável com CRN ativo.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 620000,
    deadline: '2025-10-15',
    daysToDeadline: 74,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Alta',
    responsible: 'Setor de Nutrição Escolar',
    fundingSource: 'Federal (FNDE)',
    risk: 'Baixo',
    observations: 'Município atingiu 34.5% de compras da Agricultura Familiar, superando a meta legal.',
    iarContribution: 9,
    isAdhered: true,
    capturedValue: 620000,
    spentValue: 430000,
    executionDeadline: '2025-11-30',
    rubricBreakdown: [
      { id: 'rub-7', rubricName: 'Merenda Escolar', allocatedValue: 620000, spentValue: 430000 }
    ],
    transactions: [
      { id: 'tx-7', programId: 'prog-pnae-alimentacao', date: '2025-05-02', description: 'Aporte Frutas e Hortaliças Agricultura Familiar', supplier: 'Cooperativa Agrícola do Vale', rubricName: 'Merenda Escolar', amount: 215000, invoiceNumber: 'NF-9921' },
      { id: 'tx-8', programId: 'prog-pnae-alimentacao', date: '2025-06-12', description: 'Gêneros Alimentícios Secos e Proteínas', supplier: 'Atacadão Alimentos', rubricName: 'Merenda Escolar', amount: 215000, invoiceNumber: 'NF-4432' }
    ],
    checklist: [
      { id: 'chk-6', docName: 'Chamada Pública da Agricultura Familiar', required: true, uploaded: true },
      { id: 'chk-7', docName: 'Anotação de Responsabilidade Técnica (ART) Nutricionista', required: true, uploaded: true },
      { id: 'chk-8', docName: 'Aprovação do Conselho de Alimentação Escolar (CAE)', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Merenda Escolar',
      expenseType: 'Custeio (Despesa Corrente)',
      allowedUses: [
        'Compra exclusiva de gêneros alimentícios in natura e minimamente processados para o cardápio escolar',
        'Mínimo legal de 30% reservado para aquisição direta da Agricultura Familiar local e empreendedores familiares rurais',
        'Alimentos especiais para estudantes com restrições alimentares (ex: celíacos, intolerantes a lactose)'
      ],
      forbiddenUses: [
        'PROIBIDO aquisição de computadores, tablets ou tecnologia escolar',
        'PROIBIDO pagamento de salários de cozinheiras, nutricionistas ou merendeiras',
        'PROIBIDO compra de eletrodomésticos, fogões ou geladeiras (devem ser comprados via PDDE ou tesouro)',
        'PROIBIDO despesas com gás de cozinha ou transporte dos alimentos'
      ],
      legalBasis: 'Lei Federal nº 11.947/2009 & Resolução FNDE/CD nº 06/2020',
      legalOpinionSummary: 'Parecer do Especialista em Direito Financeiro: Verba 100% carimbada para ALIMENTAÇÃO ESCOLAR. É ilegal utilizar recursos do PNAE para comprar tecnologia, reformar cozinhas ou pagar salários de pessoal.'
    }
  },
  {
    id: 'prog-pnate-transporte',
    municipality: 'Valparaíso de Goiás',
    program: 'PNATE - Transporte Escolar Rural',
    organ: 'FNDE / MEC',
    description: 'Apoio financeiro ao custeio de transporte de alunos residentes em zonas rurais.',
    criteria: 'Mapeamento georreferenciado da frota rural no sistema SETE/FNDE e certidão negativa de débitos.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 190000,
    deadline: '2025-09-20',
    daysToDeadline: 49,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Média',
    responsible: 'Divisão de Transporte Escolar',
    fundingSource: 'Federal (FNDE)',
    risk: 'Baixo',
    observations: 'Rotas rurais mapeadas via aplicativo SETE com 100% de conformidade.',
    iarContribution: 7,
    isAdhered: true,
    capturedValue: 190000,
    spentValue: 145000,
    executionDeadline: '2025-09-20',
    rubricBreakdown: [
      { id: 'rub-8', rubricName: 'Transporte Escolar', allocatedValue: 190000, spentValue: 145000 }
    ],
    transactions: [
      { id: 'tx-9', programId: 'prog-pnate-transporte', date: '2025-05-18', description: 'Combustível e Lubrificante Ônibus Rurais', supplier: 'Posto Central Valparaíso', rubricName: 'Transporte Escolar', amount: 145000, invoiceNumber: 'NF-6610' }
    ],
    checklist: [
      { id: 'chk-9', docName: 'Cadastro de Rotas no Sistema SETE', required: true, uploaded: true },
      { id: 'chk-10', docName: 'Laudos de Vistoria dos Veículos Escolares', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Transporte Escolar',
      expenseType: 'Custeio (Despesa Corrente)',
      allowedUses: [
        'Manutenção, reforma e troca de peças de ônibus e vans da frota de transporte escolar rural',
        'Compra de combustível, lubrificantes e pneus para os veículos escolares de rotas rurais',
        'Pagamento de contratos de prestação de serviços terceirizados de transporte de alunos rurais'
      ],
      forbiddenUses: [
        'PROIBIDO compra de merenda escolar ou gêneros alimentícios',
        'PROIBIDO aquisição de computadores, livros ou material didático',
        'PROIBIDO transporte de servidores públicos para atividades administrativas',
        'PROIBIDO manutenção de veículos do gabinete do prefeito ou de outras secretarias'
      ],
      legalBasis: 'Lei Federal nº 10.880/2004 & Decreto nº 5.296/2004',
      legalOpinionSummary: 'Parecer Jurídico: O PNATE destina-se EXCLUSIVAMENTE ao transporte de estudantes residentes na ZONA RURAL. Não pode ser desviado para combustível de carros passeios nem para merenda.'
    }
  },
  {
    id: 'prog-par-4ciclo',
    municipality: 'Valparaíso de Goiás',
    program: 'PAR - Plano de Ações Articuladas (FNDE)',
    organ: 'MEC / FNDE',
    description: 'Assistência técnica e financeira para aquisição de ônibus escolares, equipamentos de TI e construção de creches.',
    criteria: 'Preenchimento do diagnóstico no SIMEC/PAR, aprovação de termo de compromisso e indicação de terrenos regularizados.',
    eligible: true,
    eligibilityStatus: 'pendente',
    estimatedValue: 980000,
    deadline: '2025-08-20',
    daysToDeadline: 18,
    pendingIssues: ['Certidão de Matrícula do Terreno da Creche Bairro Novo'],
    status: 'Em Análise',
    priority: 'Alta',
    responsible: 'Engenharia & Planejamento SEDUC',
    fundingSource: 'Federal (FNDE/MEC)',
    risk: 'Médio',
    observations: 'Aguardando cartório para liberação do repasse para construção de creche Tipo 1.',
    iarContribution: 9,
    checklist: [
      { id: 'chk-11', docName: 'Diagnóstico Consolidado no SIMEC', required: true, uploaded: true },
      { id: 'chk-12', docName: 'Matrícula do Terreno no Cartório de RGI', required: true, uploaded: false, notes: 'Em trâmite de regularização fundiária' }
    ],
    legalDestination: {
      category: 'Infraestrutura & Obras',
      expenseType: 'Capital (Investimento)',
      allowedUses: [
        'Construção de novas creches e escolas de educação infantil alinhadas aos projetos do FNDE',
        'Aquisição de ônibus escolares 0km com acessibilidade (Programa Caminho da Escola)',
        'Mobiliário escolar padronizado e equipamentos de climatização'
      ],
      forbiddenUses: [
        'PROIBIDO pagamento de despesas correntes de custeio diário (papelaria, limpeza)',
        'PROIBIDO aquisição de merenda escolar',
        'PROIBIDO pagamento de salários de professores ou servidores de apoio'
      ],
      legalBasis: 'Lei nº 12.695/2012 & Portaria MEC nº 1.250/2023',
      legalOpinionSummary: 'Parecer de Direito Administrativo: Repasse de CAPITAL por Termo de Compromisso. As verbas só podem ser liquidadas conforme as medições das obras aprovadas no SIMEC/SISMEC.'
    }
  },
  {
    id: 'prog-crianca-alfabetizada',
    municipality: 'Valparaíso de Goiás',
    program: 'Compromisso Nacional Criança Alfabetizada',
    organ: 'MEC / SEDUC Estadual',
    description: 'Garantir a alfabetização de 100% das crianças ao final do 2º ano do Ensino Fundamental com apoio a formadores e material didático.',
    criteria: 'Adesão formal ao programa no SIMEC, nomeação de articuladores municipais e participação nos exames de fluência leitora.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 310000,
    deadline: '2025-11-10',
    daysToDeadline: 100,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Alta',
    responsible: 'Diretoria Pedagógica / Alfabetização',
    fundingSource: 'MEC / Bolsa Formação',
    risk: 'Baixo',
    observations: 'Articuladores formados e bolsa repassada diretamente aos professores regentes.',
    iarContribution: 9,
    isAdhered: true,
    capturedValue: 310000,
    spentValue: 185000,
    executionDeadline: '2025-12-15',
    rubricBreakdown: [
      { id: 'rub-9', rubricName: 'Material Pedagógico', allocatedValue: 160000, spentValue: 100000 },
      { id: 'rub-10', rubricName: 'Formação de Professores', allocatedValue: 150000, spentValue: 85000 }
    ],
    checklist: [
      { id: 'chk-13', docName: 'Termo de Adesão Criança Alfabetizada SIMEC', required: true, uploaded: true },
      { id: 'chk-14', docName: 'Nominação dos Articuladores no Diário Oficial', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Material Didático & Formação',
      expenseType: 'Misto (Custeio e Capital)',
      allowedUses: [
        'Pagamento de bolsas de formação continuada para professores alfabetizadores e articuladores municipais',
        'Aquisição de cantos de leitura, livros literários infantis e jogos alfabéticos',
        'Aplicação de avaliações diagnósticas e exames de fluência leitora'
      ],
      forbiddenUses: [
        'PROIBIDO compra de alimentação ou merenda escolar',
        'PROIBIDO pagamento de gratificações permanentes incorporáveis à carreira',
        'PROIBIDO obras e reformas em prédios escolares'
      ],
      legalBasis: 'Decreto Federal nº 11.556/2023 & Portaria MEC nº 1.320/2023',
      legalOpinionSummary: 'Parecer do Especialista: Recursos focados em FORMAÇÃO E MATERIAL DE ALFABETIZAÇÃO. As bolsas possuem caráter indenizatório e não podem ser revertidas para aquisições patrimoniais ou alimentação.'
    }
  },
  {
    id: 'prog-escola-integral',
    municipality: 'Valparaíso de Goiás',
    program: 'Programa Escola em Tempo Integral',
    organ: 'MEC / FNDE',
    description: 'Fomento financeiro para criação e expansão de matrículas em jornada de tempo integral (7h+ diárias).',
    criteria: 'Pactuação de metas de ampliação no SIMEC e aprovação do projeto pedagógico de tempo integral na câmara de educação.',
    eligible: true,
    eligibilityStatus: 'pendente',
    estimatedValue: 850000,
    deadline: '2025-08-12',
    daysToDeadline: 10,
    pendingIssues: ['Publicação do Decreto Municipal de Expansão de Tempo Integral'],
    status: 'Aberto',
    priority: 'Alta',
    responsible: 'Gabinete do Secretário & Conselho Municipal',
    fundingSource: 'Federal (MEC/FNDE)',
    risk: 'Alto',
    observations: 'Prazo urgente! Falta apenas decreto assinado pelo Prefeito para confirmar repasse de R$ 850 mil.',
    iarContribution: 10,
    checklist: [
      { id: 'chk-15', docName: 'Plano Pedagógico de Tempo Integral', required: true, uploaded: true },
      { id: 'chk-16', docName: 'Decreto Municipal de Tempo Integral', required: true, uploaded: false, notes: 'Minuta pronta na Procuradoria Jurídica' }
    ],
    legalDestination: {
      category: 'Material Didático & Formação',
      expenseType: 'Misto (Custeio e Capital)',
      allowedUses: [
        'Custeio de oficinas pedagógicas, esportivas, artísticas e tecnológicas no turno estendido',
        'Adequação de espaços físicos para permanência de 7h+ (refeitórios, salas de descanso)',
        'Aquisição de materiais pedagógicos específicos para contraturno'
      ],
      forbiddenUses: [
        'PROIBIDO substituição da parcela ordinária do Fundeb destinada à folha',
        'PROIBIDO pagamento de dividas contratuais antigas do município',
        'PROIBIDO custeio de merenda (que deve ser coberta suplementarmente via PNAE Tempo Integral)'
      ],
      legalBasis: 'Lei Federal nº 14.640/2023 & Portaria MEC nº 1.495/2023',
      legalOpinionSummary: 'Parecer do Especialista em Direito da Educação: Fomento financeiro condicionado à comprovação de novas matrículas pactuadas no SIMEC. O valor não serve para cobrir déficit da merenda habitual nem substitui o repasse do Fundeb.'
    }
  },
  {
    id: 'prog-conectividade-piec',
    municipality: 'Valparaíso de Goiás',
    program: 'Programa de Conectividade (PIEC / Escolas Conectadas)',
    organ: 'MEC / MCOM / FNDE',
    description: 'Apoio à contratação de internet de alta velocidade e Wi-Fi pedagógico nas escolas rurais e urbanas.',
    criteria: 'Velocidade contratada proporcional ao quantitativo de alunos (mínimo 1 Mbps por aluno no turno).',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 240000,
    deadline: '2025-10-30',
    daysToDeadline: 89,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Média',
    responsible: 'Coordenadoria de Tecnologia da Informação',
    fundingSource: 'Federal (FNDE/FUST)',
    risk: 'Baixo',
    observations: 'Contratação via ata de registro de preços estadual aprovada com sucesso.',
    iarContribution: 8,
    isAdhered: true,
    capturedValue: 240000,
    spentValue: 170000,
    executionDeadline: '2025-10-30',
    rubricBreakdown: [
      { id: 'rub-11', rubricName: 'TI & Informática', allocatedValue: 240000, spentValue: 170000 }
    ],
    transactions: [
      { id: 'tx-10', programId: 'prog-conectividade-piec', date: '2025-05-25', description: 'Assinatura Link Dedicado 1Gbps Fibra Escolar', supplier: 'Telecom Brasil S.A.', rubricName: 'TI & Informática', amount: 170000, invoiceNumber: 'NF-1102' }
    ],
    checklist: [
      { id: 'chk-17', docName: 'Medição de Velocidade Anatel nas Escolas', required: true, uploaded: true },
      { id: 'chk-18', docName: 'Contrato de Provedor de Banda Larga', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Tecnologia & Equipamentos',
      expenseType: 'Custeio (Despesa Corrente)',
      allowedUses: [
        'Contratação de links dedicados de internet fibra óptica e satelital para unidades escolares',
        'Instalação e manutenção de redes de Wi-Fi corporativo interno (roteadores e switches)',
        'Serviços de segurança digital e controle de conteúdo impróprio'
      ],
      forbiddenUses: [
        'PROIBIDO compra de merenda escolar ou insumos de alimentação',
        'PROIBIDO pagamento de salários de pessoal administrativo da secretaria',
        'PROIBIDO reforma predial civil desvinculada de cabeamento estruturado'
      ],
      legalBasis: 'Portaria MEC nº 356/2023 & Diretrizes do FUST / Estratégia Nacional de Escolas Conectadas',
      legalOpinionSummary: 'Parecer Jurídico: Verba estritamente carimbada para CONECTIVIDADE E INTERNET. Qualquer desvio para abastecer refeitórios ou pagar folha de pessoal é ato ilícito com penalidade de devolução de recursos.'
    }
  },
  {
    id: 'prog-brasil-na-escola',
    municipality: 'Valparaíso de Goiás',
    program: 'Brasil na Escola (Anos Finais)',
    organ: 'MEC / FNDE',
    description: 'Incentivo à inovação pedagógica e combate ao abandono escolar nos 6º ao 9º anos.',
    criteria: 'Eleição das escolas prioritárias com IDEB inferior a 4.5 e plano de tutoria individualizada.',
    eligible: false,
    eligibilityStatus: 'risco',
    estimatedValue: 150000,
    deadline: '2025-08-08',
    daysToDeadline: 6,
    pendingIssues: ['Falta de indicação de tutores pedagógicos em 3 escolas'],
    status: 'Aberto',
    priority: 'Alta',
    responsible: 'Coordenação de Anos Finais',
    fundingSource: 'Federal (FNDE)',
    risk: 'Crítico',
    observations: 'Risco iminente de perda de R$ 150 mil por falta de tutores credenciados.',
    iarContribution: 7,
    checklist: [
      { id: 'chk-19', docName: 'Plano de Tutoria por Escola Elegível', required: true, uploaded: false, notes: 'Falta validar plano na EMEB JK' }
    ],
    legalDestination: {
      category: 'Material Didático & Formação',
      expenseType: 'Custeio (Despesa Corrente)',
      allowedUses: [
        'Bolsas para tutores pedagógicos que acompanham alunos com fragilidade de aprendizagem',
        'Aquisição de kits de reforço escolar e material didático complementar',
        'Estratégias de acompanhamento personalizado do rendimento escolar'
      ],
      forbiddenUses: [
        'PROIBIDO aquisição de merenda ou alimentos',
        'PROIBIDO obras de reforma civil',
        'PROIBIDO compra de combustíveis ou terceirização de transporte'
      ],
      legalBasis: 'Portaria MEC nº 177/2021 & Resolução FNDE nº 08/2021',
      legalOpinionSummary: 'Parecer do Especialista: Programa voltado à superação do abandono escolar e inovação nos Anos Finais. Recursos vinculados à tutoria de alunos em vulnerabilidade.'
    }
  },
  {
    id: 'prog-educacao-digital-pned',
    municipality: 'Valparaíso de Goiás',
    program: 'Política Nacional de Educação Digital (PNED)',
    organ: 'MEC / FNDE',
    description: 'Aquisição de kits de robótica, laboratórios móveis e treinamento de professores em cultura digital.',
    criteria: 'Apresentar plano municipal de letramento digital alinhado à BNCC Computação.',
    eligible: true,
    eligibilityStatus: 'pendente',
    estimatedValue: 450000,
    deadline: '2025-09-10',
    daysToDeadline: 39,
    pendingIssues: ['Plano Municipal de Formação em Robótica em elaboração'],
    status: 'Em Análise',
    priority: 'Média',
    responsible: 'Núcleo de Tecnologia Educacional',
    fundingSource: 'Federal (MEC/FNDE)',
    risk: 'Médio',
    observations: 'Oportunidade para equipar 12 escolas com laboratórios robóticos.',
    iarContribution: 8,
    isAdhered: true,
    capturedValue: 450000,
    spentValue: 220000,
    executionDeadline: '2025-09-15',
    rubricBreakdown: [
      { id: 'rub-12', rubricName: 'TI & Informática', allocatedValue: 350000, spentValue: 170000 },
      { id: 'rub-13', rubricName: 'Formação de Professores', allocatedValue: 100000, spentValue: 50000 }
    ],
    transactions: [
      { id: 'tx-11', programId: 'prog-educacao-digital-pned', date: '2025-06-01', description: 'Kits de Robótica e Placas Programáveis', supplier: 'RoboEduca Inovação', rubricName: 'TI & Informática', amount: 170000, invoiceNumber: 'NF-7731' },
      { id: 'tx-12', programId: 'prog-educacao-digital-pned', date: '2025-06-20', description: 'Workshop Cultura Digital Docente', supplier: 'Instituto Letramento Digital', rubricName: 'Formação de Professores', amount: 50000, invoiceNumber: 'NF-2091' }
    ],
    checklist: [
      { id: 'chk-20', docName: 'Plano de Formação em Cultura Digital BNCC', required: true, uploaded: false }
    ],
    legalDestination: {
      category: 'Tecnologia & Equipamentos',
      expenseType: 'Capital (Investimento)',
      allowedUses: [
        'Kits pedagógicos de robótica educacional, placas de programação e impressoras 3D',
        'Carrinhos recarregáveis para laboratórios móveis de informática',
        'Capacitação continuada dos docentes em pensamento computacional e BNCC Cultura Digital'
      ],
      forbiddenUses: [
        'PROIBIDO compra de merenda escolar ou produtos de limpeza',
        'PROIBIDO pagamento de contas de luz, água ou telefone da secretaria',
        'PROIBIDO contratação de serviços de transporte escolar',
        'PROIBIDO pagamento de gratificações salariais sem vínculo com a formação'
      ],
      legalBasis: 'Lei Federal nº 14.533/2023 (PNED) & Resolução FNDE nº 12/2023',
      legalOpinionSummary: 'Parecer do Especialista em Direito Financeiro & TI: A verba do PNED é ESTRITAMENTE TECNOLÓGICA. O gestor que utilizar estes recursos para adquirir merenda ou pagar contas de custeio comete desvio de finalidade com responsabilidade fiscal.'
    }
  },
  {
    id: 'prog-obras-fnde-convenios',
    municipality: 'Valparaíso de Goiás',
    program: 'Convênios FNDE - Pacto Obras Paralisadas',
    organ: 'FNDE / CGU',
    description: 'Repactuação de valores para retomada e conclusão de obras de creches e quadras poliesportivas.',
    criteria: 'Vistoria técnica atualizada no SISMECObras e laudo de engenharia civil demonstrando saldo a executar.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 1800000,
    deadline: '2025-12-15',
    daysToDeadline: 135,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Alta',
    responsible: 'Secretaria de Obras & Infraestrutura SEDUC',
    fundingSource: 'Federal (FNDE)',
    risk: 'Baixo',
    observations: 'Obras de 2 quadras e 1 creche repactuadas com aporte reajustado em R$ 1.8 milhão.',
    iarContribution: 10,
    isAdhered: true,
    capturedValue: 1800000,
    spentValue: 1120000,
    executionDeadline: '2025-12-15',
    rubricBreakdown: [
      { id: 'rub-14', rubricName: 'Infraestrutura & Obras', allocatedValue: 1800000, spentValue: 1120000 }
    ],
    checklist: [
      { id: 'chk-21', docName: 'Laudo Técnico de Engenharia SISMECObras', required: true, uploaded: true },
      { id: 'chk-22', docName: 'Termo de Aditivo do Pacto de Retomada', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Infraestrutura & Obras',
      expenseType: 'Capital (Investimento)',
      allowedUses: [
        'Pagamento de medições de engenharia civil para conclusão de prédios escolares',
        'Serviços de cobertura, instalações hidráulicas/elétricas e acabamento de creches',
        'Construção de quadras e vestiários poliesportivos escolares'
      ],
      forbiddenUses: [
        'PROIBIDO compra de merenda escolar',
        'PROIBIDO compra de notebooks ou eletrônicos sem especificação na planilha de obras',
        'PROIBIDO pagamento de salários de servidores municipais da secretaria'
      ],
      legalBasis: 'Lei nº 14.719/2023 (Pacto Nacional de Obras) & Portaria MEC/FNDE nº 01/2023',
      legalOpinionSummary: 'Parecer Jurídico de Engenharia: Verba carimbada no Convênio de Engenharia. É vedado o remanejamento para qualquer tipo de custeio corrente ou contratação de pessoal.'
    }
  },
  {
    id: 'prog-emendas-parlamentares',
    municipality: 'Valparaíso de Goiás',
    program: 'Emendas Parlamentares Indicações RPO',
    organ: 'Congresso Nacional / FNDE',
    description: 'Recursos de emendas de bancada e individuais destinados à renovação de frotas e ar condicionado em salas.',
    criteria: 'Cadastramento da proposta no Transferegov.br e aceite formal pelo parlamentar proponente.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 750000,
    deadline: '2025-10-05',
    daysToDeadline: 64,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Média',
    responsible: 'Gabinete do Secretário',
    fundingSource: 'Emendas de Bancada Federal',
    risk: 'Baixo',
    observations: 'Emenda destinada para climatização de 100% das salas de aula urbanas.',
    iarContribution: 8,
    isAdhered: true,
    capturedValue: 750000,
    spentValue: 480000,
    executionDeadline: '2025-10-05',
    rubricBreakdown: [
      { id: 'rub-15', rubricName: 'Infraestrutura & Obras', allocatedValue: 450000, spentValue: 280000 },
      { id: 'rub-16', rubricName: 'TI & Informática', allocatedValue: 300000, spentValue: 200000 }
    ],
    checklist: [
      { id: 'chk-23', docName: 'Proposta Aprovada no Transferegov', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Tecnologia & Equipamentos',
      expenseType: 'Capital (Investimento)',
      allowedUses: [
        'Aquisição e instalação de aparelhos de ar-condicionado para salas de aula',
        'Renovação de veículos da frota de transporte escolar',
        'Aquisição de parques infantis e mobiliário escolar permanente'
      ],
      forbiddenUses: [
        'PROIBIDO destinação para compra de merenda escolar habitual',
        'PROIBIDO pagamento de folha de pagamento ordinária',
        'PROIBIDO despesas não constantes do plano de trabalho aprovado na emenda'
      ],
      legalBasis: 'Emenda Constitucional nº 105/2019 & Resolução Transferegov.br',
      legalOpinionSummary: 'Parecer do Especialista em Direito Orçamentário: Execução vinculada estritamente ao Plano de Trabalho aprovado no Transferegov. Desvios para despesas correntes não autorizadas sujeitam o gestor a tomada de contas especial.'
    }
  },
  {
    id: 'prog-programas-estaduais',
    municipality: 'Valparaíso de Goiás',
    program: 'Programa Estadual Pro-Escola & Transporte Compartilhado',
    organ: 'SEDUC do Estado',
    description: 'Custeio de linhas estaduais compartilhadas para transporte de estudantes do ensino médio.',
    criteria: 'Termo de cooperação técnica assinado entre Município e Estado para gestão unificada do transporte.',
    eligible: true,
    eligibilityStatus: 'elegivel',
    estimatedValue: 390000,
    deadline: '2025-09-01',
    daysToDeadline: 30,
    pendingIssues: [],
    status: 'Aprovado',
    priority: 'Média',
    responsible: 'Diretoria de Relações Institucionais',
    fundingSource: 'Estadual (Goiás / SEDUC-GO)',
    risk: 'Baixo',
    observations: 'Convênio estadual ativo garantindo ressarcimento direto por km rodado.',
    iarContribution: 7,
    isAdhered: true,
    capturedValue: 390000,
    spentValue: 270000,
    executionDeadline: '2025-09-01',
    rubricBreakdown: [
      { id: 'rub-17', rubricName: 'Transporte Escolar', allocatedValue: 390000, spentValue: 270000 }
    ],
    checklist: [
      { id: 'chk-24', docName: 'Termo de Cooperação Técnica Estado/Município', required: true, uploaded: true }
    ],
    legalDestination: {
      category: 'Transporte Escolar',
      expenseType: 'Custeio (Despesa Corrente)',
      allowedUses: [
        'Ressarcimento do custo por quilômetro rodado no transporte de alunos do Ensino Médio estadual',
        'Manutenção preventiva dos veículos em rotas compartilhadas Estado-Município'
      ],
      forbiddenUses: [
        'PROIBIDO utilização para merenda escolar',
        'PROIBIDO contratação de tecnologia desvinculada do transporte',
        'PROIBIDO obras físicas nas escolas'
      ],
      legalBasis: 'Lei Estadual de Transporte Escolar Compartilhado & Convênio SEDUC-GO',
      legalOpinionSummary: 'Parecer Jurídico Estadual: Recursos de cooperação federativa interente. Apenas despesas operacionais do transporte de alunos da rede estadual podem ser faturadas contra o convênio.'
    }
  }
];
