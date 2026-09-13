export type RiskLevel = 'BAIXO' | 'MODERADO' | 'ALTO';

export type DecisionType = 
  | 'APROVAÇÃO AUTOMÁTICA'
  | 'DOCUMENTAÇÃO COMPLEMENTAR'
  | 'ANÁLISE HUMANA';

export interface OpenFinanceData {
  isConnected: boolean;
  connectedBanks: string[];
  verifiedMonthlyInflow: number;
  overdraftUsage180d: boolean;
  externalDebtCommitment: number; // R$ total de dívidas em outros bancos
  transactionalScore: number; // 0 to 100
  consentExpiresAt: string;
  incomeMatchPct: number; // % de convergência entre renda declarada e transacionada
}

export interface CustomerInput {
  id?: string;
  name: string;
  cpf: string;
  requestedAmount: number;
  installments: number;
  monthlyIncome: number;
  paymentHistoryScore: number; // 0 to 100
  delinquencyHistory: 'Sem atrasos' | 'Atrasos eventuais (<30d)' | 'Atrasos recentes (>30d)' | 'Renegociação ativa';
  limitUtilizationPct: number; // 0 to 100%
  purchaseFrequency: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  averageTicket: number;
  recentFinancialBehavior: 'Estável' | 'Aumento significativo de gastos' | 'Redução de saldo' | 'Padrão atípico / suspeito';
  accountAgeMonths: number;
  notes?: string;
  openFinance?: OpenFinanceData;
}

export interface CustomerProfileData extends CustomerInput {
  incomeCommitmentPct: number; // (monthlyInstallment / monthlyIncome) * 100
  estimatedInstallment: number;
  relationshipTier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamond';
  openFinance: OpenFinanceData;
}

export interface RiskAnalysisOutput {
  defaultProbabilityPct: number; // 0 to 100%
  riskScore: number; // 0 to 100 (lower is safer)
  riskLevel: RiskLevel;
  fraudAlerts: string[];
  confidenceIndexPct: number;
  disclaimerNotice: string;
  openFinanceRiskAdjustment: string;
}

export interface PolicyDocument {
  id: string;
  code: string;
  title: string;
  version: string;
  category: 'Limite' | 'Risco' | 'Compliance' | 'Documentação';
  content: string;
  rules: string[];
}

export interface PolicyQueryResult {
  policyId: string;
  code: string;
  title: string;
  version: string;
  matchedRules: string[];
  status: 'CONFORME' | 'REQUER_DOCUMENTOS' | 'NAO_CONFORME' | 'NAO_ENCONTRADO';
  relevanceScore: number;
}

export interface PolicyComplianceOutput {
  policiesConsulted: PolicyQueryResult[];
  compliancePassed: boolean;
  requiresDocs: boolean;
  requiresHumanReview: boolean;
  notes: string[];
}

export interface ExplainabilityOutput {
  summary: string;
  positiveFactors: string[];
  attentionFactors: string[];
  futureGuidance: string;
  disclaimer: string;
}

export interface SupervisorOutput {
  riskLevel: RiskLevel;
  finalDecision: DecisionType;
  confidencePct: number;
  justification: string;
  positiveDrivers: string[];
  attentionDrivers: string[];
  policyAdherencePct: number;
  recommendedNextAction: string;
  requiresHumanReview: boolean;
  customerFacingExplanation: string;
}

export interface AgentExecutionStep {
  agentId: 'profile' | 'risk' | 'policy' | 'explainability' | 'supervisor';
  agentName: string;
  role: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  timestamp: string;
  durationMs: number;
  summary: string;
  details?: any;
}

export interface AnalysisResultFull {
  id: string;
  timestamp: string;
  customer: CustomerProfileData;
  riskAnalysis: RiskAnalysisOutput;
  policyCompliance: PolicyComplianceOutput;
  explainability: ExplainabilityOutput;
  supervisor: SupervisorOutput;
  executionSteps: AgentExecutionStep[];
  analystAction?: {
    action: 'APROVADO' | 'SOLICITADO_DOCS' | 'ENCAMINHADO_HUMANO';
    analystName: string;
    timestamp: string;
    notes: string;
  };
}

export interface AuditTrailLog {
  id: string;
  analysisId: string;
  timestamp: string;
  customerName: string;
  requestedAmount: number;
  agentsInvolved: string[];
  policiesConsulted: string[];
  riskLevel: RiskLevel;
  decision: DecisionType;
  confidencePct: number;
  requiresHumanReview: boolean;
  analystDecision?: string;
  openFinanceStatus?: string;
}
