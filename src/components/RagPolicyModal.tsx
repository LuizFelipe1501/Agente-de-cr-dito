'use client';

import React, { useState } from 'react';
import { CREDIT_POLICIES_DATABASE } from '@/lib/policiesData';
import { BookOpen, ShieldCheck, X, FileText, CheckCircle2 } from 'lucide-react';

interface RagPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RagPolicyModal: React.FC<RagPolicyModalProps> = ({ isOpen, onClose }) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState(CREDIT_POLICIES_DATABASE[0].id);

  if (!isOpen) return null;

  const currentPolicy = CREDIT_POLICIES_DATABASE.find(p => p.id === selectedPolicyId) || CREDIT_POLICIES_DATABASE[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Base RAG de Políticas de Crédito & Compliance</h3>
              <p className="text-xs text-slate-400">
                Repositório oficial de normas consultadas pelo Agente de Compliance em tempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Policy Selector Sidebar */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-3 space-y-2 overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Documentos Disponíveis</span>
            {CREDIT_POLICIES_DATABASE.map((pol) => {
              const isSelected = pol.id === currentPolicy.id;
              return (
                <button
                  key={pol.id}
                  onClick={() => setSelectedPolicyId(pol.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-glow-pink'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono text-pink-400 block">{pol.code} • {pol.version}</span>
                  <h4 className="text-xs font-bold truncate mt-0.5">{pol.title}</h4>
                  <span className="mt-1 inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">
                    Categoria: {pol.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Policy Detail View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-pink-400">{currentPolicy.code} ({currentPolicy.version})</span>
                <h3 className="text-xl font-black text-white">{currentPolicy.title}</h3>
              </div>
              <span className="rounded-lg bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300 border border-pink-500/20">
                Categoria: {currentPolicy.category}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 block mb-1">Escopo do Documento:</span>
              <p>{currentPolicy.content}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Regras e Diretrizes Regulatórias ({currentPolicy.rules.length})
              </h4>
              <div className="space-y-2">
                {currentPolicy.rules.map((rule, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
