/* ===================== utilidades ===================== */
const $ = id => document.getElementById(id);
const R = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const nz = (a,b) => { let v; do{ v=R(a,b); }while(v===0); return v; };
const fm = n => n<0 ? '−'+(-n) : ''+n;            // número com sinal de menos bonito
const p  = n => n<0 ? '('+fm(n)+')' : ''+n;       // número entre parênteses se negativo
const subs = n => String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ===================== matrizes ===================== */
const rm = (m,n,lo,hi) => Array.from({length:m},()=>Array.from({length:n},()=>R(lo,hi)));
const add = (A,B) => A.map((r,i)=>r.map((v,j)=>v+B[i][j]));
const sub = (A,B) => A.map((r,i)=>r.map((v,j)=>v-B[i][j]));
const had = (A,B) => A.map((r,i)=>r.map((v,j)=>v*B[i][j]));
const mul = (A,B) => A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
const T = A => A[0].map((_,j)=>A.map(r=>r[j]));
const tweak = M => { const C=M.map(r=>r.slice()); C[R(0,C.length-1)][R(0,C[0].length-1)] += pick([-3,-2,-1,1,2,3]); return C; };
const mat = M => `<span class="mat" style="grid-template-columns:repeat(${M[0].length},auto)">${M.flat().map(v=>`<span>${fm(v)}</span>`).join('')}</span>`;
const named = (n,M) => `<span><span class="mname">${n} =</span>${mat(M)}</span>`;
const vecTxt = v => `(${fm(v[0])}, ${fm(v[1])})`;
const det2 = M => M[0][0]*M[1][1]-M[0][1]*M[1][0];
const K = v => JSON.stringify(v);

/* ===================== plano cartesiano (SVG) ===================== */
let svgN = 0;
function Plane(Rg, size=320){
  const s=size/(2*Rg), X=x=>(x+Rg)*s, Y=y=>(Rg-y)*s, id='c'+(++svgN);
  const parts=[];
  // grade
  for(let k=-Rg;k<=Rg;k++){
    parts.push(`<line x1="${X(k)}" y1="0" x2="${X(k)}" y2="${size}" stroke="#ece7dc" stroke-width="1"/>`);
    parts.push(`<line x1="0" y1="${Y(k)}" x2="${size}" y2="${Y(k)}" stroke="#ece7dc" stroke-width="1"/>`);
  }
  parts.push(`<line x1="0" y1="${Y(0)}" x2="${size}" y2="${Y(0)}" stroke="#1d2440" stroke-width="1.6"/>`);
  parts.push(`<line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${size}" stroke="#1d2440" stroke-width="1.6"/>`);
  const step = Rg>7?2:1;
  for(let k=-Rg+1;k<Rg;k++){ if(k===0||k%step) continue;
    parts.push(`<text x="${X(k)}" y="${Y(0)+14}" font-size="10" text-anchor="middle" fill="#7a8098" font-family="Nunito">${fm(k)}</text>`);
    parts.push(`<text x="${X(0)-5}" y="${Y(k)+3.5}" font-size="10" text-anchor="end" fill="#7a8098" font-family="Nunito">${fm(k)}</text>`);
  }
  parts.push(`<text x="${size-8}" y="${Y(0)-6}" font-size="12" font-weight="700" fill="#1d2440" font-family="Nunito">x</text>`);
  parts.push(`<text x="${X(0)+6}" y="12" font-size="12" font-weight="700" fill="#1d2440" font-family="Nunito">y</text>`);
  const api = {
    line(a,b,c,color,dash){
      let x1,y1,x2,y2;
      if(b!==0){ x1=-Rg-1; x2=Rg+1; y1=(c-a*x1)/b; y2=(c-a*x2)/b; }
      else { x1=x2=c/a; y1=-Rg-1; y2=Rg+1; }
      parts.push(`<line clip-path="url(#${id})" x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${color}" stroke-width="${dash?5:3}" ${dash?'stroke-dasharray="10 8" opacity=".85"':''} stroke-linecap="round"/>`);
      return api;
    },
    vec(x,y,color,label,ox=0,oy=0){
      const x0=X(ox),y0=Y(oy),x1=X(ox+x),y1=Y(oy+y);
      const dx=x1-x0, dy=y1-y0, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, h=11, w=6;
      const bx=x1-ux*h, by=y1-uy*h;
      parts.push(`<line x1="${x0}" y1="${y0}" x2="${bx}" y2="${by}" stroke="${color}" stroke-width="3.2" stroke-linecap="round"/>`);
      parts.push(`<polygon points="${x1},${y1} ${bx-uy*w},${by+ux*w} ${bx+uy*w},${by-ux*w}" fill="${color}"/>`);
      if(label) parts.push(`<text x="${x1+ux*8+(uy>0?8:-8)*0}" y="${y1-8}" font-size="15" font-weight="800" fill="${color}" font-family="Fredoka" text-anchor="middle">${label}</text>`);
      return api;
    },
    poly(pts,fill,stroke,dash,op=1){
      parts.push(`<polygon points="${pts.map(([x,y])=>X(x)+','+Y(y)).join(' ')}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="2.5" ${dash?'stroke-dasharray="6 5"':''} stroke-linejoin="round"/>`);
      return api;
    },
    dot(x,y,color){ parts.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="${color}" stroke="#fff" stroke-width="2"/>`); return api; },
    svg(){ return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><rect width="${size}" height="${size}"/></clipPath></defs>${parts.join('')}</svg>`; }
  };
  return api;
}
function fmtEq(a,b,c){
  const term=(k,v,first)=>{ if(k===0) return ''; const abs=Math.abs(k), coef=abs===1?'':abs;
    if(first) return (k<0?'−':'')+coef+v; return (k<0?' − ':' + ')+coef+v; };
  let s=term(a,'x',true); s+= s? term(b,'y',false) : term(b,'y',true);
  return s+' = '+fm(c);
}

/* ===================== configuração ===================== */
const DIFF = {
  facil:  {lvl:0, lo:0,  hi:5, time:30, name:'Fácil',   icon:'🟢', mult:1},
  medio:  {lvl:1, lo:-4, hi:7, time:45, name:'Médio',   icon:'🟡', mult:1.2},
  dificil:{lvl:2, lo:-9, hi:9, time:60, name:'Difícil', icon:'🔴', mult:1.5}
};
const LEVELS=['facil','medio','dificil'];
const PCOLORS=['#2f6df6','#ff6b4a'];
let C = DIFF.facil;
const rn = () => R(C.lo,C.hi);

/* ===================== geradores: MATRIZES ===================== */
function gSoma(){
  const op = C.lvl>0 && Math.random()<.5 ? '−' : '+';
  const A=rm(2,2,C.lo,C.hi), B=rm(2,2,C.lo,C.hi), Rr = op==='+'?add(A,B):sub(A,B);
  return { q:`Quanto vale <b>A ${op} B</b>?`, vis:named('A',A)+named('B',B),
    correct:Rr, distractors:[op==='+'?sub(A,B):add(A,B), had(A,B), tweak(Rr)], fallback:()=>tweak(Rr), render:mat, key:K,
    hint:`${op==='+'?'Some':'Subtraia'} os números que estão na <b>mesma posição</b> nas duas matrizes.`,
    exp:`Fazemos a conta posição por posição: na 1ª linha e 1ª coluna, ${p(A[0][0])} ${op} ${p(B[0][0])} = ${fm(Rr[0][0])}; e assim por diante.<br>Resultado: ${mat(Rr)}` };
}
function gEscalar(){
  const k=pick(C.lvl?[2,3,-2,4,-3]:[2,3,4]), A=rm(2,2,C.lvl?C.lo:0,C.lvl?6:5), Rr=A.map(r=>r.map(v=>v*k));
  const partial=A.map(r=>r.slice()); partial[0][0]*=k; partial[1][1]*=k;
  return { q:`Quanto vale <b>${fm(k)} · A</b>?`, vis:named('A',A),
    correct:Rr, distractors:[A.map(r=>r.map(v=>v+k)), partial, tweak(Rr)], fallback:()=>tweak(Rr), render:mat, key:K,
    hint:`Multiplicar uma matriz por um número = multiplicar <b>cada</b> elemento por esse número.`,
    exp:`Cada elemento é multiplicado por ${fm(k)}. Ex.: ${fm(k)} · ${p(A[0][0])} = ${fm(Rr[0][0])}.<br>Resultado: ${mat(Rr)}` };
}
function gElem(){
  const vals=shuffle(Array.from({length:19},(_,i)=>i-(C.lvl?5:0))).slice(0,9);
  const A=[vals.slice(0,3),vals.slice(3,6),vals.slice(6,9)];
  let i=R(0,2), j=R(0,2); if(i===j) j=(j+1)%3;
  return { q:`Qual é o elemento <b>a${subs(i+1)}${subs(j+1)}</b> da matriz A?`, vis:named('A',A),
    correct:A[i][j], distractors:[A[j][i], A[(i+1)%3][j], A[i][(j+1)%3], A[(i+2)%3][(j+2)%3]], fallback:()=>pick(vals), render:fm, key:String,
    hint:`No índice a<sub>ij</sub>, o primeiro número é a <b>linha</b> e o segundo é a <b>coluna</b>.`,
    exp:`a${subs(i+1)}${subs(j+1)} fica na <b>linha ${i+1}</b> e na <b>coluna ${j+1}</b>, então vale <b>${fm(A[i][j])}</b>. (Cuidado: a${subs(j+1)}${subs(i+1)} = ${fm(A[j][i])} é outro elemento.)` };
}
function gOrdem(){
  let m=R(1,4), n=R(1,4); while(m===n) n=R(1,4);
  const A=rm(m,n,0,9);
  return { q:`Qual é a <b>ordem</b> (tamanho) desta matriz?`, vis:named('A',A),
    correct:`${m} × ${n}`, distractors:[`${n} × ${m}`, `${m*n} × 1`, `${Math.max(m,n)} × ${Math.max(m,n)}`, `${m+n} × ${n}`], fallback:()=>`${R(1,5)} × ${R(1,5)}`, render:s=>s, key:String,
    hint:`A ordem é sempre <b>linhas × colunas</b>, nessa ordem.`,
    exp:`A matriz tem <b>${m} linha${m>1?'s':''}</b> (deitadas) e <b>${n} coluna${n>1?'s':''}</b> (em pé). Ordem = linhas × colunas = <b>${m} × ${n}</b>.` };
}
function gTransp(){
  const A=rm(2,3,C.lo,C.hi), At=T(A);
  const swapped=At.map(r=>r.slice().reverse());
  return { q:`Qual é a <b>transposta</b> Aᵀ?`, vis:named('A',A),
    correct:At, distractors:[A.map(r=>r.slice().reverse()), swapped, tweak(At), At.slice().reverse()], fallback:()=>tweak(At), render:mat, key:K,
    hint:`Na transposta, a <b>1ª linha vira a 1ª coluna</b>, a 2ª linha vira a 2ª coluna…`,
    exp:`As linhas viram colunas: a linha (${A[0].map(fm).join(', ')}) vira a 1ª coluna e (${A[1].map(fm).join(', ')}) vira a 2ª coluna. Uma matriz 2×3 vira 3×2:<br>${mat(At)}` };
}
function gMult(){
  const lo=Math.max(C.lo,-3), hi=Math.min(C.hi,5);
  const A=rm(2,2,lo,hi), B=rm(2,2,lo,hi), P=mul(A,B);
  const cell=(i,j)=>`c${subs(i+1)}${subs(j+1)} = ${p(A[i][0])}·${p(B[0][j])} + ${p(A[i][1])}·${p(B[1][j])} = <b>${fm(P[i][j])}</b>`;
  return { q:`Quanto vale o produto <b>A · B</b>?`, vis:named('A',A)+named('B',B),
    correct:P, distractors:[mul(B,A), had(A,B), tweak(P)], fallback:()=>tweak(P), render:mat, key:K,
    hint:`Cada elemento é <b>linha de A × coluna de B</b>: multiplique par a par e some.`,
    exp:`Linha de A vezes coluna de B:<br>${cell(0,0)}<br>${cell(0,1)}<br>${cell(1,0)}<br>${cell(1,1)}<br>Atenção: A·B normalmente é <b>diferente</b> de B·A!` };
}

/* ===================== DETERMINANTES ===================== */
function gDet2(){
  const A=rm(2,2,C.lo,C.hi), [[a,b],[c,d]]=A, D=a*d-b*c;
  return { q:`Qual é o <b>determinante</b> de A?`, vis:named('A',A),
    correct:D, distractors:[a*d+b*c, b*c-a*d, a*b-c*d, a*c-b*d], fallback:()=>D+nz(-4,4), render:fm, key:String,
    hint:`det = (diagonal principal) − (diagonal secundária) = a·d − b·c.`,
    exp:`det(A) = ${p(a)}·${p(d)} − ${p(b)}·${p(c)} = ${fm(a*d)} − ${p(b*c)} = <b>${fm(D)}</b>` };
}
function gDet3(){
  const lo=C.lvl>1?-3:-1, hi=C.lvl>1?4:3;
  const A=rm(3,3,lo,hi), a=A;
  const P1=a[0][0]*a[1][1]*a[2][2], P2=a[0][1]*a[1][2]*a[2][0], P3=a[0][2]*a[1][0]*a[2][1];
  const S1=a[0][2]*a[1][1]*a[2][0], S2=a[0][0]*a[1][2]*a[2][1], S3=a[0][1]*a[1][0]*a[2][2];
  const P=P1+P2+P3, S=S1+S2+S3, D=P-S;
  return { q:`Qual é o <b>determinante</b> da matriz 3×3? (Regra de Sarrus)`, vis:named('A',A),
    correct:D, distractors:[P+S, S-P, P, D+pick([-2,2,1,-1])], fallback:()=>D+nz(-5,5), render:fm, key:String,
    hint:`Sarrus: some os produtos das 3 diagonais "para a direita" e subtraia os das 3 diagonais "para a esquerda".`,
    exp:`Diagonais principais: ${fm(P1)} + ${p(P2)} + ${p(P3)} = ${fm(P)}<br>Diagonais secundárias: ${fm(S1)} + ${p(S2)} + ${p(S3)} = ${fm(S)}<br>det = ${fm(P)} − ${p(S)} = <b>${fm(D)}</b>` };
}
function gInversivel(){
  let A;
  if(Math.random()<.5){ const a=nz(-4,5), b=nz(-4,5), k=pick([2,-1,3,-2]); A=Math.random()<.5?[[a,b],[k*a,k*b]]:[[a,k*a],[b,k*b]]; }
  else { do{ A=rm(2,2,C.lo,C.hi);}while(det2(A)===0); }
  const D=det2(A), ok=D!==0;
  return { q:`A matriz A tem <b>inversa</b>?`, vis:named('A',A),
    choices:[{html:'✅ Sim, é inversível', correct:ok},{html:'🚫 Não, é singular', correct:!ok}],
    hint:`Calcule o determinante: se der <b>zero</b>, não existe inversa.`,
    exp:`det(A) = ${p(A[0][0])}·${p(A[1][1])} − ${p(A[0][1])}·${p(A[1][0])} = <b>${fm(D)}</b>. ${ok?'Como det ≠ 0, a matriz <b>tem inversa</b>.':'Como det = 0, a matriz é <b>singular</b> (sem inversa). Repare que uma linha (ou coluna) é múltipla da outra.'}` };
}
function gInversa(){
  const x=nz(-3,3), y=nz(-2,2);
  const A=[[1+x*y,x],[y,1]], Inv=[[1,-x],[-y,1+x*y]];
  return { q:`Qual é a <b>inversa</b> A⁻¹? (det(A) = 1)`, vis:named('A',A),
    correct:Inv, distractors:[[[1,x],[y,1+x*y]], T(A), [[1+x*y,-x],[-y,1]], A.map(r=>r.map(v=>-v))], fallback:()=>tweak(Inv), render:mat, key:K,
    hint:`Para 2×2: troque de lugar os elementos da diagonal principal, troque o sinal dos outros dois e divida pelo det.`,
    exp:`Para A = [a b; c d], temos A⁻¹ = (1/det)·[d −b; −c a]. Aqui det = ${fm(det2(A))}, então A⁻¹ = ${mat(Inv)}<br>Confira: A · A⁻¹ dá a identidade.` };
}
function gDetProp(){
  const D=nz(-6,8), k=pick([2,3,-2]), n=C.lvl>1?pick([2,3]):2, ans=Math.pow(k,n)*D;
  return { q:`Se A é uma matriz <b>${n}×${n}</b> com det(A) = ${fm(D)}, quanto vale <b>det(${fm(k)}·A)</b>?`, vis:'',
    correct:ans, distractors:[k*D, D+k, n*k*D, Math.pow(k,n)+D], fallback:()=>ans+nz(-9,9), render:fm, key:String,
    hint:`Multiplicar a matriz inteira por k multiplica <b>cada linha</b> por k.`,
    exp:`Cada uma das ${n} linhas foi multiplicada por ${fm(k)}, então o determinante é multiplicado por ${p(k)}${n===2?'²':'³'} = ${fm(Math.pow(k,n))}.<br>det(${fm(k)}A) = ${fm(Math.pow(k,n))} · ${p(D)} = <b>${fm(ans)}</b>` };
}

/* ===================== SISTEMAS ===================== */
function randLine(){ let a,b; do{ a=R(-3,3); b=R(-3,3);}while(a===0&&b===0); return [a,b]; }
function gSisGraf(){
  const x0=R(-4,4), y0=R(-4,4); let a1,b1,a2,b2;
  do{ [a1,b1]=randLine(); [a2,b2]=randLine(); }while(a1*b2-a2*b1===0);
  const c1=a1*x0+b1*y0, c2=a2*x0+b2*y0;
  const pl=Plane(6).line(a1,b1,c1,'#2f6df6').line(a2,b2,c2,'#ff6b4a');
  const sol=[x0,y0];
  return { q:`Olhe o gráfico. Qual é a <b>solução</b> do sistema?`, vis:pl.svg(),
    legend:`<b style="color:#2f6df6">${fmtEq(a1,b1,c1)}</b> &nbsp;&nbsp; <b style="color:#ff6b4a">${fmtEq(a2,b2,c2)}</b>`,
    correct:sol, distractors:[[y0,x0],[-x0,y0],[x0,-y0],[x0+1,y0]], fallback:()=>[x0+nz(-2,2),y0+nz(-2,2)], render:v=>'x = '+fm(v[0])+', y = '+fm(v[1]), key:K,
    hint:`A solução é o ponto onde as <b>duas retas se cruzam</b>.`,
    exp:`As retas se cruzam no ponto <b>${vecTxt(sol)}</b>. Conferindo:<br>${fmtEq(a1,b1,c1).split('=')[0]}→ ${p(a1)}·${p(x0)} + ${p(b1)}·${p(y0)} = ${fm(c1)} ✓<br>${fmtEq(a2,b2,c2).split('=')[0]}→ ${p(a2)}·${p(x0)} + ${p(b2)}·${p(y0)} = ${fm(c2)} ✓` };
}
function gSisClass(){
  const kind=pick(['SPD','SPI','SI']); const x0=R(-3,3), y0=R(-3,3);
  let [a1,b1]=randLine(); while(b1===0||a1===0) [a1,b1]=randLine();
  const c1=a1*x0+b1*y0; let a2,b2,c2; const k=pick([2,-1,-2]);
  if(kind==='SPD'){ do{ [a2,b2]=randLine(); }while(a1*b2-a2*b1===0); c2=a2*x0+b2*y0; }
  else if(kind==='SPI'){ a2=k*a1; b2=k*b1; c2=k*c1; }
  else { a2=k*a1; b2=k*b1; c2=k*c1 + k*pick([-4,-3,3,4]); }
  const pl=Plane(6).line(a1,b1,c1,'#2f6df6').line(a2,b2,c2,'#ff6b4a',kind==='SPI');
  const desc={SPD:'SPD: uma única solução', SPI:'SPI: infinitas soluções', SI:'SI: nenhuma solução'};
  return { q:`Como esse sistema é <b>classificado</b>?`, vis:pl.svg(),
    legend:`<b style="color:#2f6df6">${fmtEq(a1,b1,c1)}</b> &nbsp;&nbsp; <b style="color:#ff6b4a">${fmtEq(a2,b2,c2)}</b>`,
    choices:['SPD','SPI','SI'].map(t=>({html:desc[t], correct:t===kind})),
    hint:`Retas que se cruzam → 1 solução. Retas paralelas → nenhuma. A mesma reta → infinitas.`,
    exp: kind==='SPD' ? `As retas <b>se cruzam em um ponto</b> (${fm(x0)}, ${fm(y0)}), então o sistema é <b>possível e determinado</b>.`
       : kind==='SPI' ? `A 2ª equação é a 1ª multiplicada por ${fm(k)}: é <b>a mesma reta</b>. Todos os pontos dela são solução, então o sistema é <b>possível e indeterminado</b>.`
       : `Os coeficientes de x e y são proporcionais (×${fm(k)}), mas o resultado não: as retas são <b>paralelas</b> e nunca se encontram. O sistema é <b>impossível</b>.` };
}
function gLanche(){
  const names=[['Ana','Bruno'],['Léo','Carla'],['Pedro','Júlia'],['Maria','João'],['Rafa','Bia']];
  const items=pick([['lanche','lanches','refri','refris'],['pastel','pastéis','suco','sucos'],['açaí','açaís','água','águas'],['coxinha','coxinhas','café','cafés']]);
  const L=R(6,18), r=R(2,8); let a1,b1,a2,b2;
  do{ a1=R(1,3); b1=R(1,3); a2=R(1,3); b2=R(1,3);}while(a1*b2-a2*b1===0);
  const t1=a1*L+b1*r, t2=a2*L+b2*r, [n1,n2]=pick(names);
  const it=(q,s,pl)=>`${q} ${q>1?pl:s}`;
  return { q:`${n1} comprou ${it(a1,items[0],items[1])} e ${it(b1,items[2],items[3])} e pagou <b>R$ ${t1}</b>. ${n2} comprou ${it(a2,items[0],items[1])} e ${it(b2,items[2],items[3])} e pagou <b>R$ ${t2}</b>. Quanto custa <b>1 ${items[0]}</b>?`, vis:'',
    correct:L, distractors:[r, L+1, L-1, L+r], fallback:()=>L+nz(-4,4), render:v=>'R$ '+v, key:String,
    hint:`Chame o ${items[0]} de <b>x</b> e o ${items[2]} de <b>y</b> e monte duas equações.`,
    exp:`Montando o sistema: <span class="eq">${fmtEq(a1,b1,t1)}</span> e <span class="eq">${fmtEq(a2,b2,t2)}</span>.<br>Resolvendo (por substituição ou escalonamento): x = <b>${L}</b> e y = ${r}.<br>Conferindo: ${a1}·${L} + ${b1}·${r} = ${t1} ✓ e ${a2}·${L} + ${b2}·${r} = ${t2} ✓` };
}

/* ===================== VETORES ===================== */
function gVecCoord(){
  let x,y; do{ x=R(-5,5); y=R(-5,5);}while(x===0||y===0||Math.abs(x)===Math.abs(y));
  const pl=Plane(6).vec(x,y,'#2f6df6','v');
  return { q:`Quais são as <b>coordenadas</b> do vetor <b>v</b>?`, vis:pl.svg(),
    correct:[x,y], distractors:[[y,x],[-x,y],[x,-y],[-y,-x]], fallback:()=>[x+nz(-2,2),y], render:vecTxt, key:K,
    hint:`Comece na origem: quanto ele anda na horizontal (x)? E na vertical (y)?`,
    exp:`Saindo da origem, o vetor anda <b>${fm(x)}</b> na horizontal e <b>${fm(y)}</b> na vertical. Então v = <b>${vecTxt([x,y])}</b>.` };
}
function gVecSoma(){
  let u,v,s; do{ u=[R(-3,4),R(-3,4)]; v=[R(-3,4),R(-3,4)]; s=[u[0]+v[0],u[1]+v[1]]; }
  while((u[0]===0&&u[1]===0)||(v[0]===0&&v[1]===0)||Math.abs(s[0])>5||Math.abs(s[1])>5||K(u)===K(v));
  const pl=Plane(6).vec(u[0],u[1],'#2f6df6','u').vec(v[0],v[1],'#ff6b4a','v');
  return { q:`Quanto vale <b>u + v</b>?`, vis:pl.svg(), legend:`<b style="color:#2f6df6">u</b> e <b style="color:#ff6b4a">v</b> saem da origem`,
    correct:s, distractors:[[u[0]-v[0],u[1]-v[1]],[u[0]+v[1],u[1]+v[0]],[s[1],s[0]],[s[0]+1,s[1]]], fallback:()=>[s[0]+nz(-2,2),s[1]+nz(-2,2)], render:vecTxt, key:K,
    hint:`Leia as coordenadas de u e de v e some <b>x com x</b> e <b>y com y</b>.`,
    exp:`u = ${vecTxt(u)} e v = ${vecTxt(v)}.<br>u + v = (${fm(u[0])} + ${p(v[0])}, ${fm(u[1])} + ${p(v[1])}) = <b>${vecTxt(s)}</b>.<br>No desenho, é como colocar v na ponta de u (regra do paralelogramo).` };
}
function gNorma(){
  const t=pick(C.lvl?[[3,4,5],[6,8,10],[5,12,13],[8,6,10],[4,3,5],[12,5,13]]:[[3,4,5],[4,3,5],[6,8,10],[8,6,10]]);
  const x=t[0]*pick([1,-1]), y=t[1]*pick([1,-1]);
  return { q:`Qual é o <b>módulo</b> (tamanho) do vetor v = ${vecTxt([x,y])}?`, vis:'',
    correct:t[2], distractors:[t[0]+t[1], t[2]*t[2], Math.abs(x+y)||t[2]+2, t[2]+1], fallback:()=>t[2]+nz(-3,3), render:String, key:String,
    hint:`Use Pitágoras: |v| = √(x² + y²).`,
    exp:`|v| = √(${p(x)}² + ${p(y)}²) = √(${x*x} + ${y*y}) = √${t[2]*t[2]} = <b>${t[2]}</b>` };
}
function gDot(){
  const u=[R(-4,5),R(-4,5)], v=[R(-4,5),R(-4,5)], d=u[0]*v[0]+u[1]*v[1];
  return { q:`Quanto vale o <b>produto escalar</b> u · v?`, vis:`<span class="eq">u = ${vecTxt(u)}</span><span class="eq">v = ${vecTxt(v)}</span>`,
    correct:d, distractors:[u[0]*v[1]+u[1]*v[0], u[0]*v[0]-u[1]*v[1], u[0]+v[0]+u[1]+v[1], d+pick([-2,2])], fallback:()=>d+nz(-5,5), render:fm, key:String,
    hint:`Multiplique <b>x por x</b>, <b>y por y</b> e some os dois resultados.`,
    exp:`u · v = ${p(u[0])}·${p(v[0])} + ${p(u[1])}·${p(v[1])} = ${fm(u[0]*v[0])} + ${p(u[1]*v[1])} = <b>${fm(d)}</b>. (O resultado é um <b>número</b>, não um vetor.)` };
}
function gPerp(){
  let u; do{ u=[R(-3,3),R(-3,3)]; }while(u[0]===0||u[1]===0);
  let v; const perp=Math.random()<.5;
  if(perp){ const k=pick([1,-1]); v=[-u[1]*k,u[0]*k]; }
  else { do{ v=[R(-4,4),R(-4,4)]; }while((v[0]===0&&v[1]===0)||u[0]*v[0]+u[1]*v[1]===0); }
  const d=u[0]*v[0]+u[1]*v[1];
  const pl=Plane(5).vec(u[0],u[1],'#2f6df6','u').vec(v[0],v[1],'#ff6b4a','v');
  return { q:`Os vetores u = ${vecTxt(u)} e v = ${vecTxt(v)} são <b>perpendiculares</b> (formam 90°)?`, vis:pl.svg(),
    choices:[{html:'📐 Sim, são perpendiculares',correct:perp},{html:'↗ Não são',correct:!perp}],
    hint:`Dois vetores são perpendiculares quando o <b>produto escalar dá zero</b>.`,
    exp:`u · v = ${p(u[0])}·${p(v[0])} + ${p(u[1])}·${p(v[1])} = <b>${fm(d)}</b>. ${perp?'Deu zero, então eles <b>são perpendiculares</b>.':'Não deu zero, então eles <b>não são perpendiculares</b>.'}` };
}

/* ===================== TRANSFORMAÇÕES ===================== */
const TF=[
  {n:'Rotação de 90° (anti-horária)', M:[[0,-1],[1,0]], d:'(x, y) → (−y, x)'},
  {n:'Rotação de 90° (horária)',      M:[[0,1],[-1,0]], d:'(x, y) → (y, −x)'},
  {n:'Rotação de 180°',               M:[[-1,0],[0,-1]], d:'(x, y) → (−x, −y)'},
  {n:'Reflexão no eixo x',            M:[[1,0],[0,-1]], d:'(x, y) → (x, −y)'},
  {n:'Reflexão no eixo y',            M:[[-1,0],[0,1]], d:'(x, y) → (−x, y)'},
  {n:'Reflexão na reta y = x',        M:[[0,1],[1,0]],  d:'(x, y) → (y, x)'},
  {n:'Ampliação (escala 2)',          M:[[2,0],[0,2]],  d:'(x, y) → (2x, 2y)'},
  {n:'Esticar na horizontal (×2)',    M:[[2,0],[0,1]],  d:'(x, y) → (2x, y)'},
  {n:'Cisalhamento horizontal',       M:[[1,1],[0,1]],  d:'(x, y) → (x + y, y)'},
];
const SHAPE=[[0,0],[1,0],[1,2],[2,2],[2,3],[0,3]]; // um "L" invertido (bandeirinha) – não é simétrico
const apply=(M,[x,y])=>[M[0][0]*x+M[0][1]*y, M[1][0]*x+M[1][1]*y];
const tfPool=()=>C.lvl===0?TF.slice(0,6):TF;
function gTfQual(){
  const pool=tfPool(), t=pick(pool), others=shuffle(pool.filter(o=>o!==t)).slice(0,3);
  const pl=Plane(7).poly(SHAPE,'#9aa0b4','#7a8098',true,.15).poly(SHAPE.map(q=>apply(t.M,q)),'#ff6b4a','#c2412a',false,.55).dot(0,0,'#1d2440');
  return { q:`A figura tracejada foi transformada na figura laranja. <b>Qual matriz</b> fez isso?`, vis:pl.svg(),
    legend:`tracejada = original &nbsp;•&nbsp; <b style="color:#ff6b4a">laranja</b> = depois da matriz`,
    choices:shuffle([{html:mat(t.M),correct:true},...others.map(o=>({html:mat(o.M),correct:false}))]),
    hint:`Veja para onde vai o ponto (1, 0): ele vira a <b>1ª coluna</b> da matriz. O ponto (0, 1) vira a <b>2ª coluna</b>.`,
    exp:`É uma <b>${t.n}</b>: ${t.d}.<br>A matriz é ${mat(t.M)}. Dica de ouro: as colunas da matriz mostram para onde vão os vetores (1, 0) e (0, 1).` };
}
function gTfNome(){
  const pool=tfPool(), t=pick(pool), others=shuffle(pool.filter(o=>o!==t)).slice(0,3);
  return { q:`O que esta matriz faz com uma figura no plano?`, vis:named('M',t.M),
    choices:shuffle([{html:t.n,correct:true},...others.map(o=>({html:o.n,correct:false}))]),
    hint:`Teste com o ponto (1, 0): multiplique M por ele e veja para onde ele vai.`,
    exp:`M leva (x, y) em <b>${t.d.split('→')[1].trim()}</b>, ou seja, é uma <b>${t.n}</b>.<br>Ex.: (1, 0) vai para ${vecTxt(apply(t.M,[1,0]))} e (0, 1) vai para ${vecTxt(apply(t.M,[0,1]))}.` };
}
function gTfAplica(){
  const M=rm(2,2,Math.max(C.lo,-3),4), v=[R(-3,4),R(-3,4)], r=apply(M,v);
  return { q:`Para onde vai o ponto <b>P = ${vecTxt(v)}</b> depois de aplicar a matriz M?`, vis:named('M',M),
    correct:r, distractors:[apply(T(M),v),[r[1],r[0]],[M[0][0]*v[0],M[1][1]*v[1]],[r[0]+1,r[1]-1]], fallback:()=>[r[0]+nz(-3,3),r[1]], render:vecTxt, key:K,
    hint:`Faça M · P: cada linha de M multiplica o ponto (x, y).`,
    exp:`M · P:<br>x' = ${p(M[0][0])}·${p(v[0])} + ${p(M[0][1])}·${p(v[1])} = ${fm(r[0])}<br>y' = ${p(M[1][0])}·${p(v[0])} + ${p(M[1][1])}·${p(v[1])} = ${fm(r[1])}<br>O ponto vai para <b>${vecTxt(r)}</b>.` };
}

/* ===================== CONCEITOS (banco fixo) ===================== */
const BANK=[
  {q:'Uma matriz de ordem 3×2 tem…', o:['3 linhas e 2 colunas','2 linhas e 3 colunas','3 elementos','6 linhas'], e:'A ordem é sempre <b>linhas × colunas</b>. 3×2 = 3 linhas e 2 colunas (6 elementos).'},
  {q:'O que acontece quando multiplicamos uma matriz A pela matriz identidade I?', o:['O resultado é a própria A','O resultado é zero','O resultado é a transposta de A','Não é possível multiplicar'], e:'A identidade funciona como o número 1 da multiplicação: <b>A · I = I · A = A</b>.'},
  {q:'Se det(A) = 0, então a matriz A…', o:['Não tem inversa (é singular)','É a matriz identidade','Tem infinitas inversas','É sempre a matriz nula'], e:'A inversa usa 1/det(A). Se det = 0, essa divisão não existe, então <b>não há inversa</b>.'},
  {q:'Na multiplicação de matrizes, A · B é sempre igual a B · A?', o:['Não, em geral A·B ≠ B·A','Sim, sempre','Só se forem 3×3','Sim, se forem quadradas'], e:'A multiplicação de matrizes <b>não é comutativa</b>. A ordem importa!'},
  {q:'Para multiplicar A (m×n) por B (p×q), é obrigatório que…', o:['n = p','m = q','m = p','n = q'], e:'O número de <b>colunas de A</b> tem que ser igual ao número de <b>linhas de B</b>. O resultado terá ordem m×q.'},
  {q:'Quanto vale det(Aᵀ) comparado com det(A)?', o:['É igual a det(A)','É −det(A)','É 1/det(A)','É sempre zero'], e:'Transpor não muda o determinante: <b>det(Aᵀ) = det(A)</b>.'},
  {q:'Uma matriz em que aᵢⱼ = aⱼᵢ para todos os elementos é chamada de…', o:['Simétrica','Diagonal','Nula','Triangular'], e:'Se cada elemento é igual ao seu "espelho" pela diagonal principal, a matriz é <b>simétrica</b> (A = Aᵀ).'},
  {q:'Qual é a transposta de um produto, (A·B)ᵀ?', o:['Bᵀ · Aᵀ','Aᵀ · Bᵀ','A · B','(B · A)'], e:'Na transposta do produto, a ordem <b>inverte</b>: (AB)ᵀ = BᵀAᵀ.'},
  {q:'Geometricamente, o determinante de uma matriz 2×2 representa…', o:['Quanto a área é ampliada ou reduzida','O ângulo de rotação','O comprimento de um vetor','O número de soluções'], e:'|det| é o <b>fator de mudança de área</b>. Se det = 2, as figuras dobram de área; se é negativo, a figura também é "espelhada".'},
  {q:'Um sistema linear 2×2 em que as retas são paralelas e distintas é…', o:['Impossível (SI)','Possível e determinado (SPD)','Possível e indeterminado (SPI)','Homogêneo'], e:'Retas paralelas nunca se encontram, então <b>não existe solução</b>: SI.'},
  {q:'Se o determinante da matriz dos coeficientes de um sistema é diferente de zero, o sistema é…', o:['Possível e determinado (uma solução)','Impossível','Possível e indeterminado','Sempre homogêneo'], e:'Pela Regra de Cramer, det ≠ 0 garante <b>solução única</b> (SPD).'},
  {q:'Dois vetores são perpendiculares quando…', o:['O produto escalar entre eles é zero','Eles têm o mesmo tamanho','A soma deles é zero','Eles são iguais'], e:'u · v = |u||v|cos θ. Se θ = 90°, cos θ = 0, então <b>u · v = 0</b>.'},
  {q:'Um autovetor de uma matriz A é um vetor que, ao ser multiplicado por A…', o:['Só muda de tamanho, não de direção','Sempre gira 90°','Vira o vetor nulo','Muda para uma direção aleatória'], e:'Autovetor: <b>A·v = λ·v</b>. Ele continua na mesma reta, só é esticado ou encolhido pelo autovalor λ.'},
  {q:'A matriz identidade 3×3 tem…', o:['1 na diagonal principal e 0 no resto','Todos os elementos iguais a 1','0 na diagonal e 1 no resto','Apenas zeros'], e:'Identidade = <b>1 na diagonal principal</b> e 0 em todas as outras posições.'},
  {q:'Uma matriz de rotação no plano (2×2) tem determinante igual a…', o:['1','0','−1','2'], e:'Rotação <b>não muda a área</b> nem espelha a figura, então det = 1.'},
  {q:'Qual operação NÃO muda as soluções de um sistema no escalonamento?', o:['Somar a uma linha um múltiplo de outra','Multiplicar uma linha por zero','Apagar uma equação qualquer','Somar 1 a todos os coeficientes'], e:'As operações elementares (trocar linhas, multiplicar por número ≠ 0, <b>somar múltiplo de outra linha</b>) mantêm as soluções.'},
  {q:'Em computação gráfica (jogos), as matrizes são usadas principalmente para…', o:['Girar, mover e redimensionar objetos','Guardar o som do jogo','Conectar na internet','Salvar o progresso'], e:'Toda rotação, escala e movimento de um personagem 3D é feito <b>multiplicando matrizes</b> pelos pontos do modelo.'},
  {q:'O vetor nulo (0, 0) somado a qualquer vetor v resulta em…', o:['O próprio v','O vetor nulo','−v','2v'], e:'O vetor nulo é o "zero" da soma de vetores: <b>v + 0 = v</b>.'},
];
let bankLeft=[];
function gConceito(){
  if(!bankLeft.length) bankLeft=shuffle(BANK.slice());
  const b=bankLeft.pop();
  return { q:b.q, vis:'', choices:shuffle(b.o.map((t,i)=>({html:t,correct:i===0}))),
    hint:'Elimine primeiro as alternativas que você tem certeza de que estão erradas.', exp:b.e };
}

/* ===================== temas ===================== */
const TOPICS={
  matrizes:      {name:'Matrizes',        icon:'▦', gens:[[gSoma,0],[gEscalar,0],[gElem,0],[gOrdem,0],[gTransp,0],[gMult,1]]},
  determinantes: {name:'Determinantes',   icon:'◇', gens:[[gDet2,0],[gInversivel,0],[gDet3,1],[gDetProp,1],[gInversa,2]]},
  sistemas:      {name:'Sistemas',        icon:'✕', gens:[[gSisGraf,0],[gSisClass,0],[gLanche,0]]},
  vetores:       {name:'Vetores',         icon:'➚', gens:[[gVecCoord,0],[gVecSoma,0],[gNorma,0],[gDot,1],[gPerp,1]]},
  transformacoes:{name:'Transformações',  icon:'⟲', gens:[[gTfQual,0],[gTfNome,0],[gTfAplica,1]]},
  conceitos:     {name:'Teoria',          icon:'💬', gens:[[gConceito,0]]},
};
$('topicChips').innerHTML=Object.entries(TOPICS).map(([k,t])=>`<label class="chip"><input type="checkbox" name="topic" value="${k}" checked>${t.icon} ${t.name}</label>`).join('');

/* ===================== som ===================== */
let actx=null;
function beep(ok){
  if(!S || !S.sound) return;
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(), g=actx.createGain(), t=actx.currentTime, f=ok?[660,990]:[260,180];
    o.type=ok?'triangle':'sawtooth'; o.frequency.setValueAtTime(f[0],t); o.frequency.setValueAtTime(f[1],t+.09);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(ok?.18:.08,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.28);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t+.3);
  }catch(e){}
}

/* ===================== estado do jogo ===================== */
let S=null;
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id)); window.scrollTo(0,0); }
const levelOf=(k,N)=>LEVELS[Math.min(2,Math.floor(k*3/N))];
const alive=pl=>S.study || pl.lives>0;
const timeTxt=()=>S.study?'sem tempo':C.time+' s por pergunta';

function readSettings(){
  const topics=[...document.querySelectorAll('input[name=topic]:checked')].map(i=>i.value);
  if(!topics.length){ $('menuErr').textContent='Escolha pelo menos um tema.'; return null; }
  const np=+document.querySelector('input[name=np]:checked').value;
  const n1=($('pname1').value.trim()||'Jogador 1').slice(0,20);
  let n2=($('pname2').value.trim()||'Jogador 2').slice(0,20);
  if(np===2 && n1===n2) n2+=' (2)';
  $('menuErr').textContent='';
  return { np, names:np===2?[n1,n2]:[n1], topics,
    perPlayer:+document.querySelector('input[name=qtd]:checked').value,
    study:$('study').checked, sound:$('sound').checked };
}

function startGame(again){
  let st;
  if(again && S) st=S.settings; else { st=readSettings(); if(!st) return; }
  S={ settings:st, ...st, step:0, quit:false, lastGen:null, lastLevel:null, waiting:false, answered:true,
      players:st.names.map((n,i)=>({name:n, color:PCOLORS[i], score:0, streak:0, best:0, lives:3, ok:0, hist:[], per:{}})) };
  // um tema por rodada; os dois jogadores recebem o mesmo tema e o mesmo nível
  let tq=[]; while(tq.length<st.perPlayer) tq=tq.concat(shuffle(st.topics.slice()));
  S.queue=[];
  for(let k=0;k<st.perPlayer;k++){ const level=levelOf(k,st.perPlayer);
    for(let p=0;p<st.np;p++) S.queue.push({p,k,level,topic:tq[k]}); }
  bankLeft=shuffle(BANK.slice());
  $('timerBox').style.display=S.study?'none':'block';
  $('hudTime').style.display=S.study?'none':'flex';
  show('game'); nextQ();
}

// sorteia o gerador: os do nível atual têm mais chance de sair
function genFor(topic){
  const list=TOPICS[topic].gens.filter(g=>g[1]<=C.lvl);
  const bag=[]; list.forEach(([g,l])=>{ const w = l===C.lvl?3:1; for(let i=0;i<w;i++) bag.push(g); });
  let g, tries=0; do{ g=pick(bag); }while(list.length>1 && g===S.lastGen && tries++<15);
  S.lastGen=g; return g();
}
function buildOptions(q){
  if(q.choices) return q.choices;
  const seen=new Set(), out=[];
  const put=(v,c)=>{ const k=q.key(v); if(seen.has(k)) return; seen.add(k); out.push({html:q.render(v),correct:c}); };
  put(q.correct,true);
  for(const d of q.distractors){ if(out.length>=4) break; put(d,false); }
  let guard=0; while(out.length<4 && guard++<60) put(q.fallback(),false);
  return shuffle(out);
}

function renderHUD(){
  const t=S.cur;
  $('hudQ').textContent=`Pergunta ${t.k+1}/${S.perPlayer}`;
  $('hudLevel').textContent=`${C.icon} ${C.name}`;
  $('hudPlayers').innerHTML=S.players.map((pl,i)=>{
    const on=i===t.p, out=!alive(pl);
    return `<div class="pcard ${on?'on':''} ${out?'out':''}" style="--pc:${pl.color}">
      <div class="pn">${S.np===2?(on?'▶ ':''):''}${esc(pl.name)}${out?' 💀':''}</div>
      <div class="ps"><span>⭐ ${pl.score}</span><span>🔥 ${pl.streak}</span>${S.study?'':`<span>${'❤️'.repeat(Math.max(0,pl.lives))}${'🤍'.repeat(3-Math.max(0,pl.lives))}</span>`}</div></div>`;
  }).join('');
  const pl=S.pl;
  $('prog').innerHTML=Array.from({length:S.perPlayer},(_,k)=>{
    const h=pl.hist[k]; return `<i class="${h?(h.ok?'ok':'no'):(k===t.k?'cur':'')}"></i>`; }).join('');
}

function nextQ(){
  while(S.step<S.queue.length && !alive(S.players[S.queue[S.step].p])) S.step++;
  if(S.step>=S.queue.length){ finish(); return; }
  const t=S.queue[S.step]; S.cur=t; S.pl=S.players[t.p];
  C=DIFF[t.level];
  const q=genFor(t.topic); q.topicKey=t.topic; S.q=q; S.opts=buildOptions(q);
  S.answered=false; S.hintUsed=false;
  $('qTopic').textContent=TOPICS[t.topic].icon+' '+TOPICS[t.topic].name;
  $('qText').innerHTML=q.q;
  $('qVis').innerHTML=q.vis||''; $('qVis').style.display=q.vis?'flex':'none';
  $('qLegend').innerHTML=q.legend||''; $('qLegend').style.display=q.legend?'block':'none';
  $('qOpts').innerHTML=S.opts.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${k+1}</span><span>${o.html}</span></button>`).join('');
  $('qOpts').querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.k));
  $('qHint').style.display='none'; $('qHint').innerHTML=q.hint||'';
  $('hintBtn').disabled=!q.hint; $('hintBtn').style.visibility='visible';
  $('fb').style.display='none'; $('tools').style.display='flex';
  $('timerBar').style.width='100%'; $('timerBar').style.background='var(--green)';
  $('hudTime').textContent=`⏱ ${C.time}s`;
  renderHUD();
  const levelUp = S.lastLevel!==null && S.lastLevel!==t.level;
  const first = S.lastLevel===null;
  S.lastLevel=t.level;
  if(S.np===2 || levelUp || first) showTurn(t, levelUp, first); else startTimer();
}

function showTurn(t, levelUp, first){
  const pl=S.pl;
  $('turnCard').style.setProperty('--pc', pl.color);
  $('turnLevel').textContent=`${C.icon} Nível ${C.name} • ${timeTxt()}`;
  if(S.np===2){
    $('turnTitle').textContent=`Vez de ${pl.name}!`;
    const other=S.players[1-t.p];
    let sub = levelUp ? `⬆ <b>Subiu de nível!</b> As perguntas ficaram mais difíceis, então agora vocês têm <b>${C.time} segundos</b> para responder.<br>` : '';
    sub += `Pergunta ${t.k+1} de ${S.perPlayer}. ${!alive(other)?`${esc(other.name)} já está fora, continue sozinho!`:'Passe o aparelho para quem vai jogar.'}`;
    $('turnSub').innerHTML=sub;
  } else {
    $('turnTitle').textContent = first ? `Bora, ${pl.name}!` : `Nível ${C.name}!`;
    $('turnSub').innerHTML = first
      ? `As perguntas começam fáceis e vão ficando difíceis. Nesse nível você tem <b>${S.study?'tempo livre':C.time+' segundos'}</b> por pergunta.`
      : `⬆ <b>Subiu de nível!</b> As perguntas ficaram mais difíceis, então agora você tem <b>${S.study?'tempo livre':C.time+' segundos'}</b> para responder.`;
  }
  S.waiting=true; $('turnOv').classList.add('on');
  setTimeout(()=>$('turnGo').focus(),50);
}
function closeTurn(){ if(!S||!S.waiting) return; S.waiting=false; $('turnOv').classList.remove('on'); startTimer(); }

function startTimer(){
  clearInterval(S.tid);
  if(S.study) return;
  S.t0=performance.now();
  const bar=$('timerBar');
  const tick=()=>{
    const left=Math.max(0,1-(performance.now()-S.t0)/(C.time*1000));
    bar.style.width=(left*100)+'%';
    bar.style.background=left>.5?'var(--green)':left>.2?'var(--gold)':'var(--red)';
    $('hudTime').textContent=`⏱ ${Math.ceil(left*C.time)}s`;
    if(left<=0){ clearInterval(S.tid); answer(-1); }
  };
  tick(); S.tid=setInterval(tick,100);
}

function hasNext(){
  for(let s=S.step+1;s<S.queue.length;s++) if(alive(S.players[S.queue[s].p])) return S.queue[s];
  return null;
}

function answer(k){
  if(S.answered || S.waiting) return; S.answered=true; clearInterval(S.tid);
  const pl=S.pl, ok = k>=0 && S.opts[k].correct;
  const btns=[...$('qOpts').querySelectorAll('.opt')];
  btns.forEach((b,j)=>{ b.disabled=true; if(S.opts[j].correct) b.classList.add('right'); else if(j===k) b.classList.add('wrong'); else b.classList.add('dim'); });
  let pts=0;
  const per=pl.per[S.q.topicKey] || (pl.per[S.q.topicKey]={ok:0,n:0}); per.n++;
  if(ok){
    pl.streak++; pl.best=Math.max(pl.best,pl.streak); pl.ok++; per.ok++;
    const left = S.study?0:Math.max(0,1-(performance.now()-S.t0)/(C.time*1000));
    pts = Math.round((100 + 50*left) * (1 + 0.1*Math.min(pl.streak-1,5)) * C.mult);
    if(S.hintUsed) pts=Math.max(10,pts-30);
    pl.score+=pts; floatTxt('+'+pts, pl.color);
  } else {
    pl.streak=0; if(!S.study) pl.lives--;
  }
  beep(ok);
  const correctHtml=S.opts.find(o=>o.correct).html;
  pl.hist.push({ok, topic:S.q.topicKey, level:C.name, q:S.q.q, correct:correctHtml, exp:S.q.exp, vis:S.q.vis, legend:S.q.legend});
  const who = S.np===2 ? pl.name+': ' : '';
  $('fb').className='fb '+(ok?'ok':'no');
  $('fbTitle').textContent = ok ? (pl.streak>=3?`🔥 ${who}${pl.streak} seguidas! +${pts}`:`✅ ${who}Acertou! +${pts}`)
                                : (k<0?`⏰ ${who}Tempo esgotado!`:`❌ ${who}Não foi dessa vez`);
  let extra = (!alive(pl) && !S.study) ? `<div style="margin-bottom:8px;font-weight:800">💀 ${esc(pl.name)} ficou sem vidas!</div>` : '';
  $('fbExp').innerHTML=extra+(ok?'':`<div style="margin-bottom:6px">Resposta certa: <b>${correctHtml}</b></div>`)+S.q.exp;
  $('fb').style.display='block'; $('tools').style.display='none';
  const nx=hasNext();
  $('nextBtn').textContent = !nx ? '🏁 Ver resultado' : (S.np===2 && nx.p!==S.cur.p ? `Passar para ${S.players[nx.p].name} ➜` : 'Próxima ➜');
  renderHUD();
  $('fb').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function floatTxt(t,color){ const d=document.createElement('div'); d.className='float'; d.textContent=t; if(color) d.style.color=color; document.body.appendChild(d); setTimeout(()=>d.remove(),1000); }

/* ===================== ranking ===================== */
const RK='matriquiz-ranking-v2';
function loadRank(){ try{ return JSON.parse(localStorage.getItem(RK)||'[]'); }catch(e){ return []; } }
function saveRank(r){ try{ localStorage.setItem(RK,JSON.stringify(r)); }catch(e){} }
function rankHTML(list, meIds=[]){
  if(!list.length) return '<tr><td class="small">Ainda ninguém jogou. Seja o primeiro!</td></tr>';
  return list.map((r,i)=>`<tr class="${meIds.includes(r.id)?'me':''}"><td>${['🥇','🥈','🥉'][i]||(i+1)+'º'}</td><td>${esc(r.name)}</td><td class="small">${esc(r.mode)}</td><td style="text-align:right">${r.score}</td></tr>`).join('');
}

/* ===================== fim ===================== */
function finish(){
  clearInterval(S.tid); S.waiting=false; $('turnOv').classList.remove('on');
  const P=S.players;
  const statsOf=pl=>{ const n=pl.hist.length, acc=n?pl.ok/n:0; return {n,acc,stars:acc>=.9?3:acc>=.65?2:acc>=.35?1:0}; };
  let winner=-1;
  if(S.np===2){ if(P[0].score>P[1].score) winner=0; else if(P[1].score>P[0].score) winner=1; }
  $('resTag').textContent = `Fácil ➜ Difícil • ${S.np===2?'2 jogadores':'Solo'} • ${S.study?'Modo estudo':'Valendo pontos'}`;
  if(S.np===2){
    $('resTitle').textContent = winner<0 ? '🤝 Empate! Os dois mandaram bem.' : `🏆 ${P[winner].name} venceu!`;
  } else {
    const pl=P[0], s=statsOf(pl), died=!S.quit && !alive(pl) && s.n<S.perPlayer;
    $('resTitle').textContent = died ? `Acabaram as vidas, ${pl.name}!` :
      s.stars===3?`Mandou muito, ${pl.name}! 🏆`: s.stars===2?`Muito bem, ${pl.name}!`: s.stars===1?`Bom começo, ${pl.name}!`:`Bora treinar mais, ${pl.name}!`;
  }
  $('resPlayers').innerHTML=P.map((pl,i)=>{ const s=statsOf(pl);
    return `<div class="rp" style="--pc:${pl.color}">
      <div class="pn">${i===winner?'👑 ':''}${esc(pl.name)}${!alive(pl)?' 💀':''}</div>
      <div class="stars" style="color:var(--gold)">${'★'.repeat(s.stars)}${'☆'.repeat(3-s.stars)}</div>
      <div class="big">${pl.score}</div><div class="small">pontos</div>
      <div class="stats">${[
        ['Acertos',`${pl.ok}/${s.n}`],['Aproveitamento',Math.round(s.acc*100)+'%'],
        ['Maior sequência','🔥 '+pl.best],['Respondidas',`${s.n} de ${S.perPlayer}`]
      ].map(([a,b])=>`<div class="stat"><span class="small">${a}</span><b>${b}</b></div>`).join('')}</div></div>`;
  }).join('');
  $('resTopics').innerHTML=P.map(pl=>{
    const rows=Object.entries(pl.per).map(([k,v])=>{ const pc=Math.round(100*v.ok/v.n);
      return `<div class="trow"><span>${TOPICS[k].icon} ${TOPICS[k].name}</span><div class="bar"><div style="width:${pc}%;background:${pc>=70?'var(--green)':pc>=40?'var(--gold)':'var(--red)'}"></div></div><span style="text-align:right">${v.ok}/${v.n}</span></div>`;
    }).join('') || '<p class="small">Nenhuma pergunta respondida.</p>';
    return (S.np===2?`<div style="font-weight:800;color:${pl.color};margin-top:10px">${esc(pl.name)}</div>`:'')+rows;
  }).join('');
  // ranking
  let list=loadRank(); const meIds=[];
  if(!S.study) P.forEach(pl=>{ if(!pl.hist.length) return; const id=Date.now()+'-'+Math.random(); meIds.push(id);
    list.push({id,name:pl.name,score:pl.score,mode:`${S.np===2?'2 jog.':'Solo'} • ${S.perPlayer} perg.`}); });
  list.sort((a,b)=>b.score-a.score); list=list.slice(0,10); saveRank(list);
  $('resRank').innerHTML=rankHTML(list,meIds) + (S.study?'<tr><td colspan="4" class="small">No modo estudo a pontuação não entra no ranking.</td></tr>':'');
  // revisão
  const wrong=[]; P.forEach(pl=>pl.hist.forEach(h=>{ if(!h.ok) wrong.push({...h,pl}); }));
  $('revTitle').textContent = wrong.length?`Revise o que errou (${wrong.length})`:'Ninguém errou nada! 🎉';
  $('resReview').innerHTML=wrong.map(h=>`<div class="rev"><span class="tag">${TOPICS[h.topic].icon} ${TOPICS[h.topic].name} • ${h.level}</span>${S.np===2?`<span class="ptag" style="--pc:${h.pl.color}">${esc(h.pl.name)}</span>`:''}<div class="q" style="margin:8px 0">${h.q}</div>${h.vis?`<div class="vis" style="justify-content:flex-start">${h.vis.replace(/width="\d+" height="\d+"/,'width="220" height="220"')}</div>`:''}${h.legend?`<div class="legend" style="text-align:left">${h.legend}</div>`:''}<div>✔ Resposta: <b>${h.correct}</b></div><div class="small" style="margin-top:6px;color:var(--ink);line-height:1.55">${h.exp}</div></div>`).join('');
  show('result');
}

/* ===================== eventos ===================== */
document.querySelectorAll('input[name=np]').forEach(r=>r.onchange=()=>{ $('p2box').style.display = r.value==='2'&&r.checked ? 'block':'none'; });
$('startBtn').onclick=()=>startGame(false);
$('againBtn').onclick=()=>startGame(true);
$('menuBtn').onclick=()=>show('menu');
$('nextBtn').onclick=()=>{ S.step++; nextQ(); };
$('turnGo').onclick=closeTurn;
$('hintBtn').onclick=()=>{ if(S.answered) return; S.hintUsed=true; $('qHint').style.display='block'; $('hintBtn').style.visibility='hidden'; };
$('quitBtn').onclick=()=>{ clearInterval(S.tid); S.quit=true; finish(); };
$('rankBtn').onclick=()=>{ $('rankTable').innerHTML=rankHTML(loadRank()); show('ranking'); };
$('rankBack').onclick=()=>show('menu');
['pname1','pname2'].forEach(id=>$(id).addEventListener('keydown',e=>{ if(e.key==='Enter') startGame(false); }));
document.addEventListener('keydown',e=>{
  if(!S || !$('game').classList.contains('on') || e.target.tagName==='INPUT') return;
  if(S.waiting){ if(e.key==='Enter'){ e.preventDefault(); closeTurn(); } return; }
  if(!S.answered && /^[1-4]$/.test(e.key)){ const k=+e.key-1; if(k<S.opts.length) answer(k); }
  else if(S.answered && e.key==='Enter'){ e.preventDefault(); $('nextBtn').click(); }
});