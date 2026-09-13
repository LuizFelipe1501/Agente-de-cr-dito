'use client';

import React, { useState } from 'react';
import { Key, ShieldCheck, X, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey
}) => {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Configurar Chave Google Gemini API</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Insira sua chave de API do Google Gemini para enriquecimento da explicabilidade em tempo real com LLMs. Se deixado em branco, a aplicação opera perfeitamente com a engine local de simulação.
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Gemini API Key (AI Studio):
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none font-mono"
          />
        </div>

        {savedSuccess && (
          <div className="rounded-lg bg-emerald-500/20 p-2.5 text-xs text-emerald-400 flex items-center justify-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Chave API salva com sucesso!</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-pink-500 px-5 py-2 text-xs font-bold text-white shadow-glow-pink hover:bg-pink-600"
          >
            Salvar Chave
          </button>
        </div>
      </div>
    </div>
  );
};
