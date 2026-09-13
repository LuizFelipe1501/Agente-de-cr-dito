'use client';

import React from 'react';
import { AgentExecutionStep } from '@/types/credit';
import { User, ShieldAlert, BookOpen, Lightbulb, ShieldCheck, CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface AgentTimelineProps {
  steps: AgentExecutionStep[];
  currentRunningIndex: number;
  isAnalyzing: boolean;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({
  steps,
  currentRunningIndex,
  isAnalyzing
}) => {
  const agentIcons: Record<string, React.ReactNode> = {
    profile: <User className="h-4 w-4" />,
    risk: <ShieldAlert className="h-4 w-4" />,
    policy: <BookOpen className="h-4 w-4" />,
    explainability: <Lightbulb className="h-4 w-4" />,
    supervisor: <ShieldCheck className="h-4 w-4 text-pink-400" />
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md mb-8">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            Fluxo Sequencial dos Agentes Especializados de IA
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstração da orquestração multi-agente em tempo real
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center space-x-2 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 border border-pink-500/30 animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Processando Etapa {currentRunningIndex + 1}/5</span>
          </div>
        )}
      </div>

      {/* Agents Stepper Bar */}
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5">
        {steps.map((step, idx) => {
          const isDone = idx < currentRunningIndex || (!isAnalyzing && currentRunningIndex >= 4);
          const isRunning = isAnalyzing && idx === currentRunningIndex;
          const isPending = !isDone && !isRunning;

          return (
            <div
              key={step.agentId}
              className={`relative rounded-xl p-3 border transition-all ${
                isRunning
                  ? 'bg-slate-800/90 border-pink-500 shadow-glow-pink ring-1 ring-pink-500/60'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Header inside agent box */}
              <div className="flex items-center justify-between">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isRunning
                    ? 'bg-pink-500 text-white shadow-glow-pink'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {agentIcons[step.agentId]}
                </div>

                <div className="text-[10px]">
                  {isRunning ? (
                    <span className="rounded-full bg-pink-500/20 px-2 py-0.5 font-bold text-pink-400 animate-pulse">
                      Em Execução
                    </span>
                  ) : isDone ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Concluído
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Aguardando</span>
                  )}
                </div>
              </div>

              {/* Title & Role */}
              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-white truncate">{step.agentName}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{step.role}</p>
              </div>

              {/* Summary text */}
              {isDone && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 leading-tight">
                  <p className="line-clamp-2">{step.summary}</p>
                  <div className="mt-1 flex items-center justify-between text-slate-500 text-[9px]">
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {step.durationMs}ms
                    </span>
                    <span>{step.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
