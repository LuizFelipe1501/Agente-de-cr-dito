'use client';

import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  UserCheck, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface DashboardStatsProps {
  totalAnalyses: number;
  approvedCount: number;
  pendingDocsCount: number;
  humanReviewCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalAnalyses = 1482,
  approvedCount = 952,
  pendingDocsCount = 318,
  humanReviewCount = 212
}) => {
  const approvalRate = ((approvedCount / totalAnalyses) * 100).toFixed(1);
  const docsRate = ((pendingDocsCount / totalAnalyses) * 100).toFixed(1);
  const humanRate = ((humanReviewCount / totalAnalyses) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6">
      
      {/* 1. Total de Análises */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total de Análises</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <BarChart3 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-white">{totalAnalyses.toLocaleString('pt-BR')}</div>
          <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">+12.4%</span> este mês
          </p>
        </div>
      </div>

      {/* 2. Aprovação Automática */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 backdrop-blur-sm hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-300">Aprovação Direta</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-emerald-400">{approvedCount.toLocaleString('pt-BR')}</div>
          <p className="mt-1 text-[11px] text-emerald-300/80 font-medium">
            {approvalRate}% das operações
          </p>
        </div>
      </div>

      {/* 3. Documentação Complementar */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 backdrop-blur-sm hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-300">Docs Pendentes</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-amber-400">{pendingDocsCount.toLocaleString('pt-BR')}</div>
          <p className="mt-1 text-[11px] text-amber-300/80 font-medium">
            {docsRate}% aguardando upload
          </p>
        </div>
      </div>

      {/* 4. Encaminhados para Humanos */}
      <div className="relative overflow-hidden rounded-xl border border-pink-500/20 bg-pink-950/20 p-4 backdrop-blur-sm hover:border-pink-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-pink-300">Análise Humana</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-pink-400">{humanReviewCount.toLocaleString('pt-BR')}</div>
          <p className="mt-1 text-[11px] text-pink-300/80 font-medium">
            {humanRate}% encaminhados p/ mesa
          </p>
        </div>
      </div>

      {/* 5. Risco Médio Geral */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Risco Médio</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-slate-200">24.2 <span className="text-xs text-slate-400 font-normal">/100</span></div>
          <p className="mt-1 text-[11px] text-slate-400">
            Classificação geral: <span className="text-emerald-400 font-semibold">Baixo/Controlado</span>
          </p>
        </div>
      </div>

      {/* 6. Taxa de Confiança Médio */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-cyan-300">Confiança IA</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-cyan-400">96.4%</div>
          <p className="mt-1 text-[11px] text-cyan-300/80 font-medium">
            Precisão dos modelos RAG + XAI
          </p>
        </div>
      </div>

    </div>
  );
};
