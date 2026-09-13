'use client';

import React, { useState } from 'react';
import { PRELOADED_CUSTOMERS, PreloadedCustomerProfile } from '@/lib/mockProfiles';
import { CustomerInput } from '@/types/credit';
import { User, Play, Plus, Sliders, ShieldAlert, CheckCircle, AlertTriangle, FileSearch, Building2, Link2, Link2Off } from 'lucide-react';

interface CustomerSelectorProps {
  onSelectCustomer: (customer: CustomerInput) => void;
  onRunAnalysis: (customer: CustomerInput) => void;
  selectedCustomerId?: string;
  isAnalyzing: boolean;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  onSelectCustomer,
  onRunAnalysis,
  selectedCustomerId,
  isAnalyzing
}) => {
  const [selectedProfile, setSelectedProfile] = useState<PreloadedCustomerProfile>(PRELOADED_CUSTOMERS[0]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom Form State
  const [customForm, setCustomForm] = useState<CustomerInput>({
    name: 'Roberto Mendes',
    cpf: '490.123.890-55',
    requestedAmount: 12000,
    installments: 12,
    monthlyIncome: 8500,
    paymentHistoryScore: 82,
    delinquencyHistory: 'Sem atrasos',
    limitUtilizationPct: 45,
    purchaseFrequency: 'Alta',
    averageTicket: 420,
    recentFinancialBehavior: 'Estável',
    accountAgeMonths: 18,
    notes: 'Análise personalizada manual',
    openFinance: {
      isConnected: true,
      connectedBanks: ['Itaú Unibanco', 'BTG Pactual'],
      verifiedMonthlyInflow: 8500,
      overdraftUsage180d: false,
      externalDebtCommitment: 0,
      transactionalScore: 90,
      consentExpiresAt: '15/10/2027',
      incomeMatchPct: 100
    }
  });

  const handleSelect = (customer: PreloadedCustomerProfile) => {
    setSelectedProfile(customer);
    onSelectCustomer(customer);
  };

  const handleRunCurrent = () => {
    onRunAnalysis(selectedProfile);
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomModalOpen(false);
    onRunAnalysis(customForm);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-pink-400" />
            1. Seleção do Perfil do Cliente & Open Finance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Escolha um dos 4 cenários fictícios pré-cadastrados com compartilhamento de dados Open Finance ou crie um cliente personalizado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>Perfil Personalizado</span>
          </button>

          <button
            onClick={handleRunCurrent}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-pink hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Executando Agentes...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Executar Análise Completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preloaded Profiles Cards Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRELOADED_CUSTOMERS.map((cust) => {
          const isSelected = selectedProfile.id === cust.id;
          const of = cust.openFinance;

          let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          let icon = <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />;
          
          if (cust.badge === 'Risco Moderado') {
            badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            icon = <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
          } else if (cust.badge === 'Alto Risco') {
            badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            icon = <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />;
          } else if (cust.badge === 'Suspeita de Inconsistência') {
            badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            icon = <FileSearch className="h-3.5 w-3.5 text-purple-400" />;
          }

          return (
            <div
              key={cust.id}
              onClick={() => handleSelect(cust)}
              className={`relative cursor-pointer rounded-xl p-4 transition-all border ${
                isSelected
                  ? 'bg-slate-800/90 border-pink-500/60 shadow-glow-pink ring-1 ring-pink-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{cust.cpf}</span>
                <span className={`flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badgeBg}`}>
                  {icon}
                  <span>{cust.badge}</span>
                </span>
              </div>

              {/* Customer Name & Income */}
              <div className="mt-3">
                <h3 className="text-sm font-bold text-white">{cust.name}</h3>
                <p className="text-xs text-slate-400">Renda mensal: R$ {cust.monthlyIncome.toLocaleString('pt-BR')}</p>
              </div>

              {/* Credit Request Pill */}
              <div className="mt-2.5 rounded-lg bg-slate-950/60 p-2 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Solicitado:</span>
                <span className="font-bold text-pink-400">
                  R$ {cust.requestedAmount.toLocaleString('pt-BR')} <span className="text-slate-500 font-normal">({cust.installments}x)</span>
                </span>
              </div>

              {/* Open Finance Badge Pill */}
              <div className="mt-2 flex items-center justify-between rounded-md bg-slate-950 p-1.5 text-[10px] border border-slate-800">
                <div className="flex items-center space-x-1">
                  {of?.isConnected ? (
                    <Link2 className="h-3 w-3 text-cyan-400" />
                  ) : (
                    <Link2Off className="h-3 w-3 text-rose-400" />
                  )}
                  <span className="font-semibold text-slate-300">Open Finance:</span>
                </div>
                <span className={`font-bold ${of?.isConnected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {of?.isConnected ? of.connectedBanks.join(', ') : 'Desconectado'}
                </span>
              </div>

              {/* Description preview */}
              <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {cust.description}
              </p>

              {/* Bottom selection indicator */}
              {isSelected && (
                <div className="mt-3 flex items-center justify-center rounded-md bg-pink-500/10 py-1 text-[11px] font-bold text-pink-400 border border-pink-500/20">
                  <span>SELECIONADO PARA ANÁLISE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CUSTOM PROFILE FORM MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-pink-400" />
                Cadastrar Novo Cliente & Open Finance
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomFormSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">CPF (Simulado)</label>
                  <input
                    type="text"
                    value={customForm.cpf}
                    onChange={(e) => setCustomForm({ ...customForm, cpf: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Valor Solicitado (R$)</label>
                  <input
                    type="number"
                    value={customForm.requestedAmount}
                    onChange={(e) => setCustomForm({ ...customForm, requestedAmount: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Número de Parcelas</label>
                  <input
                    type="number"
                    value={customForm.installments}
                    onChange={(e) => setCustomForm({ ...customForm, installments: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Renda Mensal (R$)</label>
                  <input
                    type="number"
                    value={customForm.monthlyIncome}
                    onChange={(e) => setCustomForm({ ...customForm, monthlyIncome: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status do Open Finance</label>
                  <select
                    value={customForm.openFinance?.isConnected ? 'conectado' : 'desconectado'}
                    onChange={(e) => {
                      const isConn = e.target.value === 'conectado';
                      setCustomForm({
                        ...customForm,
                        openFinance: {
                          isConnected: isConn,
                          connectedBanks: isConn ? ['Itaú Unibanco', 'Nubank'] : [],
                          verifiedMonthlyInflow: isConn ? customForm.monthlyIncome : 0,
                          overdraftUsage180d: false,
                          externalDebtCommitment: 0,
                          transactionalScore: isConn ? 92 : 0,
                          consentExpiresAt: isConn ? '31/12/2027' : 'Não autorizado',
                          incomeMatchPct: isConn ? 100 : 0
                        }
                      });
                    }}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none font-semibold text-cyan-400"
                  >
                    <option value="conectado">Conectado (Itaú & Nubank)</option>
                    <option value="desconectado">Desconectado (Não Autorizado)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-pink-500 px-5 py-2 font-bold text-white shadow-glow-pink hover:bg-pink-600"
                >
                  Submeter Análise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
