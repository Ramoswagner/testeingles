// ========================================
// main.js — dados centrais, estado, armazenamento, áudio e voz
// ========================================

// ========================================
// CAT_ICONS — SVGs para cada categoria
// ========================================
const CAT_ICONS = {
  engineering:`<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
  pmgmt:`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  finance:`<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  corporate:`<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  planning:`<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>`,
  portfolio:`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`
};

// ========================================
// CATS — vocabulário completo (72 cards)
// ========================================
const CATS = {
  engineering:{
    lbl:'Engineering',pt:'Engenharia',color:'#3b82f6',
    desc:'Termos técnicos de engenharia, processos e sistemas.',
    cards:[
      {id:'e01',term:'feasibility study',ph:'/fiːzəˈbɪlɪti ˈstʌdi/',pt:'estudo de viabilidade',def:'An analysis to determine whether a project is technically, operationally, and financially practical before committing resources.',ex:'The feasibility study confirmed the bridge design was structurally sound and within budget constraints.',tip:'Sempre aparece no início de um projeto. McKinsey frequentemente conduz feasibility studies antes de qualquer proposta.'},
      {id:'e02',term:'scope creep',ph:'/skəʊp kriːp/',pt:'expansão do escopo',def:'The uncontrolled expansion of a project\'s scope without corresponding adjustments to time, cost, or resources.',ex:'Scope creep turned a three-month software rollout into an eighteen-month ordeal.',tip:'Um dos maiores inimigos do PM. Combatido com formal change requests e change control boards.'},
      {id:'e03',term:'technical debt',ph:'/ˈteknɪkəl det/',pt:'dívida técnica',def:'The implied cost of future rework caused by choosing a quick short-term solution over a better long-term approach.',ex:'Years of technical debt made the legacy system nearly impossible to scale.',tip:'Analogia financeira usada em tech strategy. Acumula "juros" — quanto mais espera, mais caro fica resolver.'},
      {id:'e04',term:'bottleneck',ph:'/ˈbɒtlnek/',pt:'gargalo',def:'A point of congestion in a system that limits overall throughput and prevents reaching full potential.',ex:'The manual approval bottleneck was delaying every downstream engineering task by two days.',tip:'Termo universal — supply chain, software, processos. Theory of Constraints (TOC) de Goldratt é o framework clássico.'},
      {id:'e05',term:'proof of concept',ph:'/pruːf əv ˈkɒnsept/',pt:'prova de conceito',def:'A demonstration that a proposed idea or design is feasible before full-scale investment.',ex:'We built a proof of concept in four weeks to validate the ML pipeline before committing the full $2M budget.',tip:'Abreviado POC. Frequente em pitches de inovação e digital transformation. Reduz risk antes de go-to-market.'},
      {id:'e06',term:'scalability',ph:'/ˌskeɪləˈbɪlɪti/',pt:'escalabilidade',def:'The capacity of a system or business to handle growing amounts of work by adding resources proportionally.',ex:'The architecture was designed for scalability to support 10x user growth within two years.',tip:'Fundamental em tech mas também figurativo: "Is this business model scalable?" — pergunta central em consulting.'},
      {id:'e07',term:'throughput',ph:'/ˈθruːpʊt/',pt:'vazão / rendimento',def:'The amount of work completed or data processed in a given unit of time; a measure of system efficiency.',ex:'Optimizing the assembly line increased daily throughput by 40% without additional headcount.',tip:'Usado em manufacturing e software. Ligado ao conceito de capacity. Throughput ≠ output bruto.'},
      {id:'e08',term:'root cause analysis',ph:'/ruːt kɔːz əˈnælɪsɪs/',pt:'análise de causa raiz',def:'A systematic process to identify the fundamental source of a failure, rather than treating only its visible symptoms.',ex:'The root cause analysis revealed the outage stemmed from an undocumented third-party dependency.',tip:'Abreviado RCA. Ferramentas: 5 Whys, Fishbone (Ishikawa). Core em Six Sigma, Lean e incident management.'},
      {id:'e09',term:'benchmark',ph:'/ˈbentʃmɑːk/',pt:'referência / parâmetro de desempenho',def:'A standard or point of reference against which performance, quality, or capabilities are measured.',ex:'Our latency benchmarks exceeded industry standards across all test scenarios in the third-party audit.',tip:'Usado como noun e verb. "Let\'s benchmark our cost structure against competitors" — pedido frequente em consulting.'},
      {id:'e10',term:'dependency',ph:'/dɪˈpendənsi/',pt:'dependência',def:'A relationship in which one task or component requires another to be completed before it can proceed.',ex:'Task 7 had an undisclosed dependency on the vendor\'s API that blocked the entire sprint for five days.',tip:'Crítico no critical path analysis. Types: Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF).'},
      {id:'e11',term:'compliance',ph:'/kəmˈplaɪəns/',pt:'conformidade regulatória',def:'Adherence to applicable laws, regulations, standards, or specifications relevant to the project or industry.',ex:'The rollout was delayed three months to meet ISO 27001 compliance requirements before go-live.',tip:'Crítico em projetos financeiros, saúde e energia. Non-compliance = serious legal and reputational liability.'},
      {id:'e12',term:'integration testing',ph:'/ˌɪntɪˈɡreɪʃən ˈtestɪŋ/',pt:'teste de integração',def:'Testing where individual modules are combined and tested as a group to expose interface defects.',ex:'Integration testing uncovered a critical data pipeline failure between two vendor APIs before launch.',tip:'Distinct from unit testing (componente isolado) e UAT (user acceptance). Ordem: unit → integration → system → UAT.'},
    ]
  },
  pmgmt:{
    lbl:'Project Management',pt:'Gestão de Projetos',color:'#8b5cf6',
    desc:'PMBOK, Agile, PMI e comunicação com stakeholders.',
    cards:[
      {id:'p01',term:'work breakdown structure',ph:'/wɜːk ˈbreɪkdaʊn ˈstrʌktʃə/',pt:'estrutura analítica do projeto (EAP)',def:'A hierarchical decomposition of the total project scope into manageable work packages.',ex:'The WBS identified 23 work packages that had been entirely overlooked in initial planning.',tip:'Abreviado WBS. Pilar do PMBOK. Regra 100%: captura 100% do trabalho — nem mais, nem menos.'},
      {id:'p02',term:'critical path',ph:'/ˈkrɪtɪkəl pɑːθ/',pt:'caminho crítico',def:'The longest sequence of dependent tasks that determines the minimum project completion time.',ex:'Any delay on the critical path would push the product launch beyond the Q3 board-mandated deadline.',tip:'Método CPM. Zero float no critical path. Qualquer atraso = atraso no projeto inteiro.'},
      {id:'p03',term:'earned value',ph:'/ɜːnd ˈvæljuː/',pt:'valor agregado',def:'A performance metric comparing planned work against actual progress and costs at a given point in time.',ex:'Earned value analysis revealed the project was 15% behind schedule with only 60% of budget remaining.',tip:'EVM: SPI = Schedule Performance Index. CPI = Cost Performance Index. CPI < 1 = acima do orçamento.'},
      {id:'p04',term:'deliverable',ph:'/dɪˈlɪvərəbəl/',pt:'entregável',def:'A tangible or intangible output that must be produced to complete a project or phase.',ex:'The final deliverable was a fully documented API with integration guides for three enterprise clients.',tip:'Deliverable ≠ milestone. Deliverable = O QUÊ é entregue (produto). Milestone = QUANDO um evento-chave ocorre.'},
      {id:'p05',term:'risk register',ph:'/rɪsk ˈredʒɪstə/',pt:'registro de riscos',def:'A document capturing identified risks with their probability, impact, owners, and response strategies.',ex:'The risk register flagged single-supplier dependency as high-probability, triggering a dual-source strategy.',tip:'Ferramenta viva — atualizada em cada ciclo. Includes: probability × impact matrix, risk owner, response plan.'},
      {id:'p06',term:'stakeholder',ph:'/ˈsteɪkhəʊldə/',pt:'parte interessada',def:'Any individual, group, or organization that may affect or be affected by a project decision.',ex:'Identifying all stakeholders in week one prevented a major political misalignment during implementation.',tip:'Stakeholder ≠ shareholder. Stakeholder management é uma das competências mais valorizadas em McKinsey engagements.'},
      {id:'p07',term:'change management',ph:'/tʃeɪndʒ ˈmænɪdʒmənt/',pt:'gestão de mudanças',def:'A systematic approach to transitioning people and organizations from a current state to a desired future state.',ex:'Without a robust change management strategy, the ERP rollout met fierce frontline resistance.',tip:'McKinsey usa o OHI (Organizational Health Index). Kotter 8 Steps e ADKAR são frameworks de mercado.'},
      {id:'p08',term:'RACI matrix',ph:'/ˈreɪsi ˈmeɪtrɪks/',pt:'matriz RACI',def:'A responsibility chart mapping tasks to roles: Responsible, Accountable, Consulted, Informed.',ex:'The RACI matrix eliminated confusion about who had final sign-off authority on design decisions.',tip:'R = faz o trabalho. A = dono único do resultado. C = consultado antes. I = informado depois.'},
      {id:'p09',term:'milestone',ph:'/ˈmaɪlstəʊn/',pt:'marco do projeto',def:'A significant, zero-duration event marking the completion of a major phase or decision point.',ex:'The board required monthly milestone updates to validate continued investment in the transformation.',tip:'Zero duration — é um ponto no tempo. Em Gantt charts: representado por diamante (◆). Usado em gate reviews.'},
      {id:'p10',term:'baseline',ph:'/ˈbeɪslaɪn/',pt:'linha de base',def:'The approved plan against which project performance is measured, capturing scope, schedule, and cost.',ex:'After the client added new features, we formally re-baselined the project to reflect the expanded scope.',tip:'PMBOK: scope + schedule + cost baseline = Performance Measurement Baseline (PMB). Changes requerem formal approval.'},
      {id:'p11',term:'sprint',ph:'/sprɪnt/',pt:'sprint',def:'A fixed time-box in Scrum (typically 1–4 weeks) during which a committed set of work is completed.',ex:'Each two-week sprint concluded with a working-software demo aligned to client expectations.',tip:'Key events: Planning, Daily Scrum, Review, Retrospective. Key artifacts: Sprint Goal, Backlog, Increment.'},
      {id:'p12',term:'lessons learned',ph:'/ˈlesənz lɜːnd/',pt:'lições aprendidas',def:'Documented knowledge from a project capturing successes, failures, and recommendations for future performance.',ex:'The lessons learned session became a mandatory reference document for all subsequent deployments.',tip:'Obrigatório no closing process group (PMBOK). Alimenta organizational process assets (OPA).'},
    ]
  },
  finance:{
    lbl:'Finance',pt:'Financeiro',color:'#10b981',
    desc:'KPIs financeiros, análise de investimentos e linguagem de P&L.',
    cards:[
      {id:'f01',term:'EBITDA',ph:'/iːˈbɪtdə/',pt:'LAJIDA (Lucro antes de juros, impostos, depreciação e amortização)',def:'Earnings Before Interest, Taxes, Depreciation and Amortization — a proxy for operational cash profitability.',ex:'The acquisition target had a robust EBITDA margin of 28%, making it attractive despite elevated debt levels.',tip:'Pronuncia: "ee-BIT-dah". EBITDA margin = EBITDA ÷ Revenue. McKinsey usa como proxy de geração de caixa operacional.'},
      {id:'f02',term:'NPV',ph:'/ˌen piː ˈviː/',pt:'VPL — Valor Presente Líquido',def:'Net Present Value: the difference between the present value of cash inflows and outflows over a project\'s life.',ex:'The NPV analysis confirmed the $40M investment would yield a positive return of $18M over five years.',tip:'NPV > 0 = cria valor. Fórmula: Σ(CFₜ/(1+r)ᵗ) − C₀. Taxa de desconto usada: WACC da empresa.'},
      {id:'f03',term:'burn rate',ph:'/bɜːn reɪt/',pt:'taxa de consumo de caixa',def:'The rate at which an organization consumes available cash, typically expressed as a monthly figure.',ex:'With a $500K monthly burn rate and $2M in reserves, the startup had a four-month runway.',tip:'Runway = caixa disponível ÷ burn rate. Crítico em startups e projetos com capital limitado.'},
      {id:'f04',term:'ROI',ph:'/ˌɑːr əʊ ˈaɪ/',pt:'retorno sobre investimento',def:'Return on Investment: a ratio evaluating the efficiency of an investment relative to its cost.',ex:'The digital transformation delivered an ROI of 340% over three years, far exceeding the 150% target.',tip:'Fórmula: (Ganho − Custo) ÷ Custo. Simples mas poderoso em executive presentations e business cases.'},
      {id:'f05',term:'CAPEX',ph:'/ˈkæpeks/',pt:'despesas de capital',def:'Capital Expenditures: funds used to acquire, upgrade, or maintain long-term physical or intangible assets.',ex:'The factory expansion required $12M in CAPEX, subject to board approval at the investment committee.',tip:'CAPEX → ativo no balanço, depreciado ao longo do tempo. OPEX → despesa no P&L corrente.'},
      {id:'f06',term:'OPEX',ph:'/ˈɒpeks/',pt:'despesas operacionais',def:'Operating Expenditures: the ongoing costs required to run a business or project day-to-day.',ex:'Migrating to cloud shifted substantial CAPEX to predictable OPEX, improving cash flow visibility.',tip:'Cloud migration é o exemplo clássico de CAPEX→OPEX shift. OPEX aparece no P&L como despesa do período corrente.'},
      {id:'f07',term:'cash flow',ph:'/kæʃ fləʊ/',pt:'fluxo de caixa',def:'The net movement of cash and cash equivalents into and out of a business over a specific period.',ex:'Despite strong revenues, poor cash flow management led the profitable firm to miss payroll cycles.',tip:'Revenue ≠ Cash Flow. Empresas lucrativas podem ir à falência por caixa insuficiente.'},
      {id:'f08',term:'cost-benefit analysis',ph:'/kɒst ˈbenɪfɪt əˈnælɪsɪs/',pt:'análise de custo-benefício',def:'A systematic comparison of all costs and expected benefits to determine whether an option is worthwhile.',ex:'The cost-benefit analysis justified the $2M upgrade by projecting $7M in annual savings over four years.',tip:'Ferramenta decisiva em business cases. Inclui tangible e intangible benefits. Sensitivity analysis complementa.'},
      {id:'f09',term:'budget variance',ph:'/ˈbʌdʒɪt ˈveəriəns/',pt:'variação orçamentária',def:'The difference between budgeted and actual amounts, indicating over- or underspending.',ex:'A 12% unfavorable budget variance in Q3 triggered an urgent review of procurement practices.',tip:'Favorable = abaixo do orçado (bom). Unfavorable/Adverse = acima do orçado. Distinção importante em reporting.'},
      {id:'f10',term:'leverage',ph:'/ˈliːvərɪdʒ/',pt:'alavancagem financeira',def:'The use of debt or borrowed capital to amplify potential investment returns, also magnifying losses.',ex:'The PE firm leveraged the acquisition at 5x EBITDA, expecting improvements to service the debt load.',tip:'Financial leverage = dívida/equity. Operating leverage = custos fixos vs variáveis. Ambos amplificam resultados.'},
      {id:'f11',term:'amortization',ph:'/əˌmɔːtɪˈzeɪʃən/',pt:'amortização',def:'The gradual reduction of an intangible asset\'s value or debt balance over time through scheduled charges.',ex:'The $6M software license was amortized over five years, smoothing the cost impact across operating periods.',tip:'Amortization = intangíveis (patentes, software, goodwill). Depreciation = ativos tangíveis. Confusão comum.'},
      {id:'f12',term:'forecast',ph:'/ˈfɔːkɑːst/',pt:'previsão financeira',def:'A dynamic projection of future financial performance based on current data, trends, and updated assumptions.',ex:'The revised Q3 forecast showed a 15% revenue shortfall, prompting targeted cost mitigation measures.',tip:'Budget (plano fixo, anual) ≠ Forecast (projeção dinâmica, revisada). Rolling forecast = best practice em FP&A.'},
    ]
  },
  corporate:{
    lbl:'Corporate English',pt:'Inglês Corporativo',color:'#f59e0b',
    desc:'Expressões do dia a dia de grandes corporações e consultorias.',
    cards:[
      {id:'c01',term:'leverage (verb)',ph:'/ˈliːvərɪdʒ/',pt:'alavancar / aproveitar ao máximo',def:'To use something strategically to achieve maximum advantage from existing resources or capabilities.',ex:'"We need to leverage our existing client relationships to accelerate market entry into the Brazilian Northeast."',tip:'Top 5 verbs in consulting. "Leverage capabilities", "leverage synergies". Aprenda a usá-lo naturalmente em pitch.'},
      {id:'c02',term:'alignment',ph:'/əˈlaɪnmənt/',pt:'alinhamento',def:'The state of agreement and shared direction among stakeholders toward common strategic objectives.',ex:'"Before we proceed, we need full alignment across the leadership team on the go-forward strategy."',tip:'Mais estratégico que "agreement". "Get alignment" = processo ativo. Crítico em client engagements.'},
      {id:'c03',term:'bandwidth',ph:'/ˈbændwɪdθ/',pt:'disponibilidade / capacidade de trabalho',def:'Informal: the available time or capacity a person or team has to take on additional responsibilities.',ex:'"I don\'t have the bandwidth to lead the Asian market expansion given current project commitments."',tip:'Metáfora de telecom usada figurativamente. Muito comum em consulting e tech. Aceito em C-suite.'},
      {id:'c04',term:'deep dive',ph:'/diːp daɪv/',pt:'análise aprofundada',def:'A thorough, detailed examination of a specific topic going beyond surface-level insights.',ex:'"Let\'s schedule a deep dive into the supply chain data before we finalize the client presentation."',tip:'Muito usado na McKinsey. Implica ir além da análise de primeiro nível — busca root causes e insights não óbvios.'},
      {id:'c05',term:'circle back',ph:'/ˈsɜːkəl bæk/',pt:'retornar ao assunto / acompanhar depois',def:'To return to a topic at a later time, typically after gathering more information.',ex:'"I don\'t have the numbers right now — let me circle back with you by end of day with the full breakdown."',tip:'Equivale a "follow up" com nuance de revisitar algo pendente. Extremamente comum em reuniões corporativas.'},
      {id:'c06',term:'action items',ph:'/ˈækʃən ˈaɪtəmz/',pt:'pontos de ação / próximos passos',def:'Specific tasks assigned to named individuals as concrete outcomes of a meeting, with clear owners and deadlines.',ex:'"Let\'s close with action items: Sarah owns the client deck, James drives vendor outreach — both due Friday."',tip:'Essencial em meeting facilitation. Bom PM/consultor fecha reuniões com action items: owner + deadline + output.'},
      {id:'c07',term:'value proposition',ph:'/ˈvæljuː ˌprɒpəˈzɪʃən/',pt:'proposta de valor',def:'A statement of the unique benefits and differentiated value a solution delivers to its intended audience.',ex:'"Our value proposition centers on speed-to-market combined with a 40% cost reduction vs. the incumbent."',tip:'Fundamental em strategy consulting. Deve responder: Why us? Why now? For whom? At what cost?'},
      {id:'c08',term:'low-hanging fruit',ph:'/ləʊ ˈhæŋɪŋ fruːt/',pt:'ganhos rápidos / oportunidades fáceis',def:'Easily achievable improvements that require minimal effort relative to the value they deliver.',ex:'"Before the full restructuring, let\'s identify the low-hanging fruit — quick wins to build momentum."',tip:'Similar a "quick win" mas enfatiza facilidade. Cuidado: overuse pode soar clichê em audiences sofisticadas.'},
      {id:'c09',term:'pain points',ph:'/peɪn pɔɪnts/',pt:'pontos de dor / problemas críticos',def:'Specific, recurring problems experienced by clients that a solution aims to address.',ex:'"Discovery interviews revealed that compliance reporting is the client\'s primary pain point, consuming 30% of analyst time."',tip:'Central em problem-solving, product development e sales. Identificar pain points precede qualquer solution design.'},
      {id:'c10',term:'buy-in',ph:'/baɪ ɪn/',pt:'adesão / comprometimento das partes',def:'The active support, agreement, and commitment obtained from key stakeholders for a plan or change initiative.',ex:'"Securing executive buy-in early eliminated the political obstacles that derailed last year\'s transformation."',tip:'"Get buy-in" = processo de convencer. "Secure buy-in" = obter comprometimento formal. Tema central em org change.'},
      {id:'c11',term:'go-to-market',ph:'/ɡəʊ tə ˈmɑːkɪt/',pt:'estratégia de entrada no mercado',def:'A strategic plan specifying how an organization will deliver its product to target customers.',ex:'"Our go-to-market strategy prioritizes enterprise accounts in three LATAM metros before broader expansion."',tip:'GTM para abreviar. Inclui: target segment, channels, pricing, messaging. Frequente em strategy decks.'},
      {id:'c12',term:'best practice',ph:'/best ˈpræktɪs/',pt:'melhor prática',def:'A method that has consistently produced superior results and is recognized as the standard to follow.',ex:'"Industry best practices suggest a structured 30/60/90-day integration roadmap for acquisitions at this scale."',tip:'Plural: "best practices". Consultores usam para validar recommendations. Peer benchmarking = finding best practices.'},
    ]
  },
  planning:{
    lbl:'Planning & Schedule',pt:'Planejamento',color:'#ec4899',
    desc:'Cronogramas, OKRs, KPIs e ferramentas de planejamento estratégico.',
    cards:[
      {id:'pl01',term:'roadmap',ph:'/ˈrəʊdmæp/',pt:'mapa de rota / plano estratégico',def:'A high-level visual plan outlining strategic goals, key milestones, and the timeline for achieving them.',ex:'"Our 18-month product roadmap aligns engineering capacity with commercial priorities across three verticals."',tip:'Strategic roadmap (macro) vs product roadmap (features/releases). Ferramenta de comunicação com stakeholders.'},
      {id:'pl02',term:'OKRs',ph:'/ˌəʊ keɪ ˈɑːrz/',pt:'Objetivos e Resultados-Chave',def:'Objectives and Key Results: a framework pairing qualitative aspirational goals with quantifiable outcomes.',ex:'"Q2 OKR — Objective: achieve LATAM market leadership; KRs: 3 enterprise contracts signed, NPS up 40%."',tip:'Google, McKinsey, Intel usam. O = aspiracional. KR = mensurável. Score 0.7 = success. KR ≠ KPI.'},
      {id:'pl03',term:'KPIs',ph:'/ˌkeɪ piː ˈaɪz/',pt:'indicadores-chave de desempenho',def:'Key Performance Indicators: quantifiable metrics that evaluate progress toward strategic objectives.',ex:'"Our top KPIs — revenue per employee, NPS, and time-to-market — are reviewed at every monthly business review."',tip:'Leading KPIs (preditivos: ex. pipeline) vs lagging KPIs (históricos: ex. revenue). Dashboard saudável tem ambos.'},
      {id:'pl04',term:'capacity planning',ph:'/kəˈpæsɪti ˈplænɪŋ/',pt:'planejamento de capacidade',def:'The process of determining required team capacity to meet projected demand within time and budget constraints.',ex:'"Capacity planning revealed we were 30% understaffed for the digital transformation workstream in Q3."',tip:'Recursos = pessoas, orçamento, equipamentos, tempo. Erros em capacity planning são a causa #1 de missed deadlines.'},
      {id:'pl05',term:'resource allocation',ph:'/rɪˈzɔːs ˌæləˈkeɪʃən/',pt:'alocação de recursos',def:'The process of identifying and assigning available assets to maximize the probability of project success.',ex:'"Suboptimal resource allocation was the primary driver of the six-month schedule overrun on the ERP."',tip:'Linked diretamente a capacity planning. Um dos top PM responsibilities. Includes: leveling e re-allocation.'},
      {id:'pl06',term:'contingency plan',ph:'/kənˈtɪndʒənsi plæn/',pt:'plano de contingência',def:'A pre-defined backup strategy activated when a risk materializes, enabling a structured response.',ex:'"Our contingency plan for the factory shutdown involved activating a secondary supplier contract within 72 hours."',tip:'Contingency = reação ao risco quando ocorre. Mitigation = reduz probabilidade. Dois conceitos distintos no PMBOK.'},
      {id:'pl07',term:'Gantt chart',ph:'/ɡænt tʃɑːt/',pt:'gráfico de Gantt / cronograma de barras',def:'A bar chart illustrating a project schedule with tasks, durations, and dependencies visualized over time.',ex:'"The Gantt chart revealed three critical tasks scheduled in parallel with insufficient resources."',tip:'Named after Henry Gantt (1910s). MS Project, Smartsheet, Monday usam. Essencial para comunicar cronograma.'},
      {id:'pl08',term:'trade-off analysis',ph:'/treɪd ɒf əˈnælɪsɪs/',pt:'análise de trade-off',def:'The evaluation of competing options by weighing costs, benefits, and risks against strategic priorities.',ex:'"The trade-off analysis between speed and quality led to a recommendation for a phased launch."',tip:'Central em strategic decision-making. McKinsey usa muito: "What are we giving up, and is that acceptable?"'},
      {id:'pl09',term:'prioritization',ph:'/praɪˌɒrɪtaɪˈzeɪʃən/',pt:'priorização',def:'The process of ranking competing tasks or goals by value and urgency to direct effort most effectively.',ex:'"Without prioritization criteria, the team spread effort across 12 initiatives and completed none satisfactorily."',tip:'Frameworks: MoSCoW, Eisenhower Matrix, ICE Score, RICE. Link prioritization to strategic value and feasibility.'},
      {id:'pl10',term:'workstream',ph:'/ˈwɜːkstriːm/',pt:'frente de trabalho',def:'A distinct, semi-independent area of work within a larger project, managed by a dedicated sub-team.',ex:'"The transformation had four workstreams: people, process, technology, and governance — each with a named lead."',tip:'Muito comum na McKinsey. Engagements são organizados em workstreams com leads. Sinônimo de "track" ou "pillar".'},
      {id:'pl11',term:'sprint planning',ph:'/sprɪnt ˈplænɪŋ/',pt:'planejamento do sprint',def:'A Scrum ceremony where the team defines the sprint goal and commits to specific backlog items.',ex:'"Sprint planning took longer because acceptance criteria were undefined for three high-priority user stories."',tip:'Sprint Planning → Execution → Review → Retrospective. Regra: 2h de planning por semana de sprint.'},
      {id:'pl12',term:'dependencies mapping',ph:'/dɪˈpendənsiz ˈmæpɪŋ/',pt:'mapeamento de dependências',def:'The systematic identification and documentation of relationships between project tasks or workstreams.',ex:'"Rigorous dependencies mapping prevented three critical path collisions across workstreams."',tip:'Network diagram (PERT/CPM) é o resultado. Cross-workstream dependencies são as mais arriscadas em large programs.'},
    ]
  },
  portfolio:{
    lbl:'Portfolio & Strategy',pt:'Portfólio & Estratégia',color:'#14b8a6',
    desc:'Gestão de portfólio, frameworks estratégicos e executive presentations.',
    cards:[
      {id:'pt01',term:'strategic alignment',ph:'/strəˈtiːdʒɪk əˈlaɪnmənt/',pt:'alinhamento estratégico',def:'The degree to which a portfolio of initiatives and capabilities points toward overarching organizational goals.',ex:'"Only 40% of active projects showed strategic alignment, justifying an urgent portfolio rationalization."',tip:'Fundamento de portfolio management. Project selection deve ser filtrado por strategic fit. PMI-PfMP enfatiza isso.'},
      {id:'pt02',term:'portfolio rationalization',ph:'/pɔːtˈfəʊliəʊ ˌræʃənəlaɪˈzeɪʃən/',pt:'racionalização de portfólio',def:'The systematic review of a project portfolio, eliminating low-value or misaligned initiatives.',ex:'"Portfolio rationalization reduced active projects from 47 to 18, tripling average completion rates."',tip:'Identificar "zombie projects" — consomem recursos sem retorno. Muito impactante em consulting engagements.'},
      {id:'pt03',term:'value creation',ph:'/ˈvæljuː kriˈeɪʃən/',pt:'criação de valor',def:'The generation of measurable improvements in financial performance, competitive position, or capability.',ex:'"The team\'s value creation plan identified $120M in EBITDA improvement across three operational levers."',tip:'A linguagem central da McKinsey. Levers: revenue growth, margin improvement, capital efficiency. Always quantify.'},
      {id:'pt04',term:'business case',ph:'/ˈbɪznɪs keɪs/',pt:'caso de negócio',def:'A structured justification for a proposed investment, analyzing costs, benefits, risks, and strategic fit.',ex:'"A compelling business case with NPV and risk scenarios accelerated board approval for the $30M investment."',tip:'Components: executive summary, problem statement, options, recommendation, financial model, risk assessment.'},
      {id:'pt05',term:'executive summary',ph:'/ɪɡˈzekjʊtɪv ˈsʌməri/',pt:'sumário executivo',def:'A concise overview giving decision-makers key findings and the recommendation without reading the full document.',ex:'"The executive summary alone closed the deal — the data story was compelling in under two pages."',tip:'Write it last, present it first. McKinsey\'s Pyramid Principle: conclusion first, evidence second. SCQA framework.'},
      {id:'pt06',term:'due diligence',ph:'/djuː ˈdɪlɪdʒəns/',pt:'diligência devida',def:'A comprehensive investigation conducted before a major transaction to verify facts and identify material risks.',ex:'"Due diligence uncovered $8M in undisclosed liabilities that restructured the acquisition\'s final valuation."',tip:'M&A context primarily, but also used in consulting for rigorous research validation. "We did thorough DD."'},
      {id:'pt07',term:'go/no-go decision',ph:'/ɡəʊ nəʊ ɡəʊ dɪˈsɪʒən/',pt:'decisão de prosseguir ou não',def:'A formal checkpoint where leadership decides whether to proceed or halt based on defined criteria.',ex:'"The go/no-go decision at Phase 2 was contingent on achieving minimum pilot metrics within 90 days."',tip:'Linked to stage-gate process. Clear criteria defined upfront reduce emotional decision-making at critical junctures.'},
      {id:'pt08',term:'quick wins',ph:'/kwɪk wɪnz/',pt:'vitórias rápidas / ganhos imediatos',def:'Early, visible improvements achieved at the start of an initiative to demonstrate value and build credibility.',ex:'"We engineered three quick wins in the first 30 days to maintain executive confidence during restructuring."',tip:'Quick wins build credibility and reduce resistance. Critical in change management. Often the most important deliverable.'},
      {id:'pt09',term:'benchmark analysis',ph:'/ˈbentʃmɑːk əˈnælɪsɪs/',pt:'análise comparativa / benchmarking',def:'A structured comparison of an organization\'s performance against industry peers or best-in-class competitors.',ex:'"Benchmark analysis revealed our SG&A ratio was 8 points above industry median — a clear cost opportunity."',tip:'External (vs. peers) vs internal (vs. own history). McKinsey: "Based on benchmarks across 200 companies globally..."'},
      {id:'pt10',term:'north star metric',ph:'/nɔːθ stɑː ˈmetrɪk/',pt:'métrica estrela-guia',def:'The single most important metric that best captures the core value a product or strategy delivers.',ex:'"Revenue retention became our north star metric, reflecting customer health far better than new sales volume."',tip:'Popularizado por growth teams. Em strategy: alinha todos os times. North Star must be leading, not lagging.'},
      {id:'pt11',term:'impact assessment',ph:'/ˈɪmpækt əˈsesmənt/',pt:'avaliação de impacto',def:'A systematic analysis of the potential consequences of a proposed action, decision, or project.',ex:'"The impact assessment quantified $15M in displaced revenue from the proposed channel restructuring."',tip:'Types: business, environmental, social. Precede major decisions. Rigor = credibility with skeptical stakeholders.'},
      {id:'pt12',term:'risk-adjusted return',ph:'/rɪsk əˈdʒʌstɪd rɪˈtɜːn/',pt:'retorno ajustado ao risco',def:'An investment performance measure that accounts for the level of risk taken to achieve a given return.',ex:'"On a risk-adjusted return basis, the infrastructure project outperformed the digital initiative by 2:1."',tip:'Sharpe Ratio é a versão financeira. In portfolio mgmt: allocate to highest risk-adjusted return, not just highest expected.'},
    ]
  }
};

// ========================================
// VOICES — opções disponíveis para o sintetizador
// ========================================
const VOICES = [
  {id:'Matthew',fl:'🇺🇸',nm:'Matthew',mt:'US · Masculino',dt:'m',lang:'en-US'},
  {id:'Joanna', fl:'🇺🇸',nm:'Joanna', mt:'US · Feminino', dt:'f',lang:'en-US'},
  {id:'Ruth',   fl:'🇺🇸',nm:'Ruth',   mt:'US · Feminino', dt:'f',lang:'en-US'},
  {id:'Brian',  fl:'🇬🇧',nm:'Brian',  mt:'UK · Masculino',dt:'m',lang:'en-GB'},
  {id:'Amy',    fl:'🇬🇧',nm:'Amy',    mt:'UK · Feminino', dt:'f',lang:'en-GB'},
  {id:'Emma',   fl:'🇬🇧',nm:'Emma',   mt:'UK · Feminino', dt:'f',lang:'en-GB'},
];
let CUR_VOICE = VOICES[0];

// ========================================
// S — estado global da aplicação
// ========================================
const S = {
  cat: null,                // categoria atual (ex: 'engineering')
  idx: 0,                   // índice do card atual
  flipped: false,           // card virado?
  mode: 'study',            // 'study' ou 'quiz'
  qScore: 0,                // pontuação no quiz (sessão atual)
  qTotal: 0,                // total de questões no quiz (sessão atual)
  qAnswered: false,         // já respondeu à questão atual?
  prog: {},                 // progresso persistido: { id: {seen, conf, qc, qt} }
  streak: 0,                // dias consecutivos
  lastDate: null            // última data de atividade
};

// ========================================
// load, save, checkStreak, markSeen — persistência localStorage
// ========================================
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('lp3') || '{}');
    S.prog = d.prog || {};
    S.streak = d.streak || 0;
    S.lastDate = d.lastDate || null;
  } catch (e) {}
  checkStreak();
}

function save() {
  try {
    localStorage.setItem('lp3', JSON.stringify({
      prog: S.prog,
      streak: S.streak,
      lastDate: S.lastDate
    }));
  } catch (e) {}
}

function checkStreak() {
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDate === today) return;
  if (S.lastDate === yest) S.streak++;
  else if (S.lastDate && S.lastDate !== today) S.streak = 0;
  S.lastDate = today;
  save();
}

function markSeen(id) {
  if (!S.prog[id]) S.prog[id] = { seen: true, conf: null, qc: 0, qt: 0 };
  S.prog[id].seen = true;
  S.lastDate = new Date().toDateString();
  save();
}

// ========================================
// toast — notificação flutuante
// ========================================
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast on ' + (type || '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.className = 'toast', 2600);
}

// ========================================
// ÁUDIO E VOZ — funções de síntese e controle
// ========================================
let _activeBtn = null;
let _audioEl = null;
let _spellTmrs = [];

function setActiveBtn(id) {
  if (_activeBtn) {
    const prev = document.getElementById(_activeBtn);
    if (prev) prev.classList.remove('playing');
  }
  _activeBtn = id;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('playing');
    document.getElementById('wave-line').classList.add('on');
    const wl = document.getElementById('wave-line');
    if (id === 'pb-main') wl.style.color = 'var(--blue-l)';
    else if (id === 'pb-slow') wl.style.color = 'var(--cyan)';
    else wl.style.color = '#a78bfa';
  } else {
    document.getElementById('wave-line').classList.remove('on');
  }
}

function stopAudio() {
  _spellTmrs.forEach(clearTimeout);
  _spellTmrs = [];
  if (_audioEl) { try { _audioEl.pause(); } catch (e) {}; _audioEl = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  setActiveBtn(null);
  resetSpellDisplay();
}

function resetSpellDisplay() {
  const sd = document.getElementById('spell-display');
  sd.classList.remove('on');
  sd.innerHTML = '';
}

// Web Speech API (fallback)
function wsaSpeak(text, lang, rate, onEnd) {
  if (!window.speechSynthesis) { onEnd && onEnd(); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = rate;
  utt.pitch = 1;
  const vv = window.speechSynthesis.getVoices();
  const pick = vv.find(v => v.lang === lang && v.localService)
            || vv.find(v => v.lang.startsWith(lang.slice(0,2)) && v.localService)
            || vv.find(v => v.lang.startsWith('en-US'))
            || vv.find(v => v.lang.startsWith('en'));
  if (pick) utt.voice = pick;
  utt.onend = utt.onerror = () => { onEnd && onEnd(); };
  window.speechSynthesis.speak(utt);
}

// Polly via StreamElements (melhor qualidade)
function pollyPlay(text, rate, onEnd, onError) {
  const url = `https://api.streamelements.com/kappa/v2/speech?voice=${CUR_VOICE.id}&text=${encodeURIComponent(text)}`;
  const a = new Audio(url);
  _audioEl = a;
  a.playbackRate = rate;
  a.onended = () => { _audioEl = null; onEnd && onEnd(); };
  a.onerror = () => { _audioEl = null; onError && onError(); };
  return a.play();
}

// Função principal chamada pelos botões
function speak(mode, e) {
  e && e.stopPropagation && e.stopPropagation();
  const card = CATS[S.cat].cards[S.idx];
  const btnId = 'pb-' + mode.replace('normal', 'main');

  if (_activeBtn === btnId) { stopAudio(); return; }
  stopAudio();

  if (mode === 'normal' || mode === 'main') {
    setActiveBtn('pb-main');
    const p = pollyPlay(card.term, 1.0,
      () => setActiveBtn(null),
      () => wsaSpeak(card.term, CUR_VOICE.lang, 0.9, () => setActiveBtn(null))
    );
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        _audioEl = null;
        wsaSpeak(card.term, CUR_VOICE.lang, 0.9, () => setActiveBtn(null));
      });
    }
  } else if (mode === 'slow') {
    setActiveBtn('pb-slow');
    const p = pollyPlay(card.term, 0.62,
      () => setActiveBtn(null),
      () => wsaSpeak(card.term, CUR_VOICE.lang, 0.55, () => setActiveBtn(null))
    );
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        _audioEl = null;
        wsaSpeak(card.term, CUR_VOICE.lang, 0.55, () => setActiveBtn(null));
      });
    }
  } else if (mode === 'spell') {
    spellTerm(card.term);
  }
}

// Soletrar letra a letra
function spellTerm(term) {
  setActiveBtn('pb-spell');
  const letters = term.replace(/[^a-zA-Z\- ]/g, '').split('');

  const sd = document.getElementById('spell-display');
  sd.innerHTML = '';
  const tiles = [];
  letters.forEach((ch) => {
    const el = document.createElement('span');
    if (ch === ' ' || ch === '-') {
      el.className = 'sl sep';
      el.textContent = ch;
    } else {
      el.className = 'sl';
      el.textContent = ch.toUpperCase();
    }
    sd.appendChild(el);
    tiles.push({ el, ch, isChar: ch !== ' ' && ch !== '-' });
  });
  sd.classList.add('on');

  const vv = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const wv = vv.find(v => v.lang === CUR_VOICE.lang && v.localService)
          || vv.find(v => v.lang.startsWith(CUR_VOICE.lang.slice(0,2)) && v.localService)
          || vv.find(v => v.lang.startsWith('en-US'))
          || vv.find(v => v.lang.startsWith('en'));

  let delay = 0;
  const charDelay = 400;

  tiles.forEach((t) => {
    if (!t.isChar) return;
    const tmr = setTimeout(() => {
      tiles.forEach(x => { if (x.el.classList.contains('lit')) x.el.classList.replace('lit', 'done'); });
      t.el.classList.add('lit');
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(t.ch.toUpperCase());
        utt.lang = CUR_VOICE.lang;
        utt.rate = 0.8;
        utt.pitch = 1;
        if (wv) utt.voice = wv;
        window.speechSynthesis.speak(utt);
      }
    }, delay);
    _spellTmrs.push(tmr);
    delay += charDelay;
  });

  const done = setTimeout(() => {
    tiles.forEach(t => { if (t.isChar) { t.el.classList.remove('lit'); t.el.classList.add('done'); } });
    setActiveBtn(null);
    const fade = setTimeout(() => resetSpellDisplay(), 1500);
    _spellTmrs.push(fade);
  }, delay + 200);
  _spellTmrs.push(done);
}

// ========================================
// PAINEL DE VOZ — construção e seleção
// ========================================
function buildVP() {
  const grid = document.getElementById('vp-grid');
  if (grid.children.length) return;
  VOICES.forEach(v => {
    const c = document.createElement('div');
    c.className = 'vc' + (v.id === CUR_VOICE.id ? ' sel' : '');
    c.id = 'vc-' + v.id;
    c.innerHTML = `<span class="vc-fl">${v.fl}</span><div class="vc-inf"><div class="vc-n">${v.nm}</div><div class="vc-m"><span class="dot dot-${v.dt}"></span>${v.mt}</div></div><span class="vc-chk">✓</span>`;
    c.onclick = e => { e.stopPropagation(); selectVoice(v); };
    grid.appendChild(c);
  });
}

function selectVoice(v) {
  CUR_VOICE = v;
  document.getElementById('vp-fl').textContent = v.fl;
  document.getElementById('vp-nm').textContent = v.nm;
  document.querySelectorAll('.vc').forEach(c => c.classList.remove('sel'));
  document.getElementById('vc-' + v.id)?.classList.add('sel');
  closeVP();
}

function togglePanel(e) {
  e.stopPropagation();
  buildVP();
  const p = document.getElementById('voice-panel');
  const pill = document.getElementById('voice-pill');
  const open = p.classList.contains('open');
  if (open) { closeVP(); } else { p.classList.add('open'); pill.classList.add('open'); }
}

function closeVP() {
  document.getElementById('voice-panel')?.classList.remove('open');
  document.getElementById('voice-pill')?.classList.remove('open');
}

// Fechar painel ao clicar fora
document.addEventListener('click', closeVP);

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  load();
  renderHome();        // definido em navigation.js
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  setTimeout(buildVP, 500);
});
