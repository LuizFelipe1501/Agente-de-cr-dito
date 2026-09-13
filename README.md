# Klarna Smart Credit AI 🚀

Plataforma inteligente e protótipo funcional para apoio à análise e concessão de crédito em fintechs, combinando **Machine Learning**, **Inteligência Artificial Generativa (Google Gemini)**, **RAG (Retrieval-Augmented Generation)**, **Explainable AI (XAI)**, **Arquitetura Multi-Agente** e **Supervisão Humana (Human-in-the-Loop)**.

---

## 🌟 Visão Geral & Proposta de Valor

O **Klarna Smart Credit AI** resolve o problema crítico de transparência na concessão de crédito. Ele elimina a "caixa-preta" de decisões automatizadas de rejeição de crédito, oferecendo uma **camada inteligente de apoio à decisão**.

> **Princípio Central:** A IA atua como um copiloto explicável e transparente. O sistema **não substitui** a responsabilidade humana em operações de elevado risco ou impacto financeiro.

---

## 🤖 Arquitetura Multi-Agente (5 Agentes Especializados)

1. 👤 **Agente de Perfil do Cliente:** Consolida renda, comprometimento mensal de parcela, tempo de conta, uso de limite disponível e histórico comportamental.
2. 🎯 **Agente de Análise de Risco:** Estimador de Probabilidade de Inadimplência (PD %), Score de risco (0-100), nível de alavancagem e detecção de sinais anômalos/fraude.
3. ⚖️ **Agente de Políticas e Compliance (RAG):** Consulta em tempo real a base de conhecimento interna (*POL-LIM-02.1*, *POL-RISK-01.4*, *POL-COMP-03.0*, *POL-DOC-02.0*). **Garantia de zero alucinação:** se a regra não constar na base, informa *"Informação não encontrada nas políticas disponíveis"*.
4. 💡 **Agente de Explicabilidade (XAI):** Traduz métricas estatísticas em uma justificativa transparente, destacando fatores positivos e de atenção, sem expor código, pesos ou prompts proprietários.
5. 🛡️ **Supervisor Inteligente:** Sintetiza os pareceres dos 4 agentes, atribui o nível de risco e define a recomendação final entre 3 Níveis Regulatórios:
   - 🟢 **APROVAÇÃO AUTOMÁTICA** (Baixo Risco)
   - 🟡 **DOCUMENTAÇÃO COMPLEMENTAR** (Risco Moderado)
   - 🔴 **ANÁLISE HUMANA** (Alto Risco / Inconsistência)

---

## 💻 Como Rodar Localmente

### Pré-requisitos
- Node.js 18.x ou superior
- NPM ou PNPM

### 1. Clonar o Repositório e Instalar Dependências
```bash
npm install
```

### 2. (Opcional) Configurar Chave da API do Gemini
Crie um arquivo `.env.local` na raiz do projeto:
```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio
```
*Nota: Se a chave não for informada, o aplicativo funciona 100% offline utilizando a engine de simulação determinística.*

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) em seu navegador.

---

## 🚀 Como Fazer Deploy na Vercel

O projeto foi construído utilizando **Next.js (App Router)** e está 100% otimizado para deploy em 1 clique na Vercel:

1. Suba este código para o seu repositório no **GitHub** / GitLab.
2. Acesse o painel da [Vercel](https://vercel.com) e importe o repositório.
3. Nas variáveis de ambiente (Environment Variables), adicione:
   - `GEMINI_API_KEY`: *(opcional, obtida em https://aistudio.google.com)*
4. Clique em **Deploy**.

---

## 🛡️ Governança & Segurança
- **Não-Discriminação:** Proteção absoluta contra uso de atributos sensíveis (raça, religião, gênero, orientação sexual).
- **Auditabilidade Total:** Trilha de auditoria em tempo real com data, horário, agentes ativados, fontes RAG citadas e registro da ação do analista humano.
