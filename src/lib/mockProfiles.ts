import { CustomerInput } from '@/types/credit';

export interface PreloadedCustomerProfile extends CustomerInput {
  avatarUrl?: string;
  badge: 'Baixo Risco' | 'Risco Moderado' | 'Alto Risco' | 'Suspeita de Inconsistência';
  description: string;
  expectedOutcome: 'APROVAÇÃO AUTOMÁTICA' | 'DOCUMENTAÇÃO COMPLEMENTAR' | 'ANÁLISE HUMANA';
}

export const PRELOADED_CUSTOMERS: PreloadedCustomerProfile[] = [
  {
    id: 'cust-01',
    name: 'Ana Carolina Silva',
    cpf: '348.912.804-12',
    requestedAmount: 4500,
    installments: 6,
    monthlyIncome: 12500,
    paymentHistoryScore: 96,
    delinquencyHistory: 'Sem atrasos',
    limitUtilizationPct: 18,
    purchaseFrequency: 'Alta',
    averageTicket: 380,
    recentFinancialBehavior: 'Estável',
    accountAgeMonths: 36,
    badge: 'Baixo Risco',
    description: 'Cliente antiga com excelente score, baixo uso de limite e Open Finance validado no Itaú e Nubank. Renda 100% comprovada por Pix recorrente.',
    expectedOutcome: 'APROVAÇÃO AUTOMÁTICA',
    notes: 'Relacionamento de 3 anos, uso responsável de cartão e históricoOpen Finance consolidado com 98% de convergência.',
    openFinance: {
      isConnected: true,
      connectedBanks: ['Itaú Unibanco', 'Nubank'],
      verifiedMonthlyInflow: 12500,
      overdraftUsage180d: false,
      externalDebtCommitment: 0,
      transactionalScore: 95,
      consentExpiresAt: '18/11/2027',
      incomeMatchPct: 100
    }
  },
  {
    id: 'cust-02',
    name: 'Carlos Eduardo Oliveira',
    cpf: '712.409.118-49',
    requestedAmount: 18000,
    installments: 18,
    monthlyIncome: 7800,
    paymentHistoryScore: 78,
    delinquencyHistory: 'Atrasos eventuais (<30d)',
    limitUtilizationPct: 72,
    purchaseFrequency: 'Média',
    averageTicket: 650,
    recentFinancialBehavior: 'Aumento significativo de gastos',
    accountAgeMonths: 14,
    badge: 'Risco Moderado',
    description: 'Cliente com Open Finance ativo no Bradesco. Renda validada de R$ 7.200 (discrepância leve de ~7% vs declarada). Possui parcelamento ativo externo de R$ 1.800.',
    expectedOutcome: 'DOCUMENTAÇÃO COMPLEMENTAR',
    notes: 'Solicitação de R$ 18.000 exige comprovação complementar pois o Open Finance indicou compromisso em outro banco.',
    openFinance: {
      isConnected: true,
      connectedBanks: ['Bradesco'],
      verifiedMonthlyInflow: 7200,
      overdraftUsage180d: true, // uso pontual
      externalDebtCommitment: 1800,
      transactionalScore: 74,
      consentExpiresAt: '05/04/2027',
      incomeMatchPct: 92
    }
  },
  {
    id: 'cust-03',
    name: 'Mariana Souza Santos',
    cpf: '109.823.541-05',
    requestedAmount: 15000,
    installments: 24,
    monthlyIncome: 3200,
    paymentHistoryScore: 42,
    delinquencyHistory: 'Atrasos recentes (>30d)',
    limitUtilizationPct: 94,
    purchaseFrequency: 'Baixa',
    averageTicket: 210,
    recentFinancialBehavior: 'Redução de saldo',
    accountAgeMonths: 8,
    badge: 'Alto Risco',
    description: 'Open Finance conectado com Santander. Revela uso frequente de cheque especial nos últimos 180d e R$ 4.200 em dívidas externas ativas.',
    expectedOutcome: 'ANÁLISE HUMANA',
    notes: 'Comprometimento de renda excessivo identificado via Open Finance.',
    openFinance: {
      isConnected: true,
      connectedBanks: ['Santander Brasil'],
      verifiedMonthlyInflow: 2900,
      overdraftUsage180d: true,
      externalDebtCommitment: 4200,
      transactionalScore: 42,
      consentExpiresAt: '12/01/2027',
      incomeMatchPct: 90
    }
  },
  {
    id: 'cust-04',
    name: 'Lucas Rocha Ferreira',
    cpf: '883.190.224-88',
    requestedAmount: 40000,
    installments: 12,
    monthlyIncome: 25000,
    paymentHistoryScore: 50,
    delinquencyHistory: 'Sem atrasos',
    limitUtilizationPct: 0,
    purchaseFrequency: 'Baixa',
    averageTicket: 1500,
    recentFinancialBehavior: 'Padrão atípico / suspeito',
    accountAgeMonths: 0,
    badge: 'Suspeita de Inconsistência',
    description: 'Recusou compartilhamento via Open Finance. Conta nova (15 dias) tentando crédito de R$ 40.000 sem validação transacional prévia.',
    expectedOutcome: 'ANÁLISE HUMANA',
    notes: 'Ausência de dados Open Finance para validar renda de R$ 25.000 aumenta o fator de risco e exige revisão cadastral.',
    openFinance: {
      isConnected: false,
      connectedBanks: [],
      verifiedMonthlyInflow: 0,
      overdraftUsage180d: false,
      externalDebtCommitment: 0,
      transactionalScore: 0,
      consentExpiresAt: 'Não autorizado',
      incomeMatchPct: 0
    }
  }
];
