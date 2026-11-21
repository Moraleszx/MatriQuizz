/* =====================================================================
   ENADE + ajustes — carregue DEPOIS do script.js (veja o index.html)
   ===================================================================== */

/* ---------- tempos: 50 s nos níveis normais, 100 s no ENADE ---------- */
DIFF.facil.time = 50; DIFF.medio.time = 50; DIFF.dificil.time = 50;
DIFF.enade = { lvl:3, lo:-9, hi:9, time:100, name:'ENADE', icon:'🎓', mult:2 };

/* ---------- dicas específicas para as questões de Teoria ---------- */
const HINTS = [
  'A ordem é <b>linhas × colunas</b>: o primeiro número é o de linhas.',
  'Pense no número 1 da multiplicação: qual matriz faz esse papel?',
  'A inversa usa a divisão por det(A). O que acontece com uma divisão por zero?',
  'Teste com um exemplo 2×2 simples: calcule A·B e B·A e compare.',
  'Cada elemento de A·B é <b>linha de A × coluna de B</b>: os tamanhos precisam "encaixar".',
  'Calcule o determinante de uma 2×2 e o da sua transposta (b e c trocam de lugar).',
  'Compare cada elemento com o seu "espelho" pela diagonal principal.',
  'Lembre de meias e sapatos: quem entra por último sai primeiro.',
  'Imagine o quadrado unitário e o que acontece com a <b>área</b> dele depois da transformação.',
  'Retas paralelas se encontram? Quantos pontos em comum elas têm?',
  'Det ≠ 0 significa que a matriz tem inversa, então x = A⁻¹·b é a única solução.',
  'Lembre de u·v = |u||v|·cos θ e do valor de cos 90°.',
  'Autovetor: A·v = λ·v. A <b>direção</b> de v se mantém.',
  'Pense no "elemento neutro" da multiplicação, só que em forma de matriz 3×3.',
  'Rotações não distorcem nem espelham a figura. O que isso diz sobre a área?',
  'Procure a operação que pode ser desfeita sem perder informação.',
  'Pense em como um personagem 3D gira, anda e muda de tamanho num jogo.',
  'É o "zero" da soma: o que você soma a um número para ele não mudar?'
];
BANK.forEach((b,i)=>{ b.h = HINTS[i] || 'Elimine primeiro as alternativas que você tem certeza de que estão erradas.'; });
function gConceito2(){
  if(!bankLeft.length) bankLeft = shuffle(BANK.slice());
  const b = bankLeft.pop();
  return { q:b.q, vis:'', choices:shuffle(b.o.map((t,i)=>({html:t,correct:i===0}))), hint:b.h, exp:b.e };
}
TOPICS.conceitos.gens = [[gConceito2,0]];

/* ===================== ENADE: auxiliares ===================== */
const ROM = ['I','II','III'];
const COMBOS = ['Apenas I','Apenas II','Apenas III','I e II','I e III','II e III','I, II e III','Nenhuma está correta'];
const mk = (t,ok,w) => ({t,ok,w});
function comboOf(oks){
  const idx=[0,1,2].filter(i=>oks[i]);
  if(!idx.length) return COMBOS[7];
  if(idx.length===3) return COMBOS[6];
  if(idx.length===1) return 'Apenas '+ROM[idx[0]];
  return ROM[idx[0]]+' e '+ROM[idx[1]];
}
function assertQ(pool, intro, tip){
  const it = shuffle(pool.slice()).slice(0,3);
  const ans = comboOf(it.map(x=>x.ok));
  const others = shuffle(COMBOS.filter(c=>c!==ans)).slice(0,3);
  const opts = shuffle([{html:ans,correct:true}, ...others.map(c=>({html:c,correct:false}))]);
  const li = it.map((x,i)=>`<div style="margin:6px 0"><b>${ROM[i]}.</b> ${x.t}</div>`).join('');
  return {
    q:`${intro}<div style="font-weight:600;font-size:18px;margin-top:10px">${li}</div><div style="margin-top:8px">É correto o que se afirma em:</div>`,
    vis:'', choices:opts,
    hint:`${tip} Analise uma afirmação de cada vez; para as que parecem falsas, tente achar um <b>contraexemplo</b>.`,
    exp: it.map((x,i)=>`<b>${ROM[i]}.</b> ${x.ok?'✅ Verdadeira':'❌ Falsa'}: ${x.w}`).join('<br>') + `<br>Resposta: <b>${ans}</b>.`
  };
}

/* ===================== ENADE: afirmativas por tema ===================== */
const POOL = {
  mat:[
    mk('(A·B)ᵀ = Bᵀ·Aᵀ para quaisquer A e B cujo produto exista.',true,'na transposta do produto a ordem inverte.'),
    mk('(A + B)² = A² + 2·A·B + B² para quaisquer matrizes quadradas.',false,'isso só vale se A·B = B·A; em geral o produto de matrizes não é comutativo.'),
    mk('Se A·B = 0 (matriz nula), então A = 0 ou B = 0.',false,'contraexemplo: A = [1 0; 0 0] e B = [0 0; 0 1] dão A·B = 0 sem que nenhuma seja nula.'),
    mk('Se A·B = A·C e A é inversível, então B = C.',true,'multiplicando os dois lados por A⁻¹ à esquerda, sobra B = C.'),
    mk('O produto de duas matrizes simétricas é sempre simétrico.',false,'(A·B)ᵀ = Bᵀ·Aᵀ = B·A, que em geral é diferente de A·B.'),
    mk('A soma de duas matrizes simétricas de mesma ordem é simétrica.',true,'(A + B)ᵀ = Aᵀ + Bᵀ = A + B.'),
    mk('Se A é inversível, então (A⁻¹)⁻¹ = A.',true,'a inversa da inversa devolve a matriz original.'),
    mk('(A·B)⁻¹ = A⁻¹·B⁻¹ para A e B inversíveis.',false,'o correto é (A·B)⁻¹ = B⁻¹·A⁻¹ (a ordem inverte).')
  ],
  det:[
    mk('det(A·B) = det(A)·det(B) para matrizes quadradas de mesma ordem.',true,'o determinante é multiplicativo.'),
    mk('det(A + B) = det(A) + det(B) para quaisquer A e B quadradas.',false,'o determinante não é aditivo; teste com A = B = I (2×2): det(2I) = 4, mas 1 + 1 = 2.'),
    mk('Se duas linhas de A são iguais, então det(A) = 0.',true,'linhas iguais tornam as linhas dependentes.'),
    mk('Trocar duas linhas de uma matriz troca o sinal do determinante.',true,'é uma propriedade das operações elementares.'),
    mk('Se det(A) = 0, então A tem alguma linha nula.',false,'basta uma linha ser múltipla de outra, como em [1 2; 2 4].'),
    mk('Se det(A) ≠ 0, o sistema A·x = b tem solução única para qualquer b.',true,'A é inversível, então x = A⁻¹·b.'),
    mk('det(A⁻¹) = −det(A).',false,'o correto é det(A⁻¹) = 1/det(A).'),
    mk('det(Aᵀ) = det(A).',true,'transpor não altera o determinante.')
  ],
  sis:[
    mk('Todo sistema linear homogêneo admite pelo menos a solução trivial.',true,'x = 0 sempre satisfaz A·x = 0.'),
    mk('Um sistema com mais equações do que incógnitas nunca tem solução.',false,'pode ser possível, por exemplo quando uma equação é combinação das outras.'),
    mk('Um sistema possível com mais incógnitas do que equações é indeterminado.',true,'há variáveis livres, então existem infinitas soluções.'),
    mk('Se o posto da matriz dos coeficientes é igual ao da matriz ampliada, o sistema é possível.',true,'é o teorema de Rouché-Capelli.'),
    mk('Se det dos coeficientes (matriz quadrada) é zero, o sistema é obrigatoriamente impossível.',false,'também pode ser possível e indeterminado (infinitas soluções).'),
    mk('Um sistema linear pode ter exatamente duas soluções.',false,'só existem três casos: nenhuma, uma única ou infinitas soluções.'),
    mk('Operações elementares nas linhas preservam o conjunto-solução do sistema.',true,'é por isso que o escalonamento funciona.')
  ],
  vet:[
    mk('Se u·v = 0 e ambos são não nulos, então u e v são perpendiculares.',true,'cos θ = 0 ⇒ θ = 90°.'),
    mk('|u + v| = |u| + |v| para quaisquer vetores u e v.',false,'só vale quando têm a mesma direção e sentido; em geral |u + v| ≤ |u| + |v|.'),
    mk('|u·v| ≤ |u|·|v| para quaisquer u e v.',true,'é a desigualdade de Cauchy-Schwarz (|cos θ| ≤ 1).'),
    mk('O produto escalar de dois vetores é um vetor.',false,'o produto escalar é um <b>número</b>.'),
    mk('Dois vetores não nulos paralelos são múltiplos escalares um do outro.',true,'é a definição de paralelismo.'),
    mk('u·v = v·u para quaisquer vetores.',true,'o produto escalar é comutativo.'),
    mk('Se u·v > 0 (vetores não nulos), o ângulo entre eles é obtuso.',false,'u·v > 0 significa cos θ > 0, ou seja, ângulo <b>agudo</b>.')
  ],
  tf:[
    mk('Toda transformação linear leva a origem na origem.',true,'T(0) = T(0·v) = 0·T(v) = 0.'),
    mk('A translação (x, y) → (x + 2, y) é uma transformação linear.',false,'ela leva (0, 0) em (2, 0); transformações lineares fixam a origem.'),
    mk('Rotações preservam comprimentos e ângulos.',true,'rotação é um movimento rígido.'),
    mk('Toda reflexão tem determinante positivo.',false,'reflexões têm determinante −1 (invertem a orientação).'),
    mk('A composição de duas rotações no plano (mesma origem) é uma rotação.',true,'os ângulos se somam.'),
    mk('Se det(M) = 0, a transformação pode "achatar" uma figura em um segmento ou ponto.',true,'a área é multiplicada por |det| = 0.'),
    mk('Para duas matrizes M₁ e M₂, M₂·M₁ = M₁·M₂ sempre.',false,'a composição não é comutativa; a ordem das transformações importa.'),
    mk('O cisalhamento [1 1; 0 1] preserva áreas.',true,'seu determinante é 1.')
  ],
  teo:[
    mk('Os autovalores de uma matriz triangular são os elementos da sua diagonal principal.',true,'det(A − λI) é o produto dos termos (aᵢᵢ − λ).'),
    mk('Matrizes semelhantes têm os mesmos autovalores.',true,'têm o mesmo polinômio característico.'),
    mk('Toda matriz real quadrada possui autovalores reais.',false,'a rotação de 90° no plano não tem autovalor real.'),
    mk('Se λ é autovalor de A, então λ² é autovalor de A².',true,'A²·v = A·(λv) = λ²·v.'),
    mk('Autovetores associados a autovalores distintos são linearmente independentes.',true,'é um resultado clássico da diagonalização.'),
    mk('Qualquer conjunto de 3 vetores de R² é linearmente independente.',false,'em R² no máximo 2 vetores podem ser LI.'),
    mk('O posto de uma matriz é igual ao posto da sua transposta.',true,'posto por linhas = posto por colunas.'),
    mk('Se A é 3×3 e det(A) = 0, então 0 é autovalor de A.',true,'det(A − 0·I) = det(A) = 0.')
  ]
};

/* ===================== ENADE: MATRIZES ===================== */
function eMatPot(){
  const a=nz(-3,3), n=R(3,7), M=[[1,a],[0,1]], Rn=[[1,n*a],[0,1]];
  return { q:`Seja <b>A</b> a matriz abaixo. Quanto vale <b>A<sup>${n}</sup></b> (A multiplicada por ela mesma ${n} vezes)?`, vis:named('A',M),
    correct:Rn, distractors:[[[1,Math.pow(a,n)],[0,1]],[[1,a+n],[0,1]],[[1,a],[0,1]],[[n,n*a],[0,n]]], fallback:()=>tweak(Rn), render:mat, key:K,
    hint:`Calcule A², depois A³, e observe o padrão: só o elemento do canto superior direito muda.`,
    exp:`A² = ${mat(mul(M,M))} e A³ = ${mat(mul(mul(M,M),M))}. O padrão é <b>Aⁿ = [1 n·a; 0 1]</b>, com a = ${fm(a)}.<br>Para n = ${n}: ${mat(Rn)}` };
}
function eMatCusto(){
  const P=rm(2,2,2,9), c=[R(2,9),R(2,9)], tot=P.map(r=>r[0]*c[0]+r[1]*c[1]), f=pick([0,1]);
  return { q:`Uma indústria tem 2 fábricas e 2 produtos. A matriz <b>P</b> mostra as unidades produzidas por dia (linha = fábrica, coluna = produto). O custo unitário é <b>R$ ${c[0]}</b> (produto 1) e <b>R$ ${c[1]}</b> (produto 2). Qual é o <b>custo diário total da fábrica ${f+1}</b>?`, vis:named('P',P),
    correct:tot[f], distractors:[tot[1-f], P[f][0]*c[1]+P[f][1]*c[0], P[0][f]*c[0]+P[1][f]*c[1], tot[0]+tot[1]], fallback:()=>tot[f]+nz(-9,9), render:v=>'R$ '+v, key:String,
    hint:`Multiplique a <b>linha ${f+1}</b> de P pelo vetor de custos (${c[0]}, ${c[1]}): quantidade × preço de cada produto, e some.`,
    exp:`Custo da fábrica ${f+1} = ${P[f][0]}·${c[0]} + ${P[f][1]}·${c[1]} = ${P[f][0]*c[0]} + ${P[f][1]*c[1]} = <b>R$ ${tot[f]}</b>. Isso é a linha ${f+1} do produto P·c.` };
}
const eMatAssert = () => assertQ(POOL.mat,'Sejam A, B e C matrizes quadradas de mesma ordem. Analise as afirmações:','Lembre que o produto de matrizes não é comutativo e que a transposta e a inversa de um produto invertem a ordem.');

/* ===================== ENADE: DETERMINANTES ===================== */
function eDetProp(){
  const b=pick([2,4,-2,-1]), m=nz(-3,3), a=m*b, k=pick([2,3]), ans=Math.pow(k,3)*m;
  return { q:`Sejam A e B matrizes <b>3×3</b> com det(A) = ${fm(a)} e det(B) = ${fm(b)}. Quanto vale <b>det(${k}·Aᵀ·B⁻¹)</b>?`, vis:'',
    correct:ans, distractors:[k*m, k*a*b, Math.pow(k,3)*a*b, -ans], fallback:()=>ans+nz(-9,9), render:fm, key:String,
    hint:`Use: det(k·M) = kⁿ·det(M) (n = ordem), det(Aᵀ) = det(A), det(B⁻¹) = 1/det(B) e det(X·Y) = det(X)·det(Y).`,
    exp:`det(${k}·Aᵀ·B⁻¹) = ${k}³ · det(Aᵀ) · det(B⁻¹) = ${Math.pow(k,3)} · ${p(a)} · (1/${p(b)}) = <b>${fm(ans)}</b>.` };
}
function eDetParam(){
  const m=R(2,5), c=R(1,9), e=R(1,9), q2=m*m;
  const correct=`k = ${m} ou k = −${m}`;
  return { q:`Considere o sistema abaixo. Para quais valores de <b>k</b> ele <b>não</b> possui solução única?`,
    vis:`<span class="eq">x + k·y = ${c}</span><span class="eq">k·x + ${q2}·y = ${e}</span>`,
    correct, distractors:[`somente k = ${m}`,`somente k = −${m}`,`k = ${q2} ou k = −${q2}`,'k = 0'], fallback:()=>`k = ${m+nz(1,3)}`, render:s=>s, key:String,
    hint:`Não ter solução única = o determinante da matriz dos coeficientes é <b>zero</b>. Monte o determinante em função de k.`,
    exp:`det = 1·${q2} − k·k = ${q2} − k². Igualando a zero: k² = ${q2}, então <b>k = ${m} ou k = −${m}</b>. Nesses valores o sistema é impossível ou indeterminado.` };
}
function eDetArea(){
  let A,D; do{ A=rm(2,2,-3,4); D=det2(A); }while(D===0||Math.abs(D)>9);
  const S0=R(2,12)*10, ans=Math.abs(D)*S0;
  return { q:`Um terreno de <b>${S0} m²</b> é mapeado em um software de projeto por uma transformação linear de matriz A. Qual é a <b>área da região transformada</b>?`, vis:named('A',A),
    correct:ans, distractors:[D*S0, S0+Math.abs(D), Math.abs(A[0][0]*A[1][1])*S0, Math.round(S0/Math.abs(D))], fallback:()=>ans+10*nz(-3,3), render:v=>fm(v)+' m²', key:String,
    hint:`O fator de mudança de área é o <b>módulo do determinante</b> da matriz.`,
    exp:`det(A) = ${p(A[0][0])}·${p(A[1][1])} − ${p(A[0][1])}·${p(A[1][0])} = ${fm(D)}. Nova área = |${fm(D)}| · ${S0} = <b>${ans} m²</b>. (O sinal só indica se a figura foi "espelhada".)` };
}
const eDetAssert = () => assertQ(POOL.det,'Sejam A e B matrizes quadradas de mesma ordem. Analise as afirmações:','Lembre das propriedades: det(AB) = det(A)·det(B), det(Aᵀ) = det(A) e o efeito das operações elementares.');

/* ===================== ENADE: SISTEMAS ===================== */
function eSisSPI(){
  const a=R(2,4), b=R(1,5), c=pick([2,3]), k=c*a, m=c*b;
  return { q:`No sistema abaixo, quais valores de <b>k</b> e <b>m</b> o tornam <b>possível e indeterminado</b> (infinitas soluções)?`,
    vis:`<span class="eq">x + ${a}y = ${b}</span><span class="eq">${c}x + k·y = m</span>`,
    correct:[k,m], distractors:[[k,m+1],[k+1,m],[c*b,c*a],[k,b]], fallback:()=>[k+nz(-2,2),m+nz(-2,2)], render:v=>`k = ${v[0]}, m = ${v[1]}`, key:K,
    hint:`Para ter infinitas soluções, a 2ª equação precisa ser a 1ª multiplicada por um número (aqui, ×${c}).`,
    exp:`Multiplicando a 1ª equação por ${c}: ${c}x + ${c*a}y = ${c*b}. Então <b>k = ${k}</b> e <b>m = ${m}</b>. (Se k = ${k} mas m ≠ ${m}, as retas são paralelas e o sistema é impossível.)` };
}
function eSisLiga(){
  const a=5*R(2,10), b=5*R(2,10), T=a+b, Q=(a+3*b)/5;
  return { q:`Uma metalúrgica mistura a liga <b>A</b> (20% de cobre) com a liga <b>B</b> (60% de cobre) e obtém <b>${T} kg</b> de uma nova liga contendo <b>${Q} kg</b> de cobre puro. Quantos kg da liga <b>A</b> foram usados?`, vis:'',
    correct:a, distractors:[b, a+5, a-5, Math.round(T/2)], fallback:()=>a+5*nz(-2,2), render:v=>v+' kg', key:String,
    hint:`Chame de x os kg de A e de y os kg de B. Monte: <b>x + y = ${T}</b> e <b>0,2x + 0,6y = ${Q}</b>.`,
    exp:`x + y = ${T} e 0,2x + 0,6y = ${Q}. Multiplicando a 2ª por 5: x + 3y = ${5*Q}. Subtraindo a 1ª: 2y = ${5*Q-T}, logo y = ${b} e x = ${T} − ${b} = <b>${a} kg</b>.` };
}
const eSisAssert = () => assertQ(POOL.sis,'Sobre sistemas de equações lineares, analise as afirmações:','Lembre que um sistema só pode ter 0, 1 ou infinitas soluções e pense no posto e no determinante.');

/* ===================== ENADE: VETORES ===================== */
const ANG=[ [[2,0],[2,2],45],[[1,1],[0,2],45],[[3,0],[-3,3],135],[[0,2],[-2,-2],135],[[1,1],[-1,1],90],[[2,0],[0,3],90],[[0,1],[3,3],45],[[1,0],[-2,2],135] ];
const COSTXT={45:'√2/2',90:'0',135:'−√2/2'};
function eVecAngle(){
  const [u0,v0,ang]=pick(ANG), s=pick([1,2]), t=pick([1,3]), u=u0.map(x=>x*s), v=v0.map(x=>x*t);
  const d=u[0]*v[0]+u[1]*v[1], nu=u[0]*u[0]+u[1]*u[1], nv=v[0]*v[0]+v[1]*v[1];
  return { q:`Qual é o <b>ângulo</b> entre os vetores u = ${vecTxt(u)} e v = ${vecTxt(v)}?`, vis:'',
    correct:ang, distractors:[30,60,120,150,45,90,135].filter(x=>x!==ang), fallback:()=>ang+15*nz(-2,2), render:v=>v+'°', key:String,
    hint:`Use cos θ = (u·v) / (|u|·|v|). Calcule primeiro o produto escalar e depois os módulos.`,
    exp:`u·v = ${p(u[0])}·${p(v[0])} + ${p(u[1])}·${p(v[1])} = ${fm(d)}; |u| = √${nu}; |v| = √${nv}.<br>cos θ = ${fm(d)} / √${nu*nv} = ${COSTXT[ang]}, então <b>θ = ${ang}°</b>.` };
}
function eVecTrab(){
  const F=[R(-4,8),R(-4,8)], d=[R(1,6),R(-3,6)], W=F[0]*d[0]+F[1]*d[1];
  return { q:`Uma força <b>F = ${vecTxt(F)} N</b> desloca um objeto da origem até o ponto <b>d = ${vecTxt(d)} m</b>. O trabalho realizado é W = F·d. Quanto vale <b>W</b>?`, vis:'',
    correct:W, distractors:[F[0]*d[1]+F[1]*d[0], F[0]*d[0]-F[1]*d[1], -W, W+10], fallback:()=>W+nz(-9,9), render:v=>fm(v)+' J', key:String,
    hint:`Trabalho = <b>produto escalar</b> entre a força e o deslocamento: multiplique x com x, y com y e some.`,
    exp:`W = F·d = ${p(F[0])}·${p(d[0])} + ${p(F[1])}·${p(d[1])} = ${fm(F[0]*d[0])} + ${p(F[1]*d[1])} = <b>${fm(W)} J</b>.` };
}
function eVecProj(){
  const [a,b]=pick([[3,4],[4,3],[-3,4],[4,-3]]), t=nz(-3,3), s=nz(-3,3);
  const u=[a*t-b*s, b*t+a*s], pr=[a*t,b*t];
  return { q:`Qual é a <b>projeção ortogonal</b> de u = ${vecTxt(u)} sobre v = ${vecTxt([a,b])}?`, vis:'',
    correct:pr, distractors:[[-b*s,a*s],[b*t,a*t],u,[a*s,b*s]], fallback:()=>[pr[0]+nz(-2,2),pr[1]+nz(-2,2)], render:vecTxt, key:K,
    hint:`Use proj<sub>v</sub>(u) = (u·v / v·v) · v. Calcule os dois produtos escalares e multiplique o resultado pelo vetor v.`,
    exp:`u·v = ${p(u[0])}·${p(a)} + ${p(u[1])}·${p(b)} = ${fm(u[0]*a+u[1]*b)} e v·v = ${a*a+b*b}.<br>proj = (${fm(u[0]*a+u[1]*b)}/${a*a+b*b}) · ${vecTxt([a,b])} = ${fm(t)} · ${vecTxt([a,b])} = <b>${vecTxt(pr)}</b>.` };
}
const eVecAssert = () => assertQ(POOL.vet,'Sobre vetores no plano e no espaço, analise as afirmações:','Relembre u·v = |u||v|·cos θ e as propriedades do produto escalar e da norma.');

/* ===================== ENADE: TRANSFORMAÇÕES ===================== */
function twoTf(){ const pool=TF.slice(0,8), t1=pick(pool); let t2; do{ t2=pick(pool);}while(t2===t1); return [t1,t2]; }
function eTfComp(){
  const [t1,t2]=twoTf(); let P; do{ P=[R(-4,4),R(-4,4)]; }while(P[0]===0||P[1]===0||P[0]===P[1]);
  const r1=apply(t1.M,P), r2=apply(t2.M,r1);
  return { q:`Ao ponto <b>P = ${vecTxt(P)}</b> aplica-se primeiro: <b>${t1.n}</b> e, em seguida: <b>${t2.n}</b>. Qual é a posição final do ponto?`, vis:'',
    correct:r2, distractors:[apply(t1.M,apply(t2.M,P)), r1, apply(t2.M,P), P], fallback:()=>[r2[0]+nz(-2,2),r2[1]], render:vecTxt, key:K,
    hint:`Faça em duas etapas: descubra onde P vai com a 1ª transformação e use <b>esse resultado</b> na 2ª. A ordem importa!`,
    exp:`1ª (${t1.n}): ${t1.d} leva P em ${vecTxt(r1)}.<br>2ª (${t2.n}): ${t2.d} leva ${vecTxt(r1)} em <b>${vecTxt(r2)}</b>.` };
}
function eTfMatComp(){
  const [t1,t2]=twoTf(), M=mul(t2.M,t1.M);
  return { q:`Uma transformação aplica <b>${t1.n}</b> e depois <b>${t2.n}</b>. Qual é a matriz que faz as duas de uma só vez?`, vis:`<span class="eq">M₁ = ${mat(t1.M)}</span><span class="eq">M₂ = ${mat(t2.M)}</span>`,
    correct:M, distractors:[mul(t1.M,t2.M), t1.M, t2.M, tweak(M)], fallback:()=>tweak(M), render:mat, key:K,
    hint:`A composição é <b>M₂·M₁</b>: a primeira transformação fica à direita no produto.`,
    exp:`M = M₂·M₁ = ${mat(t2.M)} · ${mat(t1.M)} = ${mat(M)}<br>(M₁·M₂ daria ${mat(mul(t1.M,t2.M))}, que nem sempre é igual.)` };
}
const eTfAssert = () => assertQ(POOL.tf,'Sobre transformações lineares no plano, analise as afirmações:','Lembre que toda transformação linear fixa a origem e que as colunas da matriz mostram para onde vão (1, 0) e (0, 1).');

/* ===================== ENADE: TEORIA ===================== */
function eAutoval(){
  let l1,l2,a,d,c;
  do{ l1=R(-3,4); l2=R(-3,4); a=R(-2,4); d=l1+l2-a; c=a*d-l1*l2; }while(l1===l2||Math.abs(c)>20);
  const A=[[a,1],[c,d]], T0=a+d, D0=l1*l2, srt=v=>[Math.min(...v),Math.max(...v)];
  return { q:`Quais são os <b>autovalores</b> da matriz A?`, vis:named('A',A),
    correct:[l1,l2], distractors:[[-l1,-l2],[a,d],[l1+1,l2],[T0,D0]], fallback:()=>[l1+nz(-2,2),l2+nz(-2,2)],
    render:v=>{ const s=srt(v); return `λ = ${fm(s[0])} e λ = ${fm(s[1])}`; }, key:v=>K(srt(v)),
    hint:`Resolva det(A − λI) = 0, que vira <b>λ² − (traço)·λ + det = 0</b>.`,
    exp:`Traço = ${fm(a)} + ${p(d)} = ${fm(T0)}; det = ${p(a)}·${p(d)} − 1·${p(c)} = ${fm(D0)}.<br>λ² − ${p(T0)}λ + ${p(D0)} = 0 ⇒ <b>λ = ${fm(Math.min(l1,l2))} e λ = ${fm(Math.max(l1,l2))}</b>.` };
}
function eLI(){
  const dep=Math.random()<.5, u=[nz(-3,3),nz(-3,3)], k=pick([2,-1,3,-2]); let v;
  if(dep) v=[k*u[0],k*u[1]]; else do{ v=[R(-4,4),R(-4,4)]; }while(u[0]*v[1]-u[1]*v[0]===0);
  const D=u[0]*v[1]-u[1]*v[0];
  return { q:`Os vetores u = ${vecTxt(u)} e v = ${vecTxt(v)} de R² são linearmente independentes (LI) ou dependentes (LD)?`, vis:'',
    choices:[{html:'LI: nenhum é múltiplo do outro',correct:!dep},{html:'LD: um é múltiplo do outro',correct:dep}],
    hint:`Monte a matriz com u e v como linhas e calcule o determinante: se der <b>zero</b>, eles são LD.`,
    exp:`det = ${p(u[0])}·${p(v[1])} − ${p(u[1])}·${p(v[0])} = <b>${fm(D)}</b>. ${dep?`Deu zero: v = ${fm(k)}·u, então são <b>LD</b>.`:'Deu diferente de zero: nenhum é múltiplo do outro, então são <b>LI</b>.'}` };
}
const eTeoAssert = () => assertQ(POOL.teo,'Sobre autovalores, independência linear e posto, analise as afirmações:','Pense na definição A·v = λ·v, no polinômio característico e na dimensão do espaço.');

/* ---------- liga os geradores ENADE aos temas ---------- */
TOPICS.matrizes.enade       = [eMatPot, eMatCusto, eMatAssert];
TOPICS.determinantes.enade  = [eDetProp, eDetParam, eDetArea, eDetAssert];
TOPICS.sistemas.enade       = [eSisSPI, eSisLiga, eSisAssert];
TOPICS.vetores.enade        = [eVecAngle, eVecTrab, eVecProj, eVecAssert];
TOPICS.transformacoes.enade = [eTfComp, eTfMatComp, eTfAssert];
TOPICS.conceitos.enade      = [eAutoval, eLI, eTeoAssert];

/* ===================== sorteio: agora entende o ENADE ===================== */
function genFor(topic){
  if(C.lvl===3){
    const list=TOPICS[topic].enade; let g,tries=0;
    do{ g=pick(list); }while(list.length>1 && g===S.lastGen && tries++<15);
    S.lastGen=g; return g();
  }
  const list=TOPICS[topic].gens.filter(g=>g[1]<=C.lvl);
  const bag=[]; list.forEach(([g,l])=>{ const w = l===C.lvl?3:1; for(let i=0;i<w;i++) bag.push(g); });
  let g, tries=0; do{ g=pick(bag); }while(list.length>1 && g===S.lastGen && tries++<15);
  S.lastGen=g; return g();
}

/* ===================== configurações e início ===================== */
function readSettings(){
  const topics=[...document.querySelectorAll('input[name=topic]:checked')].map(i=>i.value);
  if(!topics.length){ $('menuErr').textContent='Escolha pelo menos uma matéria.'; return null; }
  const np=+document.querySelector('input[name=np]:checked').value;
  const n1=($('pname1').value.trim()||'Jogador 1').slice(0,20);
  let n2=($('pname2').value.trim()||'Jogador 2').slice(0,20);
  if(np===2 && n1===n2) n2+=' (2)';
  $('menuErr').textContent='';
  return { np, names:np===2?[n1,n2]:[n1], topics,
    mode:document.querySelector('input[name=mode]:checked').value,
    perPlayer:+document.querySelector('input[name=qtd]:checked').value,
    study:$('study').checked, sound:$('sound').checked };
}

function startGame(again){
  let st;
  if(again && S) st=S.settings; else { st=readSettings(); if(!st) return; }
  const en = st.mode==='enade';
  S={ settings:st, ...st, step:0, quit:false, lastGen:null, lastLevel:null, waiting:false, answered:true,
      players:st.names.map((n,i)=>({name:n, color:PCOLORS[i], score:0, streak:0, best:0, lives:3, ok:0, hist:[], per:{}})) };
  // um tema por rodada; os dois jogadores recebem o mesmo tema e o mesmo nível
  let tq=[]; while(tq.length<st.perPlayer) tq=tq.concat(shuffle(st.topics.slice()));
  S.queue=[];
  for(let k=0;k<st.perPlayer;k++){ const level = en ? 'enade' : levelOf(k,st.perPlayer);
    for(let pp=0;pp<st.np;pp++) S.queue.push({p:pp,k,level,topic:tq[k]}); }
  bankLeft=shuffle(BANK.slice());
  $('timerBox').style.display=S.study?'none':'block';
  $('hudTime').style.display=S.study?'none':'flex';
  show('game'); nextQ();
}

/* textos específicos do ENADE */
const _showTurn = showTurn;
showTurn = function(t, levelUp, first){
  _showTurn(t, levelUp, first);
  if(C.lvl===3 && S.np===1)
    $('turnSub').innerHTML=`Nível <b>ENADE</b>: questões contextualizadas, com várias etapas e afirmativas. Você tem <b>${S.study?'tempo livre':C.time+' segundos'}</b> por pergunta.`;
};
const _finish = finish;
finish = function(){
  _finish();
  if(S && S.mode==='enade') $('resTag').textContent=`🎓 ENADE • ${S.np===2?'2 jogadores':'Solo'} • ${S.study?'Modo estudo':'Valendo pontos'}`;
};

/* ===================== menu: abas e seleção de matérias ===================== */
function syncMode(){
  const en=document.querySelector('input[name=mode]:checked').value==='enade';
  $('modeClassic').style.display=en?'none':'block';
  $('modeEnade').style.display=en?'block':'none';
}
document.querySelectorAll('input[name=mode]').forEach(r=>r.onchange=syncMode);
$('allTopics').onclick=()=>document.querySelectorAll('input[name=topic]').forEach(i=>i.checked=true);
$('noTopics').onclick=()=>document.querySelectorAll('input[name=topic]').forEach(i=>i.checked=false);
syncMode();