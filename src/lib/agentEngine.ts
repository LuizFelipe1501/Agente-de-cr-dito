import { 
  CustomerInput, 
  CustomerProfileData, 
  RiskAnalysisOutput, 
  PolicyComplianceOutput, 
  ExplainabilityOutput, 
  SupervisorOutput, 
  AgentExecutionStep, 
  AnalysisResultFull,
  DecisionType,
  RiskLevel,
  OpenFinanceData
} from '@/types/credit';
import { queryRagPolicies } from './policiesData';
import { GoogleGenerativeAI } from '@google/generative-ai';

function getRelationshipTier(months: number): 'Bronze' | 'Prata' | 'Ouro' | 'Diamond' {
  if (months >= 36) return 'Diamond';
  if (months >= 24) return 'Ouro';
  if (months >= 12) return 'Prata';
  return 'Bronze';
}

const DEFAULT_OPEN_FINANCE: OpenFinanceData = {
  isConnected: true,
  connectedBanks: ['Itaú Unibanco'],
  verifiedMonthlyInflow: 8500,
  overdraftUsage180d: false,
  externalDebtCommitment: 0,
  transactionalScore: 88,
  consentExpiresAt: '31/12/2027',
  incomeMatchPct: 98
};

/**
 * 1. AGENTE DE PERFIL DO CLIENTE
 */
export function runCustomerProfileAgent(input: CustomerInput): {
  profile: CustomerProfileData;
  step: AgentExecutionStep;
} {
  const openFinance: OpenFinanceData = input.openFinance || DEFAULT_OPEN_FINANCE;
  const estimatedInstallment = Math.round(input.requestedAmount / input.installments);
  
  // Total effective commitment considering external debt from Open Finance
  const effectiveMonthlyOutflow = estimatedInstallment + (openFinance.externalDebtCommitment > 0 ? openFinance.externalDebtCommitment * 0.15 : 0);
  const incomeCommitmentPct = Number(((effectiveMonthlyOutflow / input.monthlyIncome) * 100).toFixed(1));
  const relationshipTier = getRelationshipTier(input.accountAgeMonths);

  const profile: CustomerProfileData = {
    ...input,
    incomeCommitmentPct,
    estimatedInstallment,
    relationshipTier,
    openFinance
  };

  const ofSummary = openFinance.isConnected 
    ? `Open Finance ativo (${openFinance.connectedBanks.join(', ')}) com R$ ${openFinance.verifiedMonthlyInflow.toLocaleString('pt-BR')} validados.`
    : 'Open Finance não autorizado pelo cliente.';

  const step: AgentExecutionStep = {
    agentId: 'profile',
    agentName: 'Agente de Perfil do Cliente',
    role: 'Consolidação de dados do consumidor & Open Finance',
    status: 'completed',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    durationMs: 420,
    summary: `Renda: R$ ${input.monthlyIncome.toLocaleString('pt-BR')} (Parcela R$ ${estimatedInstallment.toLocaleString('pt-BR')}, ${incomeCommitmentPct}% da renda). ${ofSummary}`
  };

  return { profile, step };
}

/**
 * 2. AGENTE DE ANÁLISE DE RISCO
 */
export function runRiskAnalysisAgent(profile: CustomerProfileData): {
  riskAnalysis: RiskAnalysisOutput;
  step: AgentExecutionStep;
} {
  let basePd = 2.0; // 2% baseline
  const of = profile.openFinance;

  // Delinquency penalty
  if (profile.delinquencyHistory.includes('Atrasos eventuais')) basePd += 6.5;
  if (profile.delinquencyHistory.includes('Atrasos recentes')) basePd += 22.0;
  if (profile.delinquencyHistory.includes('Renegociação')) basePd += 35.0;

  // Income commitment penalty
  if (profile.incomeCommitmentPct > 50) basePd += 25.0;
  else if (profile.incomeCommitmentPct > 30) basePd += 8.0;

  // Limit utilization penalty
  if (profile.limitUtilizationPct > 85) basePd += 14.0;
  else if (profile.limitUtilizationPct > 60) basePd += 5.0;

  // Financial behavior
  if (profile.recentFinancialBehavior.includes('Aumento significativo')) basePd += 6.0;
  if (profile.recentFinancialBehavior.includes('Redução de saldo')) basePd += 10.0;
  if (profile.recentFinancialBehavior.includes('suspeito')) basePd += 30.0;

  // OPEN FINANCE RISK ADJUSTMENTS
  let openFinanceRiskAdjustment = 'Sem ajuste Open Finance.';
  if (of.isConnected) {
    if (of.incomeMatchPct >= 95 && !of.overdraftUsage180d) {
      basePd -= 2.5; // Bonus for verified Open Finance cashflow!
      openFinanceRiskAdjustment = `Desconto de risco Open Finance (-2.5% PD): Renda 100% comprovada via Pix/Extrato no ${of.connectedBanks.join(', ')}.`;
    } else if (of.overdraftUsage180d) {
      basePd += 4.5;
      openFinanceRiskAdjustment = 'Penalidade de risco Open Finance (+4.5% PD): Uso recorrente de Cheque Especial nos últimos 180 dias.';
    }

    if (of.externalDebtCommitment > 2000) {
      basePd += 5.0;
      openFinanceRiskAdjustment += ` Dívidas ativas em outras instituições (R$ ${of.externalDebtCommitment.toLocaleString('pt-BR')}).`;
    }
  } else {
    if (profile.requestedAmount > 15000) {
      basePd += 4.0;
      openFinanceRiskAdjustment = 'Penalidade de incerteza (+4.0% PD): Ausência de integração Open Finance para validação direta de renda.';
    }
  }

  // Score boost for long relationship & high score
  if (profile.paymentHistoryScore > 90) basePd -= 2.5;
  if (profile.accountAgeMonths >= 24) basePd -= 2.0;

  const defaultProbabilityPct = Math.min(Math.max(Number(basePd.toFixed(1)), 1.1), 95.0);
  const riskScore = Math.min(Math.round(defaultProbabilityPct * 2.2), 99);

  let riskLevel: RiskLevel = 'BAIXO';
  if (defaultProbabilityPct >= 18.0 || riskScore >= 55) riskLevel = 'ALTO';
  else if (defaultProbabilityPct >= 6.0 || riskScore >= 25) riskLevel = 'MODERADO';

  const fraudAlerts: string[] = [];
  if (profile.accountAgeMonths < 1 && profile.requestedAmount > 20000) {
    fraudAlerts.push('Alerta de Conta Recente: Solicitação de alto valor em conta com menos de 30 dias.');
  }
  if (profile.recentFinancialBehavior.includes('suspeito')) {
    fraudAlerts.push('Alerta de Anomalia Comportamental: Desvio significativo no padrão de movimentação.');
  }
  if (!of.isConnected && profile.requestedAmount > 25000) {
    fraudAlerts.push('Alerta de Validação Cadastral: Open Finance desconectado para proposta de alto montante.');
  }

  const confidenceIndexPct = of.isConnected 
    ? Math.min(98.8, 90 + of.transactionalScore * 0.08)
    : (fraudAlerts.length > 0 ? 72.0 : 84.0);

  const riskAnalysis: RiskAnalysisOutput = {
    defaultProbabilityPct,
    riskScore,
    riskLevel,
    fraudAlerts,
    confidenceIndexPct: Number(confidenceIndexPct.toFixed(1)),
    disclaimerNotice: 'Simulação estatística com integração Open Finance para protótipo Klarna Smart Credit AI.',
    openFinanceRiskAdjustment
  };

  const step: AgentExecutionStep = {
    agentId: 'risk',
    agentName: 'Agente de Análise de Risco',
    role: 'Modelagem estatística com dados compartilhados Open Finance',
    status: 'completed',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    durationMs: 580,
    summary: `PD: ${defaultProbabilityPct}% | Score Risco: ${riskScore}/100 (${riskLevel}). Confiança Open Finance: ${confidenceIndexPct.toFixed(1)}%.`
  };

  return { riskAnalysis, step };
}

/**
 * 3. AGENTE DE POLÍTICAS E COMPLIANCE (RAG)
 */
export function runPolicyComplianceAgent(profile: CustomerProfileData): {
  policyCompliance: PolicyComplianceOutput;
  step: AgentExecutionStep;
} {
  const ragResult = queryRagPolicies({
    requestedAmount: profile.requestedAmount,
    incomeCommitmentPct: profile.incomeCommitmentPct,
    limitUtilizationPct: profile.limitUtilizationPct,
    delinquencyHistory: profile.delinquencyHistory,
    accountAgeMonths: profile.accountAgeMonths,
    recentBehavior: profile.recentFinancialBehavior
  });

  const compliancePassed = !ragResult.requiresHumanReview && !ragResult.requiresDocs;

  const policyCompliance: PolicyComplianceOutput = {
    policiesConsulted: ragResult.policiesConsulted,
    compliancePassed,
    requiresDocs: ragResult.requiresDocs,
    requiresHumanReview: ragResult.requiresHumanReview,
    notes: ragResult.notes
  };

  const step: AgentExecutionStep = {
    agentId: 'policy',
    agentName: 'Agente de Políticas e Compliance (RAG)',
    role: 'Verificação de regras regulatórias de crédito e Open Finance',
    status: 'completed',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    durationMs: 640,
    summary: `Consultadas ${ragResult.policiesConsulted.length} políticas internas. Status: ${compliancePassed ? '100% Conforme' : ragResult.requiresHumanReview ? 'Análise Humana' : 'Exige Documentos'}.`
  };

  return { policyCompliance, step };
}

/**
 * 4. AGENTE DE EXPLICABILIDADE (XAI)
 */
export async function runExplainabilityAgent(
  profile: CustomerProfileData,
  risk: RiskAnalysisOutput,
  compliance: PolicyComplianceOutput,
  apiKey?: string
): Promise<{
  explainability: ExplainabilityOutput;
  step: AgentExecutionStep;
}> {
  const positiveFactors: string[] = [];
  const attentionFactors: string[] = [];
  const of = profile.openFinance;

  // Positives
  if (of.isConnected && of.incomeMatchPct >= 90) {
    positiveFactors.push(`Renda mensal validada com sucesso via Open Finance (${of.connectedBanks.join(', ')}) com ${of.incomeMatchPct}% de convergência.`);
  }
  if (profile.delinquencyHistory === 'Sem atrasos') positiveFactors.push('Histórico de pagamentos pontual sem ocorrências de mora.');
  if (profile.paymentHistoryScore >= 80) positiveFactors.push(`Pontuação de histórico de crédito elevada (${profile.paymentHistoryScore}/100).`);
  if (profile.limitUtilizationPct <= 40) positiveFactors.push(`Baixa utilização do limite de crédito disponível (${profile.limitUtilizationPct}%).`);
  if (profile.accountAgeMonths >= 24) positiveFactors.push(`Relacionamento de longo prazo com a instituição (${profile.accountAgeMonths} meses - Tier ${profile.relationshipTier}).`);

  // Attention
  if (!of.isConnected) {
    attentionFactors.push('Compartilhamento via Open Finance não ativado, impedindo validação automática de renda.');
  }
  if (of.isConnected && of.overdraftUsage180d) {
    attentionFactors.push('Uso recente de Cheque Especial detectado no extrato Open Finance.');
  }
  if (of.isConnected && of.externalDebtCommitment > 0) {
    attentionFactors.push(`Identificado comprometimento de renda com dívidas em outros bancos (R$ ${of.externalDebtCommitment.toLocaleString('pt-BR')}).`);
  }
  if (profile.incomeCommitmentPct > 30) attentionFactors.push(`Comprometimento da renda mensal estimado em ${profile.incomeCommitmentPct}% (superior à meta ideal de 30%).`);
  if (profile.requestedAmount >= 15000) attentionFactors.push(`Valor solicitado (R$ ${profile.requestedAmount.toLocaleString('pt-BR')}) acima da faixa de liberação instantânea sem garantias.`);

  let summary = `Análise fundamentada em ${positiveFactors.length} evidências positivas e ${attentionFactors.length} fatores de atenção. `;
  let futureGuidance = 'Conectar sua conta via Open Finance e manter a utilização de limite controlada favorecem aprovações imediatas.';

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const prompt = `Você é o Agente de Explicabilidade (XAI) da Klarna Smart Credit AI.
Explique a análise de crédito de forma transparente e humanizada em Português.

Dados Open Finance:
- Status Open Finance: ${of.isConnected ? 'Conectado em ' + of.connectedBanks.join(', ') : 'Não Conectado'}
- Renda Validada: R$ ${of.verifiedMonthlyInflow} (Match ${of.incomeMatchPct}%)
- Dívidas Externas: R$ ${of.externalDebtCommitment}

Dados do Cliente:
- Nome: ${profile.name}
- Solicitado: R$ ${profile.requestedAmount} em ${profile.installments}x
- Score Risco: ${risk.riskScore}/100 (${risk.riskLevel})

Gere um parágrafo conciso explicando como os dados de Open Finance e comportamento financeiro influenciaram o resultado.`;

      // Use Gemini 2.0 Flash (latest DeepMind model) with fallback chain
      const modelNames = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
      let text = '';

      for (const mName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: mName });
          const result = await model.generateContent(prompt);
          text = result.response.text();
          if (text) break;
        } catch (mErr) {
          console.warn(`Model ${mName} call failed, trying fallback:`, mErr);
        }
      }
      if (text) summary = text.trim();
    } catch (e) {
      console.warn('Gemini XAI fallback:', e);
    }
  }

  if (!apiKey || summary.length < 20) {
    if (compliance.compliancePassed) {
      summary = `Seu perfil apresenta excelente reputação de crédito (${profile.paymentHistoryScore}/100) com renda validada de R$ ${profile.monthlyIncome.toLocaleString('pt-BR')} via Open Finance no ${of.connectedBanks.join(', ')}. A proposta é segura e compatível.`;
      futureGuidance = 'Mantenha o compartilhamento Open Finance ativo e a pontualidade nos pagamentos para manter benefícios de crédito rápido.';
    } else if (compliance.requiresDocs) {
      summary = `Seu histórico de pagamentos é positivo, porém o valor solicitado (R$ ${profile.requestedAmount.toLocaleString('pt-BR')}) e a utilização de limite (${profile.limitUtilizationPct}%) requerem comprovação documental complementar de renda recente.`;
      futureGuidance = 'Envie seu comprovante de renda recente ou autorize a renovação do Open Finance para liberar o crédito.';
    } else {
      summary = `A proposta ultrapassa a capacidade de pagamento recomendada, apresentando alto uso de limite ou alavancagem externa revelada no Open Finance. Por segurança, a proposta foi direcionada para a mesa do analista humano.`;
      futureGuidance = 'Aguarde a análise do nosso comitê de crédito ou considere solicitar um valor menor com prazo mais longo.';
    }
  }

  const explainability: ExplainabilityOutput = {
    summary,
    positiveFactors: positiveFactors.length > 0 ? positiveFactors : ['Histórico prévio cadastrado no sistema.'],
    attentionFactors: attentionFactors.length > 0 ? attentionFactors : ['Manter utilização de limite abaixo de 50%.'],
    futureGuidance,
    disclaimer: 'Explicação fundamentada em inteligência Open Finance e modelos éticos de XAI.'
  };

  const step: AgentExecutionStep = {
    agentId: 'explainability',
    agentName: 'Agente de Explicabilidade (XAI)',
    role: 'Síntese clara das razões da decisão com fundamentação Open Finance',
    status: 'completed',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    durationMs: 780,
    summary: `Explicabilidade concluída com dados Open Finance (${positiveFactors.length} prós, ${attentionFactors.length} atenção).`
  };

  return { explainability, step };
}

/**
 * 5. SUPERVISOR INTELIGENTE
 */
export async function runSmartSupervisorAgent(
  profile: CustomerProfileData,
  risk: RiskAnalysisOutput,
  compliance: PolicyComplianceOutput,
  explainability: ExplainabilityOutput,
  apiKey?: string
): Promise<{
  supervisor: SupervisorOutput;
  step: AgentExecutionStep;
}> {
  let finalDecision: DecisionType = 'APROVAÇÃO AUTOMÁTICA';
  let recommendedNextAction = 'Liberar crédito diretamente via Pix para a chave validada no Open Finance.';
  let requiresHumanReview = false;

  if (compliance.requiresHumanReview || risk.riskLevel === 'ALTO') {
    finalDecision = 'ANÁLISE HUMANA';
    recommendedNextAction = 'Encaminhar proposta com dossiê Open Finance para reavaliação do comitê humano de crédito.';
    requiresHumanReview = true;
  } else if (compliance.requiresDocs || risk.riskLevel === 'MODERADO') {
    finalDecision = 'DOCUMENTAÇÃO COMPLEMENTAR';
    recommendedNextAction = 'Solicitar ao cliente upload de comprovante de renda atualizado para complementar os dados do Open Finance.';
    requiresHumanReview = false;
  }

  let justification = '';
  let customerFacingExplanation = '';

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const prompt = `Você é o Supervisor Inteligente da Klarna Smart Credit AI.
Decisão: ${finalDecision}
Risco: ${risk.riskLevel} (PD ${risk.defaultProbabilityPct}%)
Cliente: ${profile.name} (R$ ${profile.requestedAmount})
Open Finance: ${profile.openFinance.isConnected ? 'Validado no ' + profile.openFinance.connectedBanks.join(', ') : 'Não Conectado'}

Retorne JSON sem markdown:
{
  "justification": "justificativa técnica detalhada destacando o papel do Open Finance",
  "customerFacing": "mensagem amigável para o cliente no app Klarna"
}`;

      const modelNames = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
      let text = '';

      for (const mName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: mName });
          const result = await model.generateContent(prompt);
          text = result.response.text();
          if (text) break;
        } catch (mErr) {
          console.warn(`Supervisor model ${mName} failed, trying fallback:`, mErr);
        }
      }

      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      justification = parsed.justification;
      customerFacingExplanation = parsed.customerFacing;
    } catch (e) {
      console.warn('Gemini Supervisor fallback:', e);
    }
  }

  if (!justification) {
    if (finalDecision === 'APROVAÇÃO AUTOMÁTICA') {
      justification = `Operação com baixíssimo risco estatístico (PD ${risk.defaultProbabilityPct}%), 100% em conformidade com as regras da POL-LIM-02.1 e POL-RISK-01.4. Renda comprovada via Open Finance (${profile.openFinance.connectedBanks.join(', ')}) com ${profile.openFinance.incomeMatchPct}% de convergência.`;
      customerFacingExplanation = `Parabéns, ${profile.name}! Sua solicitação de crédito de R$ ${profile.requestedAmount.toLocaleString('pt-BR')} foi pré-aprovada. Suas informações compartilhadas via Open Finance no ${profile.openFinance.connectedBanks.join(', ')} garantiram uma resposta rápida e sem burocracia.`;
    } else if (finalDecision === 'DOCUMENTAÇÃO COMPLEMENTAR') {
      justification = `A operação atinge ${profile.incomeCommitmentPct}% de comprometimento da renda. Embora o Open Finance esteja ativo no ${profile.openFinance.connectedBanks.join(', ')}, o valor de R$ ${profile.requestedAmount.toLocaleString('pt-BR')} exige confirmação de renda suplementar.`;
      customerFacingExplanation = `Entendemos que transparência é tudo. Para darmos continuidade ao seu pedido de R$ ${profile.requestedAmount.toLocaleString('pt-BR')}, pedimos apenas o envio de um comprovante de renda recente para complementar os dados do seu Open Finance.`;
    } else {
      justification = `Operação enquadrada em ALTO RISCO com probabilidade de inadimplência de ${risk.defaultProbabilityPct}%. ${profile.openFinance.isConnected ? 'Extrato Open Finance indicou sobre-endividamento ou uso de cheque especial.' : 'Cliente não ativou o Open Finance para validação de alta quantia.'} Parecer humano obrigatório.`;
      customerFacingExplanation = `Sua solicitação de crédito de R$ ${profile.requestedAmount.toLocaleString('pt-BR')} foi direcionada para a nossa equipe de especialistas de crédito para um estudo personalizado. Em breve você receberá um retorno em seu aplicativo.`;
    }
  }

  const policyAdherencePct = finalDecision === 'APROVAÇÃO AUTOMÁTICA' ? 100 : finalDecision === 'DOCUMENTAÇÃO COMPLEMENTAR' ? 88 : 65;

  const supervisor: SupervisorOutput = {
    riskLevel: risk.riskLevel,
    finalDecision,
    confidencePct: risk.confidenceIndexPct,
    justification,
    positiveDrivers: explainability.positiveFactors,
    attentionDrivers: explainability.attentionFactors,
    policyAdherencePct,
    recommendedNextAction,
    requiresHumanReview,
    customerFacingExplanation
  };

  const step: AgentExecutionStep = {
    agentId: 'supervisor',
    agentName: 'Supervisor Inteligente',
    role: 'Consolidação regulatória, Open Finance & salvaguarda humana',
    status: 'completed',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    durationMs: 850,
    summary: `Recomendação final: ${finalDecision} (${risk.riskLevel} RISCO). Confiança Open Finance: ${risk.confidenceIndexPct}%.`
  };

  return { supervisor, step };
}

/**
 * COMPLETE MULTI-AGENT ORCHESTRATOR
 */
export async function executeFullCreditAnalysis(
  input: CustomerInput,
  apiKey?: string
): Promise<AnalysisResultFull> {
  const analysisId = 'ANALYSIS-' + Math.floor(100000 + Math.random() * 900000);
  const timestamp = new Date().toISOString();

  // 1. Customer Profile Agent
  const { profile, step: step1 } = runCustomerProfileAgent(input);

  // 2. Risk Analysis Agent
  const { riskAnalysis, step: step2 } = runRiskAnalysisAgent(profile);

  // 3. Policy & Compliance Agent (RAG)
  const { policyCompliance, step: step3 } = runPolicyComplianceAgent(profile);

  // 4. Explainability Agent (XAI)
  const { explainability, step: step4 } = await runExplainabilityAgent(profile, riskAnalysis, policyCompliance, apiKey);

  // 5. Smart Supervisor Agent
  const { supervisor, step: step5 } = await runSmartSupervisorAgent(profile, riskAnalysis, policyCompliance, explainability, apiKey);

  return {
    id: analysisId,
    timestamp,
    customer: profile,
    riskAnalysis,
    policyCompliance,
    explainability,
    supervisor,
    executionSteps: [step1, step2, step3, step4, step5]
  };
}
