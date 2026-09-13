'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { CustomerSelector } from '@/components/CustomerSelector';
import { AgentTimeline } from '@/components/AgentTimeline';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AuditTrailView } from '@/components/AuditTrailView';
import { RagPolicyModal } from '@/components/RagPolicyModal';

import { PRELOADED_CUSTOMERS } from '@/lib/mockProfiles';
import { CustomerInput, AnalysisResultFull, AuditTrailLog, AgentExecutionStep } from '@/types/credit';
import { executeFullCreditAnalysis } from '@/lib/agentEngine';

// Initial Mock Agent Steps for UI baseline before run
const INITIAL_AGENT_STEPS: AgentExecutionStep[] = [
  {
    agentId: 'profile',
    agentName: '1. Agente de Perfil do Cliente',
    role: 'Consolidação e interpretação do perfil do consumidor',
    status: 'pending',
    timestamp: '--:--',
    durationMs: 420,
    summary: 'Aguardando seleção do cliente...'
  },
  {
    agentId: 'risk',
    agentName: '2. Agente de Análise de Risco',
    role: 'Modelagem estatística de probabilidade de inadimplência (PD)',
    status: 'pending',
    timestamp: '--:--',
    durationMs: 580,
    summary: 'Aguardando cálculo estatístico...'
  },
  {
    agentId: 'policy',
    agentName: '3. Agente de Políticas e Compliance (RAG)',
    role: 'Recuperação de normas na base interna de conhecimento RAG',
    status: 'pending',
    timestamp: '--:--',
    durationMs: 640,
    summary: 'Aguardando consulta RAG...'
  },
  {
    agentId: 'explainability',
    agentName: '4. Agente de Explicabilidade (XAI)',
    role: 'Tradução transparente das justificativas sem viés',
    status: 'pending',
    timestamp: '--:--',
    durationMs: 780,
    summary: 'Aguardando síntese XAI...'
  },
  {
    agentId: 'supervisor',
    agentName: '5. Supervisor Inteligente',
    role: 'Consolidação final da recomendação e trava humana',
    status: 'pending',
    timestamp: '--:--',
    durationMs: 850,
    summary: 'Aguardando parecer final...'
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'demo' | 'audit' | 'policies'>('demo');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInput>(PRELOADED_CUSTOMERS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
  const [agentSteps, setAgentSteps] = useState<AgentExecutionStep[]>(INITIAL_AGENT_STEPS);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultFull | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>([]);

  // RAG Modal State
  const [isRagModalOpen, setIsRagModalOpen] = useState<boolean>(false);

  // Stats Counters
  const [stats, setStats] = useState({
    total: 1482,
    approved: 952,
    pendingDocs: 318,
    humanReview: 212
  });

  // Run Multi-Agent Credit Analysis Flow
  const handleRunAnalysis = async (input: CustomerInput) => {
    setSelectedCustomer(input);
    setIsAnalyzing(true);
    setCurrentAgentIndex(0);
    setAnalysisResult(null);

    // Animate sequential agent progression for demo presentation
    for (let i = 0; i < 5; i++) {
      setCurrentAgentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    try {
      // Execute multi-agent pipeline
      const fullResult = await executeFullCreditAnalysis(input);
      setAnalysisResult(fullResult);
      setAgentSteps(fullResult.executionSteps);

      // Create new audit trail entry
      const newAuditLog: AuditTrailLog = {
        id: 'LOG-' + Date.now(),
        analysisId: fullResult.id,
        timestamp: fullResult.timestamp,
        customerName: fullResult.customer.name,
        requestedAmount: fullResult.customer.requestedAmount,
        agentsInvolved: ['Perfil', 'Risco', 'RAG Compliance', 'Explicabilidade', 'Supervisor'],
        policiesConsulted: fullResult.policyCompliance.policiesConsulted.map(p => p.code),
        riskLevel: fullResult.supervisor.riskLevel,
        decision: fullResult.supervisor.finalDecision,
        confidencePct: fullResult.supervisor.confidencePct,
        requiresHumanReview: fullResult.supervisor.requiresHumanReview,
        openFinanceStatus: fullResult.customer.openFinance.isConnected ? 'Conectado' : 'Não Autorizado'
      };

      setAuditLogs((prev) => [newAuditLog, ...prev]);

      // Update counters
      setStats((prev) => {
        const isApproved = fullResult.supervisor.finalDecision === 'APROVAÇÃO AUTOMÁTICA';
        const isDocs = fullResult.supervisor.finalDecision === 'DOCUMENTAÇÃO COMPLEMENTAR';
        const isHuman = fullResult.supervisor.finalDecision === 'ANÁLISE HUMANA';

        return {
          total: prev.total + 1,
          approved: isApproved ? prev.approved + 1 : prev.approved,
          pendingDocs: isDocs ? prev.pendingDocs + 1 : prev.pendingDocs,
          humanReview: isHuman ? prev.humanReview + 1 : prev.humanReview
        };
      });

    } catch (error) {
      console.error('Análise falhou:', error);
    } finally {
      setIsAnalyzing(false);
      setCurrentAgentIndex(4);
    }
  };

  // Trigger default analysis on initial load
  useEffect(() => {
    handleRunAnalysis(PRELOADED_CUSTOMERS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalystAction = (action: 'APROVADO' | 'SOLICITADO_DOCS' | 'ENCAMINHADO_HUMANO', notes: string) => {
    if (!analysisResult) return;

    const actionText = action === 'APROVADO' ? 'APROVADO PELO ANALISTA' : action === 'SOLICITADO_DOCS' ? 'SOLICITADO DOCS PELO ANALISTA' : 'ENCAMINHADO PARA MESA HUMANA';

    // Update current result analyst state
    setAnalysisResult({
      ...analysisResult,
      analystAction: {
        action,
        analystName: 'Carlos Eduardo (Sênior)',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        notes
      }
    });

    // Update log in audit trail
    setAuditLogs((prev) =>
      prev.map((log) =>
        log.analysisId === analysisResult.id
          ? { ...log, analystDecision: actionText }
          : log
      )
    );
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        onOpenRag={() => setIsRagModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Tab: DEMO PAINEL DE ANÁLISE */}
        {activeTab === 'demo' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Global Stats Bar */}
            <DashboardStats
              totalAnalyses={stats.total}
              approvedCount={stats.approved}
              pendingDocsCount={stats.pendingDocs}
              humanReviewCount={stats.humanReview}
            />

            {/* Customer Profile Selector Grid */}
            <CustomerSelector
              onSelectCustomer={(c) => setSelectedCustomer(c)}
              onRunAnalysis={handleRunAnalysis}
              selectedCustomerId={selectedCustomer.id}
              isAnalyzing={isAnalyzing}
            />

            {/* Agent Architecture Pipeline Timeline */}
            <AgentTimeline
              steps={agentSteps}
              currentRunningIndex={currentAgentIndex}
              isAnalyzing={isAnalyzing}
            />

            {/* Results Cards & Analyst Panel */}
            {analysisResult && !isAnalyzing && (
              <div className="animate-fadeIn">
                <AnalysisResults
                  result={analysisResult}
                  onAnalystAction={handleAnalystAction}
                  onOpenRag={() => setIsRagModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Tab: TRILHA DE AUDITORIA */}
        {activeTab === 'audit' && (
          <div className="animate-fadeIn">
            <AuditTrailView logs={auditLogs} />
          </div>
        )}

        {/* Navigation Tab: BASE RAG DE POLÍTICAS */}
        {activeTab === 'policies' && (
          <div className="animate-fadeIn">
            <RagPolicyModal isOpen={true} onClose={() => setActiveTab('demo')} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-pink-400">Klarna Smart Credit AI</span> • Protótipo de Apoio à Concessão de Crédito
          </div>
          <div>
            Desenvolvido com Next.js 14, Tailwind CSS, Google Gemini 2.0 Flash & Arquitetura Multi-Agente RAG/XAI
          </div>
        </div>
      </footer>

      {/* RAG Modal */}
      <RagPolicyModal
        isOpen={isRagModalOpen}
        onClose={() => setIsRagModalOpen(false)}
      />

    </div>
  );
}
