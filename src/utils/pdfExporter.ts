import jsPDF from 'jspdf';
import { KpiIndicator, School, AlertItem, ActionPlan } from '../types';

export function exportCockpitPdf(
  municipality: string,
  kpis: KpiIndicator[],
  schools: School[],
  alerts: AlertItem[],
  actionPlans: ActionPlan[]
) {
  const doc = new jsPDF();

  // Header background
  doc.setFillColor(11, 19, 42); // Dark navy
  doc.rect(0, 0, 210, 35, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('COCKPIT DE INTELIGÊNCIA EDUCACIONAL', 14, 16);

  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text(`SECRETARIA MUNICIPAL DE EDUCAÇÃO DE ${municipality.toUpperCase()}`, 14, 25);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const nowStr = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR');
  doc.text(`Relatório Executivo Gerado em: ${nowStr}`, 130, 25);

  let y = 45;

  // Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. RESUMO EXECUTIVO DA REDE', 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Índice Geral da Educação: 72,4 / 100 (+8,7 pts vs. ano anterior)`, 16, y); y += 5;
  doc.text(`• Total de Escolas Monitoradas: ${schools.length} unidades (8 Destaque, 3 Atenção, 2 Críticas)`, 16, y); y += 5;
  doc.text(`• Frequência Média Geral: 91,3% | Taxa de Aprovação: 87,6%`, 16, y); y += 5;
  doc.text(`• Alunos Identificados em Risco: 427 estudantes sob acompanhamento`, 16, y); y += 5;
  doc.text(`• Recursos PDDE / PNAE Disponíveis: R$ 2,6 milhões em execução`, 16, y); y += 10;

  // KPIs Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ACOMPANHAMENTO DOS PRINCIPAIS INDICADORES (KPIs)', 14, y);
  y += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 6, 'F');
  doc.text('INDICADOR', 16, y + 4.5);
  doc.text('RESULTADO ATUAL', 80, y + 4.5);
  doc.text('META ESTRATÉGICA', 118, y + 4.5);
  doc.text('META EXCELÊNCIA', 155, y + 4.5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  kpis.slice(0, 8).forEach((k) => {
    doc.text(k.name, 16, y);
    doc.text(`${k.currentValue} ${k.unit}`, 80, y);
    doc.text(`${k.target2025} ${k.unit}`, 120, y);
    doc.text(`${k.targetExcellence} ${k.unit}`, 155, y);
    y += 5;
  });

  y += 8;

  // Active Alerts Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. CENTRAL DE ALERTAS & PLANOS DE AÇÃO', 14, y);
  y += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const activeAlerts = alerts.filter((a) => !a.resolved);
  doc.text(`Alertas Ativos Registrados: ${activeAlerts.length} ocorrências`, 16, y); y += 5;
  activeAlerts.slice(0, 3).forEach((a) => {
    doc.text(`- [${a.severity.toUpperCase()}] ${a.title}`, 18, y); y += 5;
  });

  y += 5;
  doc.text(`Planos de Ação Cadastrados: ${actionPlans.length} planos em acompanhamento`, 16, y); y += 5;
  actionPlans.slice(0, 3).forEach((p) => {
    doc.text(`- ${p.title} (Progresso: ${p.completionPercentage}% - Resp: ${p.responsible})`, 18, y); y += 5;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('#EducaçãoQueTransforma — Documento Gerado pelo Cockpit de Inteligência Educacional', 14, 285);

  doc.save(`Cockpit_Educacional_${municipality.replace(/\s+/g, '_')}.pdf`);
}
