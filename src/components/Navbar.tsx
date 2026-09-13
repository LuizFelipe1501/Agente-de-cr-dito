'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Key, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenRag: () => void;
  onOpenApiKey: () => void;
  hasCustomKey: boolean;
  activeTab: 'demo' | 'audit' | 'policies';
  setActiveTab: (tab: 'demo' | 'audit' | 'policies') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRag,
  onOpenApiKey,
  hasCustomKey,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 shadow-glow-pink">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <span className="font-extrabold text-pink-400 text-lg tracking-tighter">K.</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">
                Klarna<span className="text-pink-400">.</span>
              </span>
              <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-xs font-semibold text-pink-400 border border-pink-500/20">
                Smart Credit AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Camada Inteligente de Apoio à Concessão de Crédito com IA Explicável & RAG
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'demo'
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-400" />
            <span>Painel de Análise</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Trilha de Auditoria</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'policies'
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Base RAG de Políticas</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Gemini AI Status Indicator */}
          <button
            onClick={onOpenApiKey}
            className="flex items-center space-x-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs border border-slate-800 hover:border-slate-700 transition-colors"
            title="Configurar Chave API do Gemini"
          >
            <Key className={`h-3.5 w-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-slate-300 hidden sm:inline">
              {hasCustomKey ? 'Gemini Pro Conectado' : 'Gemini AI (Demo)'}
            </span>
            <span className={`h-2 w-2 rounded-full ${hasCustomKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </button>

          {/* RAG Knowledge Base Button */}
          <button
            onClick={onOpenRag}
            className="flex items-center space-x-1.5 rounded-lg bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
            <span className="hidden sm:inline">Políticas RAG</span>
          </button>
        </div>

      </div>
    </header>
  );
};
