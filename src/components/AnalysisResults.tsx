'use client';

import React, { useState } from 'react';
import { AnalysisResultFull, DecisionType } from '@/types/credit';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  BookOpen, 
  User, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Eye, 
  Send, 
  Check, 
  ArrowRight,
  Info,
  Layers,
  Building2,
  Link2,
  Link2Off,
  Wallet,
  Landmark
} from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResultFull;
  onAnalystAction: (action: 'APROVADO' | 'SOLICITADO_DOCS' | 'ENCAMINHADO_HUMANO', notes: string) => void;
  onOpenRag: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onAnalystAction,
  onOpenRag
}) => {
  const { customer, riskAnalysis, policyCompliance, explainability, supervisor } = result;
  const of = customer.openFinance;

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'openFinance' | 'xai' | 'rag' | 'customerView'>('overview');
  const [actionModal, setActionModal] = useState<'APROVADO' | 'SOLICITADO_DOCS' | 'ENCAMINHADO_HUMANO' | null>(null);
  const [analystNotes, setAnalystNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleConfirmAction = () => {
    if (!actionModal) return;
    onAnalystAction(actionModal, analystNotes);
    
    let msg = 'Ação registrada com sucesso na Trilha de Auditoria.';
    if (actionModal === 'APROVADO') msg = 'Crédito Aprovado com sucesso pelo Analista!';
    else if (actionModal === 'SOLICITADO_DOCS') msg = 'Notificação de envio de documentação disparada para o cliente.';
    else if (actionModal === 'ENCAMINHADO_HUMANO') msg = 'Caso encaminhado para o Comitê Humano de Crédito.';
    
    setActionSuccessMessage(msg);
    setActionModal(null);
    setAnalystNotes('');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Decision Badge Styling
  let decisionBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let decisionIcon = <CheckCircle2 className="h-6 w-6 text-emerald-400" />;

  if (supervisor.finalDecision === 'DOCUMENTAÇÃO COMPLEMENTAR') {
    decisionBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    decisionIcon = <AlertTriangle className="h-6 w-6 text-amber-400" />;
  } else if (supervisor.finalDecision === 'ANÁLISE HUMANA') {
    decisionBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    decisionIcon = <ShieldAlert className="h-6 w-6 text-rose-400" />;
  }

  return (
    <div className="space-y-6">
      
      {/* SUCCESS BANNER WHEN ANALYST TAKES ACTION */}
      {actionSuccessMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-4 text-emerald-300 flex items-center justify-between shadow-glow-green animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold">{actionSuccessMessage}</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Trilha de Auditoria Registrada</span>
        </div>
      )}

      {/* TOP SUPERVISOR RECOMMENDATION BANNER */}
      <div className={`rounded-2xl border p-6 shadow-2xl backdrop-blur-md ${decisionBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Decision Title & Badge */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-slate-300 border border-slate-800">
                RECOMENDAÇÃO DO SUPERVISOR INTELIGENTE
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Confiança IA + Open Finance: <span className="text-white font-bold">{supervisor.confidencePct}%</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {decisionIcon}
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {supervisor.finalDecision}
              </h2>
            </div>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {supervisor.justification}
            </p>
          </div>

          {/* Quick Stats side card */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 text-xs min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nível de Risco:</span>
              <span className={`font-bold ${
                supervisor.riskLevel === 'BAIXO' ? 'text-emerald-400' : supervisor.riskLevel === 'MODERADO' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {supervisor.riskLevel} RISCO ({riskAnalysis.defaultProbabilityPct}% PD)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Open Finance:</span>
              <span className={`font-bold ${of.isConnected ? 'text-cyan-400' : 'text-slate-500'}`}>
                {of.isConnected ? `Ativo (${of.incomeMatchPct}% Match)` : 'Não Autorizado'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-400">Supervisão Humana:</span>
              <span className={`font-bold ${supervisor.requiresHumanReview ? 'text-pink-400' : 'text-slate-400'}`}>
                {supervisor.requiresHumanReview ? 'Obrigatória (Mesa)' : 'Opcional / Copiloto'}
              </span>
            </div>
          </div>

        </div>

        {/* Human Supervision Safeguard Banner */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-pink-400 flex-shrink-0" />
          <span>
            <strong>Princípio de Governança Klarna:</strong> Esta recomendação combina Inteligência Artificial, dados Open Finance e normas RAG. Decisões de alto impacto exigem validação do especialista humano.
          </span>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-slate-800 text-pink-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Visão Geral & Cards</span>
        </button>

        <button
          onClick={() => setActiveSubTab('openFinance')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'openFinance'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Landmark className="h-4 w-4 text-cyan-400" />
          <span>Open Finance Insights ({of.isConnected ? 'Validado' : 'Sem Dados'})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('xai')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'xai'
              ? 'bg-slate-800 text-pink-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Por que essa recomendação? (XAI)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rag')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'rag'
              ? 'bg-slate-800 text-pink-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Fontes RAG Consultadas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('customerView')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === 'customerView'
              ? 'bg-slate-800 text-pink-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Visão Transparente do Cliente</span>
        </button>
      </div>

      {/* SUB TAB 1: OVERVIEW CARDS GRID */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Card 1: Perfil do Cliente */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                Agente de Perfil do Cliente
              </h3>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                Tier {customer.relationshipTier}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Nome do Cliente:</span>
                <span className="font-semibold text-white">{customer.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Renda Mensal Declarada:</span>
                <span className="font-bold text-emerald-400">R$ {customer.monthlyIncome.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Valor Solicitado:</span>
                <span className="font-bold text-pink-400">R$ {customer.requestedAmount.toLocaleString('pt-BR')} ({customer.installments}x)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Parcela Mensal Estimada:</span>
                <span className="font-semibold text-slate-200">R$ {customer.estimatedInstallment.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Comprometimento de Renda:</span>
                <span className={`font-bold ${customer.incomeCommitmentPct > 40 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {customer.incomeCommitmentPct}%
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status Open Finance:</span>
                <span className={`font-bold ${of.isConnected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {of.isConnected ? `${of.connectedBanks.join(', ')}` : 'Não Conectado'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Análise de Risco & Open Finance Adjustment */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                Agente de Análise de Risco
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                riskAnalysis.riskLevel === 'BAIXO' ? 'bg-emerald-500/20 text-emerald-400' : riskAnalysis.riskLevel === 'MODERADO' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {riskAnalysis.riskLevel} RISCO
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Metric Gauge representation */}
              <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 text-center">
                <div className="text-3xl font-black text-white">{riskAnalysis.defaultProbabilityPct}%</div>
                <div className="text-[11px] text-slate-400 mt-1">Probabilidade Estimada de Inadimplência (PD)</div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      riskAnalysis.defaultProbabilityPct > 15 ? 'bg-rose-500' : riskAnalysis.defaultProbabilityPct > 5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(riskAnalysis.defaultProbabilityPct * 2.5, 100)}%` }}
                  />
                </div>
              </div>

              {/* Open Finance Risk Adjustment Banner */}
              <div className="rounded-xl bg-cyan-950/20 p-3 border border-cyan-500/20 text-xs text-cyan-300">
                <span className="font-bold flex items-center gap-1 text-cyan-400 text-[11px]">
                  <Landmark className="h-3.5 w-3.5" /> Impacto Open Finance no Risco:
                </span>
                <p className="mt-1 text-[11px] text-cyan-200">{riskAnalysis.openFinanceRiskAdjustment}</p>
              </div>

              {/* Fraud Warnings */}
              {riskAnalysis.fraudAlerts.length > 0 && (
                <div className="rounded-xl bg-rose-950/30 p-3 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-rose-400">
                    <ShieldAlert className="h-3.5 w-3.5" /> Sinais de Atenção / Inconsistência:
                  </span>
                  {riskAnalysis.fraudAlerts.map((alert, idx) => (
                    <p key={idx} className="text-[11px]">• {alert}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: RAG Fontes e Explicabilidade Resumida */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-pink-400" />
                Políticas RAG & Auditoria
              </h3>
              <button
                onClick={onOpenRag}
                className="text-[10px] text-pink-400 hover:underline flex items-center gap-1"
              >
                Ver Base Completa <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <span className="text-slate-400 font-semibold text-[11px] block">Fontes Internas Consultadas:</span>
              
              {policyCompliance.policiesConsulted.map((pol) => (
                <div key={pol.policyId} className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px]">{pol.title}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                      pol.status === 'CONFORME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {pol.status}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 space-y-0.5">
                    {pol.matchedRules.map((rule, rIdx) => (
                      <p key={rIdx} className="line-clamp-1 text-slate-300">• {rule}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-3 rounded-lg bg-pink-500/5 p-3 border border-pink-500/20 text-[11px] text-pink-300">
                <span className="font-bold block mb-1 text-pink-400">Ação Recomendada pelo Supervisor:</span>
                <p className="leading-snug">{supervisor.recommendedNextAction}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB: OPEN FINANCE INSIGHTS DETAILED VIEW */}
      {activeSubTab === 'openFinance' && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Consensamento & Insights de Open Finance</h3>
                <p className="text-xs text-slate-400">
                  Dados integrados via ecossistema Open Finance do Banco Central do Brasil para validação de renda e capacidade financeira
                </p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold border ${
              of.isConnected ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {of.isConnected ? '✓ Consentimento Ativo' : '✕ Não Compartilhado'}
            </span>
          </div>

          {of.isConnected ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Institution Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Instituições Conectadas</span>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-400" />
                  {of.connectedBanks.join(', ')}
                </div>
                <p className="text-[11px] text-slate-400">Consentimento válido até {of.consentExpiresAt}</p>
              </div>

              {/* Verified Income Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Renda Validada via Pix/Extrato</span>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  R$ {of.verifiedMonthlyInflow.toLocaleString('pt-BR')}
                </div>
                <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {of.incomeMatchPct}% Convergência
                </span>
              </div>

              {/* Overdraft Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Uso de Cheque Especial (180d)</span>
                <div className={`text-base font-bold ${of.overdraftUsage180d ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {of.overdraftUsage180d ? 'Uso Recente Detectado' : 'Sem Uso Registrado'}
                </div>
                <p className="text-[11px] text-slate-400">Monitoramento contínuo de liquidez</p>
              </div>

              {/* External Debt Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dívidas em Outros Bancos</span>
                <div className={`text-base font-bold ${of.externalDebtCommitment > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  R$ {of.externalDebtCommitment.toLocaleString('pt-BR')}
                </div>
                <p className="text-[11px] text-slate-400">Comprometimento em outras instituições</p>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-6 text-center space-y-3">
              <Link2Off className="h-8 w-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-bold text-amber-300">Cliente Não Autorizou o Compartilhamento de Dados Open Finance</h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                A ausência de dados Open Finance impede a comprovação automática de renda via estrato bancário, reduzindo o índice de confiança dos modelos de IA e aumentando a probabilidade de exigência de documentação física ou encaminhamento humano.
              </p>
            </div>
          )}

        </div>
      )}

      {/* SUB TAB 2: EXPLAINABILITY (XAI) */}
      {activeSubTab === 'xai' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-pink-400" />
              Por que essa recomendação? (Explainable AI - XAI)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Síntese transparente gerada dinamicamente com base em evidências do perfil e Open Finance.
            </p>
          </div>

          {/* Explanation Summary Box */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-sm text-slate-200 leading-relaxed">
            <span className="text-xs font-bold text-pink-400 block mb-1">Resumo Executivo da Decisão:</span>
            <p>{explainability.summary}</p>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Positive Drivers */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Fatores Positivos Identificados ({explainability.positiveFactors.length})
              </h4>
              <div className="space-y-2 text-xs">
                {explainability.positiveFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start space-x-2 rounded-lg bg-slate-950/60 p-2.5 border border-emerald-500/20 text-emerald-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Drivers */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Fatores de Atenção Identificados ({explainability.attentionFactors.length})
              </h4>
              <div className="space-y-2 text-xs">
                {explainability.attentionFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start space-x-2 rounded-lg bg-slate-950/60 p-2.5 border border-amber-500/20 text-amber-300">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Future Guidance Box */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-cyan-400 block mb-1">Orientação para Futuras Solicitações:</span>
            <p>{explainability.futureGuidance}</p>
          </div>
        </div>
      )}

      {/* SUB TAB 3: RAG SOURCES DETAILED VIEW */}
      {activeSubTab === 'rag' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-pink-400" />
              Fontes Consultadas (RAG Knowledge Retrieval)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Políticas internas fictícias recuperadas antes da recomendação para garantia de zero alucinação.
            </p>
          </div>

          <div className="space-y-4">
            {policyCompliance.policiesConsulted.map((pol) => (
              <div key={pol.policyId} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider">{pol.code} • {pol.version}</span>
                    <h4 className="text-sm font-bold text-white">{pol.title}</h4>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                    pol.status === 'CONFORME'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : pol.status === 'REQUER_DOCUMENTOS'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    Status: {pol.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <span className="font-semibold text-slate-400">Regras e Evidências Aplicadas nesta Operação:</span>
                  {pol.matchedRules.map((rule, idx) => (
                    <div key={idx} className="rounded-md bg-slate-900/90 p-2.5 border border-slate-800 font-mono text-[11px] text-pink-300/90">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: CUSTOMER TRANSPARENT VIEW */}
      {activeSubTab === 'customerView' && (
        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Simulação da Experiência do Cliente</h3>
                <p className="text-xs text-slate-400">Como esta análise é apresentada no aplicativo mobile Klarna</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 border border-slate-700">
              Visão do Consumidor
            </span>
          </div>

          {/* App Mockup Container */}
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400">Klarna App</span>
              <span className="text-[10px] text-slate-500">Status da Solicitação</span>
            </div>

            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center space-y-2">
              <div className="text-xs text-slate-400">Solicitação de Crédito</div>
              <div className="text-2xl font-bold text-white">R$ {customer.requestedAmount.toLocaleString('pt-BR')}</div>
              <div className="text-xs text-pink-400 font-semibold">{supervisor.finalDecision}</div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <span className="font-bold text-white block">Entenda sua Análise:</span>
              <p>{supervisor.customerFacingExplanation}</p>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-500">
              Dúvidas? Fale com nosso suporte transparente no app 24/7.
            </div>
          </div>
        </div>
      )}

      {/* ANALYST DECISION WORKFLOW PANEL */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              Painel de Decisão do Analista de Crédito
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Valide a recomendação da IA e Open Finance e registre a decisão final no sistema.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Analista Responsável: <strong className="text-white">Carlos Eduardo (Sênior)</strong>
          </span>
        </div>

        {/* Decision Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActionModal('APROVADO')}
            className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-green hover:bg-emerald-500 transition-all cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Aprovar Crédito</span>
          </button>

          <button
            onClick={() => setActionModal('SOLICITADO_DOCS')}
            className="flex items-center space-x-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-amber hover:bg-amber-500 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Solicitar Documentação</span>
          </button>

          <button
            onClick={() => setActionModal('ENCAMINHADO_HUMANO')}
            className="flex items-center space-x-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-all cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Encaminhar para Mesa Humana</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-pink-400" />
              Confirmar Decisão do Analista
            </h4>

            <p className="text-xs text-slate-300">
              Você está registrando a seguinte ação no sistema para o cliente <strong>{customer.name}</strong>:
            </p>

            <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs font-bold text-pink-400 text-center">
              {actionModal === 'APROVADO' ? 'APROVAÇÃO DE CRÉDITO' : actionModal === 'SOLICITADO_DOCS' ? 'SOLICITAR DOCUMENTAÇÃO COMPLEMENTAR' : 'ENCAMINHAMENTO PARA MESA HUMANA DE CRÉDITO'}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações / Parecer do Analista:
              </label>
              <textarea
                value={analystNotes}
                onChange={(e) => setAnalystNotes(e.target.value)}
                placeholder="Insira comentários adicionais ou justificativa para a trilha de auditoria..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-pink-500 focus:outline-none h-24"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setActionModal(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                className="rounded-lg bg-pink-500 px-5 py-2 text-xs font-bold text-white shadow-glow-pink hover:bg-pink-600"
              >
                Confirmar Registro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
