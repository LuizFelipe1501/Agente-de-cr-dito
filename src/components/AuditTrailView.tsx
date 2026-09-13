'use client';

import React, { useState } from 'react';
import { AuditTrailLog } from '@/types/credit';
import { Activity, Download, Printer, Search, ShieldCheck, FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditTrailLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (log) =>
      log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.analysisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.decision.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `klarna_credit_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Trilha de Auditoria & Governança Regulatória
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro imutável e auditável de todas as execuções da esteira multi-agente de crédito.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-pink-400" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-cyan-400" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, ID de análise ou recomendação..."
          className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">ID Análise / Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Valor Solicitado</th>
              <th className="px-4 py-3">Agentes Utilizados</th>
              <th className="px-4 py-3">Políticas RAG</th>
              <th className="px-4 py-3">Recomendação IA</th>
              <th className="px-4 py-3">Confiança</th>
              <th className="px-4 py-3">Decisão Humana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                let badgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                if (log.decision === 'DOCUMENTAÇÃO COMPLEMENTAR') badgeStyle = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                else if (log.decision === 'ANÁLISE HUMANA') badgeStyle = 'bg-rose-500/20 text-rose-400 border-rose-500/30';

                return (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <div className="font-bold text-white">{log.analysisId}</div>
                      <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString('pt-BR')}</div>
                    </td>

                    <td className="px-4 py-3 font-medium text-white">
                      {log.customerName}
                    </td>

                    <td className="px-4 py-3 font-bold text-pink-400">
                      R$ {log.requestedAmount.toLocaleString('pt-BR')}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {log.agentsInvolved.map((agent, aIdx) => (
                          <span key={aIdx} className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                            {agent}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {log.policiesConsulted.join(', ')}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${badgeStyle}`}>
                        {log.decision}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-bold text-cyan-400">
                      {log.confidencePct}%
                    </td>

                    <td className="px-4 py-3">
                      {log.analystDecision ? (
                        <span className="rounded bg-pink-500/20 text-pink-300 px-2 py-0.5 text-[10px] font-bold border border-pink-500/30">
                          {log.analystDecision}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[10px]">Pendente</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-xs">
                  Nenhum registro de auditoria encontrado. Execute uma análise para alimentar a trilha.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
