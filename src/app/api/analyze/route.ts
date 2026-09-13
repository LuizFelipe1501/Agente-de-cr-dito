import { NextRequest, NextResponse } from 'next/server';
import { executeFullCreditAnalysis } from '@/lib/agentEngine';
import { CustomerInput } from '@/types/credit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerInput: CustomerInput = body.customerInput;
    const apiKey = body.apiKey || process.env.GEMINI_API_KEY;

    if (!customerInput || !customerInput.name || !customerInput.monthlyIncome) {
      return NextResponse.json(
        { error: 'Dados do cliente inválidos ou incompletos.' },
        { status: 400 }
      );
    }

    const result = await executeFullCreditAnalysis(customerInput, apiKey);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error executing credit analysis:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar a análise de crédito.' },
      { status: 500 }
    );
  }
}
