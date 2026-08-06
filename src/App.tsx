import React, { useState } from 'react';
import { CockpitProvider, useCockpit } from './context/CockpitContext';
import { Header } from './components/Header';
import { TopKpiCards } from './components/TopKpiCards';
import { KpiMatrixTable } from './components/KpiMatrixTable';
import { RightSidebarPanels } from './components/RightSidebarPanels';
import { KpiDetailModal } from './components/KpiDetailModal';
import { SchoolDetailView } from './components/SchoolDetailView';
import { SchoolComparisonView } from './components/SchoolComparisonView';
import { ActionPlansView } from './components/ActionPlansView';
import { AlertsCenterView } from './components/AlertsCenterView';
import { ApiIntegrationView } from './components/ApiIntegrationView';
import { RadarRecursosView } from './components/RadarRecursosView';
import { MobileSchoolView } from './components/MobileSchoolView';
import { MunicipalityConfigView } from './components/MunicipalityConfigView';
import { TvPresentationMode } from './components/TvPresentationMode';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { InstitutionalWoodPlaque } from './components/InstitutionalWoodPlaque';
import { YoYComparisonChart } from './components/YoYComparisonChart';

function MainCockpitContent() {
  const {
    activeTab,
    isTvMode,
    openKpiDetailModal,
    setOpenKpiDetailModal
  } = useCockpit();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If in TV presentation mode, render TV view fullscreen
  if (isTvMode) {
    return <TvPresentationMode />;
  }

  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      <div>
        <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

        <main className="max-w-[1920px] mx-auto p-3 sm:p-4 md:p-6 space-y-6">
          {/* Main Tab Switcher */}
          {activeTab === 'cockpit' && (
            <div className="space-y-6 animate-fade-in">
              <TopKpiCards />

              {/* YoY Comparison Chart Component */}
              <YoYComparisonChart anoBase={2025} anoVigente={2026} />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-9">
                  <KpiMatrixTable />
                </div>
                <div className="xl:col-span-3">
                  <RightSidebarPanels />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escolas' && (
            <div className="animate-fade-in">
              <SchoolDetailView />
            </div>
          )}

          {activeTab === 'comparativo' && (
            <div className="animate-fade-in">
              <SchoolComparisonView />
            </div>
          )}

          {activeTab === 'planos_acao' && (
            <div className="animate-fade-in">
              <ActionPlansView />
            </div>
          )}

          {activeTab === 'alertas' && (
            <div className="animate-fade-in">
              <AlertsCenterView />
            </div>
          )}

          {activeTab === 'api_integracao' && (
            <div className="animate-fade-in">
              <ApiIntegrationView />
            </div>
          )}

          {activeTab === 'radar_recursos' && (
            <div className="animate-fade-in">
              <RadarRecursosView />
            </div>
          )}

          {activeTab === 'mobile_escola' && (
            <div className="animate-fade-in">
              <MobileSchoolView />
            </div>
          )}

          {activeTab === 'configuracao' && (
            <div className="animate-fade-in">
              <MunicipalityConfigView />
            </div>
          )}
        </main>
      </div>

      <Footer />
      <InstitutionalWoodPlaque />

      {/* KPI Detail Modal */}
      <KpiDetailModal
        kpi={openKpiDetailModal}
        onClose={() => setOpenKpiDetailModal(null)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CockpitProvider>
      <MainCockpitContent />
    </CockpitProvider>
  );
}
