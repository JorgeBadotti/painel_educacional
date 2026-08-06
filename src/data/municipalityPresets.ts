import { MunicipalityConfig, School, KpiIndicator } from '../types';
import { EducationResourceProgram } from '../types/radar';

export const STATE_INEP_PREFIXES: Record<string, string> = {
  AC: '12', AL: '27', AP: '16', AM: '13', BA: '29', CE: '23', DF: '53', ES: '32',
  GO: '52', MA: '21', MT: '51', MS: '50', MG: '31', PA: '15', PB: '25', PR: '41',
  PE: '26', PI: '22', RJ: '33', RN: '24', RS: '43', RO: '11', RR: '14', SC: '42',
  SP: '35', SE: '28', TO: '17'
};

export const PRESET_MUNICIPALITIES: MunicipalityConfig[] = [
  {
    id: 'valparaiso-go',
    name: 'Valparaíso de Goiás',
    uf: 'GO',
    region: 'Entorno do DF',
    mayorName: 'Marcus Vinícius',
    secretaryName: 'Dr. Fernando Vasconcelos',
    inepCode: '5221858',
    cnpj: '01.613.385/0001-89',
    siopeCode: 'GO-522185',
    totalStudents: 28500,
    totalSchools: 48,
    totalTeachers: 1420,
    fundebVaatValue: 1250000,
    pnaeValue: 620000,
    lastCensoYear: '2024'
  },
  {
    id: 'luziania-go',
    name: 'Luziânia',
    uf: 'GO',
    region: 'Entorno do DF',
    mayorName: 'Diego Sorgatto',
    secretaryName: 'Profª Tiago Bastos',
    inepCode: '5212501',
    cnpj: '01.324.981/0001-52',
    siopeCode: 'GO-521250',
    totalStudents: 34200,
    totalSchools: 62,
    totalTeachers: 1850,
    fundebVaatValue: 1680000,
    pnaeValue: 840000,
    lastCensoYear: '2024'
  },
  {
    id: 'novo-gama-go',
    name: 'Novo Gama',
    uf: 'GO',
    region: 'Entorno do DF',
    mayorName: 'Carlinhos do Mangão',
    secretaryName: 'Profª Sônia Maria',
    inepCode: '5215231',
    cnpj: '01.782.112/0001-09',
    siopeCode: 'GO-521523',
    totalStudents: 19800,
    totalSchools: 35,
    totalTeachers: 980,
    fundebVaatValue: 980000,
    pnaeValue: 490000,
    lastCensoYear: '2024'
  },
  {
    id: 'cidade-ocidental-go',
    name: 'Cidade Ocidental',
    uf: 'GO',
    region: 'Entorno do DF',
    mayorName: 'Fábio Correa',
    secretaryName: 'Prof. Lairton Ribeiro',
    inepCode: '5205497',
    cnpj: '01.554.230/0001-44',
    siopeCode: 'GO-520549',
    totalStudents: 16400,
    totalSchools: 29,
    totalTeachers: 820,
    fundebVaatValue: 890000,
    pnaeValue: 410000,
    lastCensoYear: '2024'
  },
  {
    id: 'aguas-lindas-go',
    name: 'Águas Lindas de Goiás',
    uf: 'GO',
    region: 'Entorno do DF',
    mayorName: 'Lucas Antonietti',
    secretaryName: 'Prof. Evandro Silva',
    inepCode: '5200258',
    cnpj: '01.998.441/0001-77',
    siopeCode: 'GO-520025',
    totalStudents: 42100,
    totalSchools: 74,
    totalTeachers: 2100,
    fundebVaatValue: 2150000,
    pnaeValue: 1100000,
    lastCensoYear: '2024'
  },
  {
    id: 'formosa-go',
    name: 'Formosa',
    uf: 'GO',
    region: 'Nordeste Goiano',
    mayorName: 'Gustavo Marques',
    secretaryName: 'Profª Maria Amélia',
    inepCode: '5208004',
    cnpj: '01.123.889/0001-33',
    siopeCode: 'GO-520800',
    totalStudents: 21500,
    totalSchools: 42,
    totalTeachers: 1120,
    fundebVaatValue: 1100000,
    pnaeValue: 530000,
    lastCensoYear: '2024'
  },
  {
    id: 'goiania-go',
    name: 'Goiânia',
    uf: 'GO',
    region: 'Metropolitana de Goiânia',
    mayorName: 'Sandro Mabel',
    secretaryName: 'Prof. Wellington Bessa',
    inepCode: '5208707',
    cnpj: '01.612.092/0001-23',
    siopeCode: 'GO-520870',
    totalStudents: 112000,
    totalSchools: 178,
    totalTeachers: 6400,
    fundebVaatValue: 6800000,
    pnaeValue: 3400000,
    lastCensoYear: '2024'
  },
  {
    id: 'sobral-ce',
    name: 'Sobral',
    uf: 'CE',
    region: 'Sertão Cearense',
    mayorName: 'Ivo Gomes',
    secretaryName: 'Prof. Herbert Lima',
    inepCode: '2312908',
    cnpj: '07.598.634/0001-12',
    siopeCode: 'CE-231290',
    totalStudents: 35000,
    totalSchools: 58,
    totalTeachers: 1950,
    fundebVaatValue: 1950000,
    pnaeValue: 920000,
    lastCensoYear: '2024'
  },
  {
    id: 'fortaleza-ce',
    name: 'Fortaleza',
    uf: 'CE',
    region: 'Metropolitana de Fortaleza',
    mayorName: 'José Sarto',
    secretaryName: 'Profª Dalila Saldanha',
    inepCode: '2304400',
    cnpj: '07.954.605/0001-60',
    siopeCode: 'CE-230440',
    totalStudents: 240000,
    totalSchools: 310,
    totalTeachers: 11500,
    fundebVaatValue: 14200000,
    pnaeValue: 7800000,
    lastCensoYear: '2024'
  },
  {
    id: 'campinas-sp',
    name: 'Campinas',
    uf: 'SP',
    region: 'Metropolitana de Campinas',
    mayorName: 'Dário Saadi',
    secretaryName: 'Prof. José Tadeu',
    inepCode: '3509502',
    cnpj: '46.004.725/0001-88',
    siopeCode: 'SP-350950',
    totalStudents: 68000,
    totalSchools: 124,
    totalTeachers: 3800,
    fundebVaatValue: 4200000,
    pnaeValue: 2100000,
    lastCensoYear: '2024'
  },
  {
    id: 'sao-paulo-sp',
    name: 'São Paulo',
    uf: 'SP',
    region: 'Região Metropolitana de SP',
    mayorName: 'Ricardo Nunes',
    secretaryName: 'Prof. Fernando Padula',
    inepCode: '3550308',
    cnpj: '46.392.130/0001-18',
    siopeCode: 'SP-355030',
    totalStudents: 650000,
    totalSchools: 1540,
    totalTeachers: 32000,
    fundebVaatValue: 38000000,
    pnaeValue: 19500000,
    lastCensoYear: '2024'
  },
  {
    id: 'rio-de-janeiro-rj',
    name: 'Rio de Janeiro',
    uf: 'RJ',
    region: 'Metropolitana do RJ',
    mayorName: 'Eduardo Paes',
    secretaryName: 'Prof. Renan Ferreirinha',
    inepCode: '3304557',
    cnpj: '42.498.600/0001-71',
    siopeCode: 'RJ-330455',
    totalStudents: 640000,
    totalSchools: 1550,
    totalTeachers: 31500,
    fundebVaatValue: 36500000,
    pnaeValue: 18900000,
    lastCensoYear: '2024'
  },
  {
    id: 'recife-pe',
    name: 'Recife',
    uf: 'PE',
    region: 'Metropolitana do Recife',
    mayorName: 'João Campos',
    secretaryName: 'Prof. Fred Amancio',
    inepCode: '2611606',
    cnpj: '10.565.000/0001-92',
    siopeCode: 'PE-261160',
    totalStudents: 95000,
    totalSchools: 320,
    totalTeachers: 5400,
    fundebVaatValue: 5900000,
    pnaeValue: 2950000,
    lastCensoYear: '2024'
  },
  {
    id: 'salvador-ba',
    name: 'Salvador',
    uf: 'BA',
    region: 'Metropolitana de Salvador',
    mayorName: 'Bruno Reis',
    secretaryName: 'Prof. Thiago Dantas',
    inepCode: '2927408',
    cnpj: '13.927.801/0001-49',
    siopeCode: 'BA-292740',
    totalStudents: 140000,
    totalSchools: 430,
    totalTeachers: 7800,
    fundebVaatValue: 8500000,
    pnaeValue: 4200000,
    lastCensoYear: '2024'
  },
  {
    id: 'belo-horizonte-mg',
    name: 'Belo Horizonte',
    uf: 'MG',
    region: 'Metropolitana de BH',
    mayorName: 'Fuad Noman',
    secretaryName: 'Profª Roberta Gontijo',
    inepCode: '3106200',
    cnpj: '18.715.383/0001-40',
    siopeCode: 'MG-310620',
    totalStudents: 145000,
    totalSchools: 323,
    totalTeachers: 8100,
    fundebVaatValue: 8900000,
    pnaeValue: 4400000,
    lastCensoYear: '2024'
  },
  {
    id: 'curitiba-pr',
    name: 'Curitiba',
    uf: 'PR',
    region: 'Metropolitana de Curitiba',
    mayorName: 'Eduardo Pimentel',
    secretaryName: 'Profª Maria Sílvia Bacila',
    inepCode: '4106902',
    cnpj: '76.417.005/0001-86',
    siopeCode: 'PR-410690',
    totalStudents: 142000,
    totalSchools: 398,
    totalTeachers: 7900,
    fundebVaatValue: 8700000,
    pnaeValue: 4300000,
    lastCensoYear: '2024'
  },
  {
    id: 'porto-alegre-rs',
    name: 'Porto Alegre',
    uf: 'RS',
    region: 'Metropolitana de Porto Alegre',
    mayorName: 'Sebastião Melo',
    secretaryName: 'Prof. Mauricio Cunha',
    inepCode: '4314902',
    cnpj: '92.963.560/0001-60',
    siopeCode: 'RS-431490',
    totalStudents: 54000,
    totalSchools: 98,
    totalTeachers: 3200,
    fundebVaatValue: 3400000,
    pnaeValue: 1700000,
    lastCensoYear: '2024'
  },
  {
    id: 'manaus-am',
    name: 'Manaus',
    uf: 'AM',
    region: 'Metropolitana de Manaus',
    mayorName: 'David Almeida',
    secretaryName: 'Prof. Dulce Almeida',
    inepCode: '1302603',
    cnpj: '04.365.326/0001-80',
    siopeCode: 'AM-130260',
    totalStudents: 255000,
    totalSchools: 505,
    totalTeachers: 12800,
    fundebVaatValue: 15400000,
    pnaeValue: 7900000,
    lastCensoYear: '2024'
  },
  {
    id: 'florianopolis-sc',
    name: 'Florianópolis',
    uf: 'SC',
    region: 'Grande Florianópolis',
    mayorName: 'Topázio Neto',
    secretaryName: 'Prof. Maurício Fernandes',
    inepCode: '4205407',
    cnpj: '82.892.282/0001-09',
    siopeCode: 'SC-420540',
    totalStudents: 41000,
    totalSchools: 112,
    totalTeachers: 2600,
    fundebVaatValue: 2600000,
    pnaeValue: 1300000,
    lastCensoYear: '2024'
  },
  {
    id: 'brasilia-df',
    name: 'Brasília',
    uf: 'DF',
    region: 'Distrito Federal',
    mayorName: 'Ibaneis Rocha',
    secretaryName: 'Profª Hélvia Paranaguá',
    inepCode: '5300108',
    cnpj: '00.394.684/0001-53',
    siopeCode: 'DF-530010',
    totalStudents: 470000,
    totalSchools: 820,
    totalTeachers: 26000,
    fundebVaatValue: 28500000,
    pnaeValue: 14200000,
    lastCensoYear: '2024'
  }
];

export const lookupOrGenerateMunicipalityConfig = (name: string, uf: string): MunicipalityConfig => {
  const cleanName = name.trim();
  const cleanUf = (uf || 'GO').trim().toUpperCase();

  if (!cleanName) {
    return PRESET_MUNICIPALITIES[0];
  }

  // Try exact match in presets
  const exactMatch = PRESET_MUNICIPALITIES.find(
    (m) => m.name.toLowerCase() === cleanName.toLowerCase() && m.uf === cleanUf
  );
  if (exactMatch) return exactMatch;

  // Try fuzzy name match
  const fuzzyMatch = PRESET_MUNICIPALITIES.find(
    (m) => m.name.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(m.name.toLowerCase())
  );
  if (fuzzyMatch && cleanName.length >= 3) {
    return {
      ...fuzzyMatch,
      name: cleanName,
      uf: cleanUf,
      id: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cleanUf.toLowerCase()}`
    };
  }

  // Generate intelligent realistic parameters based on municipality name and UF
  const statePrefix = STATE_INEP_PREFIXES[cleanUf] || '52';

  // Compute a deterministic numeric hash from the municipality name
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const inepCode = `${statePrefix}${(10000 + (posHash % 89999)).toString().padStart(5, '0')}`;
  const siopeCode = `${cleanUf}-${inepCode.substring(0, 6)}`;
  const cnpjClean = `01.${(100 + (posHash % 899)).toString()}.${(100 + ((posHash >> 2) % 899)).toString()}/0001-${(10 + (posHash % 89)).toString()}`;

  // Estimate student count, schools, teachers according to municipality scale heuristics
  const totalStudents = 12000 + (posHash % 38000);
  const totalSchools = Math.max(12, Math.round(totalStudents / 550));
  const totalTeachers = Math.max(80, Math.round(totalStudents / 20));
  const fundebVaatValue = Math.round(totalStudents * 48);
  const pnaeValue = Math.round(totalStudents * 24);

  return {
    id: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cleanUf.toLowerCase()}`,
    name: cleanName,
    uf: cleanUf,
    region: `Região Municipal de ${cleanName} (${cleanUf})`,
    mayorName: `Prefeito(a) de ${cleanName}`,
    secretaryName: `Secretário(a) de Educação`,
    inepCode,
    cnpj: cnpjClean,
    siopeCode,
    totalStudents,
    totalSchools,
    totalTeachers,
    fundebVaatValue,
    pnaeValue,
    lastCensoYear: '2024'
  };
};

export const generateSchoolsForMunicipality = (muniName: string): School[] => {
  const isValparaiso = muniName.toLowerCase().includes('valparaíso');
  if (isValparaiso) {
    return [
      {
        id: 'sch-01',
        code: '5200101',
        name: 'EMEB Paulo Freire',
        region: 'Norte',
        director: 'Profª Maria Das Graças',
        status: 'atencao',
        studentCount: 820,
        teacherCount: 42,
        stages: ['anos_iniciais', 'anos_finais'],
        ideb: 4.8,
        frequencia: 88.5,
        alfabetizacao: 68,
        taxaAprovacao: 85.2,
        taxaAbandono: 4.8,
        distorcaoIdadeSerie: 21.5,
        execucaoFinanceira: 82.0,
        alunosEmRisco: 64,
        professoresSemFormacao: 5,
        hasInternetIssues: true,
        address: 'Rua 12, Qd. 45, Valparaíso I - Valparaíso de Goiás',
        phone: '(61) 3627-1001'
      },
      {
        id: 'sch-02',
        code: '5200102',
        name: 'EMEB Anísio Teixeira',
        region: 'Sul',
        director: 'Prof. Roberto Carlos Andrade',
        status: 'critico',
        studentCount: 650,
        teacherCount: 35,
        stages: ['anos_iniciais', 'anos_finais', 'eja'],
        ideb: 4.1,
        frequencia: 84.2,
        alfabetizacao: 54,
        taxaAprovacao: 78.0,
        taxaAbandono: 8.2,
        distorcaoIdadeSerie: 28.4,
        execucaoFinanceira: 65.4,
        alunosEmRisco: 92,
        professoresSemFormacao: 9,
        hasInternetIssues: true,
        address: 'Av. das Palmeiras, Bairro Jardim Céu Azul - Valparaíso de Goiás',
        phone: '(61) 3627-2002'
      },
      {
        id: 'sch-03',
        code: '5200103',
        name: 'CEMEI Monteiro Lobato',
        region: 'Centro',
        director: 'Profª Ana Lúcia Siqueira',
        status: 'destaque',
        studentCount: 420,
        teacherCount: 28,
        stages: ['educacao_infantil'],
        ideb: 6.2,
        frequencia: 96.1,
        alfabetizacao: 92,
        taxaAprovacao: 98.0,
        taxaAbandono: 0.5,
        distorcaoIdadeSerie: 4.1,
        execucaoFinanceira: 98.2,
        alunosEmRisco: 8,
        professoresSemFormacao: 0,
        hasInternetIssues: false,
        address: 'Rua das Flores, Etapa A - Valparaíso de Goiás',
        phone: '(61) 3627-3003'
      },
      {
        id: 'sch-04',
        code: '5200104',
        name: 'EMEB Juscelino Kubitschek',
        region: 'Leste',
        director: 'Prof. Carlos Eduardo Mendes',
        status: 'atencao',
        studentCount: 940,
        teacherCount: 48,
        stages: ['anos_iniciais', 'anos_finais'],
        ideb: 5.1,
        frequencia: 91.0,
        alfabetizacao: 72,
        taxaAprovacao: 88.5,
        taxaAbandono: 3.5,
        distorcaoIdadeSerie: 16.2,
        execucaoFinanceira: 88.0,
        alunosEmRisco: 42,
        professoresSemFormacao: 3,
        hasInternetIssues: false,
        address: 'Av. Central, Anhanguera C - Valparaíso de Goiás',
        phone: '(61) 3627-4004'
      },
      {
        id: 'sch-05',
        code: '5200105',
        name: 'EMEB Cora Coralina',
        region: 'Oeste',
        director: 'Profª Helena Meireles',
        status: 'destaque',
        studentCount: 780,
        teacherCount: 40,
        stages: ['anos_iniciais'],
        ideb: 5.9,
        frequencia: 95.4,
        alfabetizacao: 89,
        taxaAprovacao: 95.0,
        taxaAbandono: 1.1,
        distorcaoIdadeSerie: 8.0,
        execucaoFinanceira: 94.5,
        alunosEmRisco: 15,
        professoresSemFormacao: 1,
        hasInternetIssues: false,
        address: 'Rua 08, Parque Esplanada V - Valparaíso de Goiás',
        phone: '(61) 3627-5005'
      },
      {
        id: 'sch-06',
        code: '5200106',
        name: 'CEMEI Cecília Meireles',
        region: 'Norte',
        director: 'Profª Tereza Cristina',
        status: 'atencao',
        studentCount: 380,
        teacherCount: 22,
        stages: ['educacao_infantil'],
        ideb: 5.4,
        frequencia: 92.0,
        alfabetizacao: 80,
        taxaAprovacao: 92.0,
        taxaAbandono: 1.8,
        distorcaoIdadeSerie: 11.0,
        execucaoFinanceira: 89.0,
        alunosEmRisco: 20,
        professoresSemFormacao: 2,
        hasInternetIssues: true,
        address: 'Qd 10, Lote 12, Pacaembu - Valparaíso de Goiás',
        phone: '(61) 3627-6006'
      }
    ];
  }

  // Dynamic school list tailored for any chosen municipality name
  const prefixNames = [
    { type: 'EMEB', name: 'Escola Municipal Paulo Freire', region: 'Norte' as const, dir: 'Profª Maria Clara Santos' },
    { type: 'EMEB', name: 'Escola Municipal Anísio Teixeira', region: 'Sul' as const, dir: 'Prof. Roberto Carlos' },
    { type: 'CEMEI', name: 'Centro de Educação Infantil Monteiro Lobato', region: 'Centro' as const, dir: 'Profª Ana Lúcia' },
    { type: 'EMEB', name: 'Escola Municipal Juscelino Kubitschek', region: 'Leste' as const, dir: 'Prof. Carlos Eduardo' },
    { type: 'EMEB', name: 'Escola Municipal Cora Coralina', region: 'Oeste' as const, dir: 'Profª Helena Meireles' },
    { type: 'EMEB', name: 'Escola Municipal Santos Dumont', region: 'Norte' as const, dir: 'Prof. Fernando Peixoto' },
    { type: 'CEMEI', name: 'CEMEI Vinicius de Moraes', region: 'Sul' as const, dir: 'Profª Patricia Lima' }
  ];

  return prefixNames.map((item, index) => ({
    id: `sch-${index + 1}`,
    code: `MUN-${100 + index}`,
    name: `${item.name} (${muniName})`,
    region: item.region,
    director: item.dir,
    status: index === 1 ? 'critico' : index % 2 === 0 ? 'destaque' : 'atencao',
    studentCount: 400 + index * 90,
    teacherCount: 22 + index * 4,
    stages: index % 3 === 0 ? ['educacao_infantil'] : index % 2 === 0 ? ['anos_iniciais', 'anos_finais'] : ['anos_iniciais'],
    ideb: parseFloat((4.2 + (index * 0.35) % 2.1).toFixed(1)),
    frequencia: parseFloat((84 + (index * 2.3) % 12).toFixed(1)),
    alfabetizacao: Math.min(98, 55 + index * 7),
    taxaAprovacao: parseFloat((80 + (index * 2.8) % 16).toFixed(1)),
    taxaAbandono: parseFloat((1.2 + (index * 1.1) % 6).toFixed(1)),
    distorcaoIdadeSerie: parseFloat((6.5 + (index * 3.1) % 18).toFixed(1)),
    execucaoFinanceira: parseFloat((75 + (index * 4.2) % 22).toFixed(1)),
    alunosEmRisco: 12 + index * 11,
    professoresSemFormacao: index % 3,
    hasInternetIssues: index % 2 === 1,
    address: `Av. Central do Município, Bairro Centro - ${muniName}`,
    phone: `(00) 3000-000${index + 1}`
  }));
};
