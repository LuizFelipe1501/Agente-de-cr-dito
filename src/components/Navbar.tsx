'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Activity, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onOpenRag: () => void;
  activeTab: 'demo' | 'audit' | 'policies';
  setActiveTab: (tab: 'demo' | 'audit' | 'policies') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRag,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="z-40 w-full border-b border-slate-800 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-gradient-to-br from-slate-100 to-slate-500 shadow-[0_0_24px_rgba(255,255,255,0.08)]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-md bg-black">
              <span className="font-extrabold text-slate-100 text-lg tracking-tighter">K.</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">
                Klarna<span className="text-slate-400">.</span>
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Credit intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Análise de crédito com decisões rastreáveis
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'demo'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Análises</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Auditoria</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'policies'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Políticas</span>
          </button>
        </nav>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenRag}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden sm:inline">Consultar base</span>
          </button>
        </div>

      </div>
    </header>
  );
};
