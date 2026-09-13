import { PolicyDocument } from '@/types/credit';

export const CREDIT_POLICIES_DATABASE: PolicyDocument[] = [
  {
    id: 'pol-lim-001',
    code: 'POL-LIM-02.1',
    title: 'Política de Limite de Crédito e Comprometimento de Renda',
    version: 'v2.1',
    category: 'Limite',
    content: 'Define as diretrizes de comprometimento de renda mensal e capacidade máxima de endividamento para novas operações de crédito.',
    rules: [
      'Regra 1.1: O valor da parcela mensal solicitada não pode comprometer mais de 30% da renda líquida comprovada do cliente para elegibilidade à Aprovação Automática.',
      'Regra 1.2: Para parcelamentos em até 12x, clientes com relacionamento superior a 24 meses (Tier Prata+) podem ter um comprometimento máximo de até 40% da renda, desde que a utilização do limite atual seja inferior a 50%.',
      'Regra 1.3: Solicitações com valor total acima de R$ 15.000,00 ou comprometimento entre 30% e 50% da renda exigem obrigatoriamente Documentação Complementar (Comprovante de Renda dos últimos 90 dias e Extrato Bancário).',
      'Regra 1.4: Operações que excedam 50% da renda mensal declarada são classificadas como Alto Risco e devem ser bloqueadas no fluxo automático, direcionadas para Análise Humana.'
    ]
  },
  {
    id: 'pol-risk-002',
    code: 'POL-RISK-01.4',
    title: 'Política de Análise de Risco e Inadimplência Esperada',
    version: 'v1.4',
    category: 'Risco',
    content: 'Determina os limiares aceitáveis de Probabilidade de Inadimplência (PD) e a tratativa para histórico financeiro adverso.',
    rules: [
      'Regra 2.1: Histórico de atrasos superiores a 30 dias nos últimos 12 meses desqualifica o cliente para aprovação automática, exigindo encaminhamento obrigatório para Análise Humana.',
      'Regra 2.2: Probabilidade estimada de inadimplência (PD) igual ou superior a 15,0% classifica o cliente como ALTO RISCO, exigindo parecer de um especialista sênior de crédito.',
      'Regra 2.3: Probabilidade estimada de inadimplência (PD) entre 5,0% e 14,9% é classificada como RISCO MODERADO e requer solicitação de documentação comprobatória suplementar.',
      'Regra 2.4: Clientes com utilização do limite de crédito disponível acima de 85% apresentam risco por sobreendividamento e necessitam de reavaliação de margem consignável.'
    ]
  },
  {
    id: 'pol-comp-003',
    code: 'POL-COMP-03.0',
    title: 'Política de Compliance, Prevenção à Fraude e Governança de IA',
    version: 'v3.0',
    category: 'Compliance',
    content: 'Regula os critérios de segurança cadastral, detecção de padrões anômalos e salva-guardas éticas de Inteligência Artificial.',
    rules: [
      'Regra 3.1: Clientes com menos de 30 dias de cadastro solicitando valores superiores a R$ 20.000,00 devem ser sinalizados para verificação manual pela Mesa de Compliance por suspeita de inconsistência.',
      'Regra 3.2: Padrões financeiros atípicos (ex: aumento repentino de movimentação em contas recentes com limite zerado) exigem checagem documental e validação biométrica de segurança.',
      'Regra 3.3: É ESTRITAMENTE PROIBIDO utilizar atributos sensíveis (como raça, etnia, religião, gênero, orientação sexual ou deficiência) para tomada de decisão ou justificativa de crédito.',
      'Regra 3.4: Decisões de alto impacto financeiro NUNCA podem ser tomadas com autonomia irrestrita por modelos de IA; o parecer humano é indispensável em cenários de incerteza ou alto risco.'
    ]
  },
  {
    id: 'pol-doc-004',
    code: 'POL-DOC-02.0',
    title: 'Matriz de Exigência Documental e Controles Suplementares',
    version: 'v2.0',
    category: 'Documentação',
    content: 'Especifica os comprovantes requeridos quando a recomendação do sistema for Documentação Complementar ou Análise Humana.',
    rules: [
      'Regra 4.1: Em caso de pendência por Documentação Complementar, os documentos exigidos são: (A) Documento de Identidade com foto recente, (B) Comprovante de Residência emitido há menos de 90 dias, (C) Comprovante de Renda dos últimos 3 meses.',
      'Regra 4.2: Se o cliente possuir status "Renegociação ativa", a concessão de novo crédito depende exclusivamente de parecer favorável assinado por analista humano de recuperação de crédito.'
    ]
  }
];

export function queryRagPolicies(input: {
  requestedAmount: number;
  incomeCommitmentPct: number;
  limitUtilizationPct: number;
  delinquencyHistory: string;
  accountAgeMonths: number;
  recentBehavior: string;
}): {
  policiesConsulted: {
    policyId: string;
    code: string;
    title: string;
    version: string;
    matchedRules: string[];
    status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' | 'NAO_ENCONTRADO';
    relevanceScore: number;
  }[];
  requiresDocs: boolean;
  requiresHumanReview: boolean;
  notes: string[];
} {
  const results: {
    policyId: string;
    code: string;
    title: string;
    version: string;
    matchedRules: string[];
    status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' | 'NAO_ENCONTRADO';
    relevanceScore: number;
  }[] = [];
  let requiresDocs = false;
  let requiresHumanReview = false;
  const notes: string[] = [];

  // Query POL-LIM-02.1
  const pol1Rules: string[] = [];
  let pol1Status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' = 'CONFORME';

  if (input.incomeCommitmentPct <= 30) {
    pol1Rules.push('Regra 1.1: Parcela atinge ' + input.incomeCommitmentPct.toFixed(1) + '% da renda (<= 30%) - Elegível para fluxo automático.');
  } else if (input.incomeCommitmentPct <= 50) {
    pol1Rules.push('Regra 1.3: Parcela atinge ' + input.incomeCommitmentPct.toFixed(1) + '% da renda (> 30% e <= 50%) - Exige Documentação Complementar.');
    pol1Status = 'REQUER_DOCUMENTOS';
    requiresDocs = true;
    notes.push('Comprometimento de renda em faixa intermediária (30-50%).');
  } else {
    pol1Rules.push('Regra 1.4: Parcela atinge ' + input.incomeCommitmentPct.toFixed(1) + '% da renda (> 50%) - Excede limite seguro de endividamento.');
    pol1Status = 'NAO_CONFORME';
    requiresHumanReview = true;
    notes.push('Comprometimento de renda excede 50%.');
  }

  if (input.requestedAmount > 15000 && pol1Status === 'CONFORME') {
    pol1Rules.push('Regra 1.3: Valor solicitado (R$ ' + input.requestedAmount.toLocaleString('pt-BR') + ') é superior a R$ 15.000,00 - Requer verificação documental.');
    pol1Status = 'REQUER_DOCUMENTOS';
    requiresDocs = true;
  }

  results.push({
    policyId: 'pol-lim-001',
    code: 'POL-LIM-02.1',
    title: 'Política de Limite de Crédito v2.1',
    version: 'v2.1',
    matchedRules: pol1Rules,
    status: pol1Status,
    relevanceScore: 0.95
  });

  // Query POL-RISK-01.4
  const pol2Rules: string[] = [];
  let pol2Status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' = 'CONFORME';

  if (input.delinquencyHistory.includes('Atrasos recentes') || input.delinquencyHistory.includes('Renegociação')) {
    pol2Rules.push('Regra 2.1: Histórico financeiro com "' + input.delinquencyHistory + '" impede aprovação automática.');
    pol2Status = 'NAO_CONFORME';
    requiresHumanReview = true;
    notes.push('Histórico recente de mora ou renegociação.');
  }

  if (input.limitUtilizationPct > 85) {
    pol2Rules.push('Regra 2.4: Utilização do limite disponível em ' + input.limitUtilizationPct + '% (> 85%) indica elevado uso de margem.');
    if (pol2Status !== 'NAO_CONFORME') pol2Status = 'REQUER_DOCUMENTOS';
    requiresDocs = true;
  }

  results.push({
    policyId: 'pol-risk-002',
    code: 'POL-RISK-01.4',
    title: 'Política de Análise de Risco v1.4',
    version: 'v1.4',
    matchedRules: pol2Rules.length > 0 ? pol2Rules : ['Regra 2.3: Perfil de inadimplência dentro dos parâmetros de risco aceitáveis.'],
    status: pol2Status,
    relevanceScore: 0.92
  });

  // Query POL-COMP-03.0
  const pol3Rules: string[] = [];
  let pol3Status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' = 'CONFORME';

  if (input.accountAgeMonths < 1 && input.requestedAmount > 20000) {
    pol3Rules.push('Regra 3.1: Cadastro recente (' + input.accountAgeMonths + ' meses) com alto valor (R$ ' + input.requestedAmount.toLocaleString('pt-BR') + ') - Alerta de compliance.');
    pol3Status = 'NAO_CONFORME';
    requiresHumanReview = true;
    notes.push('Alerta de cadastro novo com alto valor solicitado.');
  }

  if (input.recentBehavior.includes('suspeito') || input.recentBehavior.includes('Padrão atípico')) {
    pol3Rules.push('Regra 3.2: Padrão financeiro atípico identificado - Requer validação cadastral e biometria.');
    pol3Status = 'NAO_CONFORME';
    requiresHumanReview = true;
    notes.push('Comportamento atípico detectado.');
  }

  pol3Rules.push('Regra 3.3: Garantia de não-discriminação e proteção de atributos sensíveis aplicada.');
  pol3Rules.push('Regra 3.4: Princípio de Supervisão Humana ativado para salvar-guardar a decisão.');

  results.push({
    policyId: 'pol-comp-003',
    code: 'POL-COMP-03.0',
    title: 'Política de Compliance v3.0',
    version: 'v3.0',
    matchedRules: pol3Rules,
    status: pol3Status,
    relevanceScore: 0.98
  });

  // Query POL-DOC-02.0
  if (requiresDocs || requiresHumanReview) {
    results.push({
      policyId: 'pol-doc-004',
      code: 'POL-DOC-02.0',
      title: 'Matriz de Exigência Documental v2.0',
      version: 'v2.0',
      matchedRules: [
        'Regra 4.1: Exigência de Documento com foto, Comprovante de Residência (<90d) e Comprovante de Renda (últimos 3 meses).'
      ],
      status: requiresHumanReview ? 'NAO_CONFORME' : 'REQUER_DOCUMENTOS',
      relevanceScore: 0.88
    });
  }

  return {
    policiesConsulted: results,
    requiresDocs,
    requiresHumanReview,
    notes
  };
}
