const src=require('fs').readFileSync(require('path').join(__dirname,'gh.js'),'utf8').split('eval(')[0];
eval(src+`eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
for(let n=1;n<=10;n++){loadStage(n);
 const segs=solids.filter(s=>s.kind!=='break'&&s.kind!=='robobody'&&s.h<9000&&s.y>-5000).map(s=>[s.x,s.x+s.w]).sort((a,b)=>a[0]-b[0]);
 const holes=[];let cov=segs[0][1];
 for(const [a,b] of segs){ if(a>cov+1) holes.push([cov,a]); cov=Math.max(cov,b);} 
 const bad=holes.filter(([a,b])=>{const w=b-a; if(w<=130) return false;
   const mv=movers.some(m=>m.bx+m.w+m.ax>=a-20&&m.bx-m.ax<=b+20); const sp=solids.some(s=>s.kind==='spring'&&s.x<a&&s.x>a-120); return !mv&&!sp;});
 const widest=holes.reduce((m,[a,b])=>Math.max(m,b-a),0);
 console.log('stage',n,'holes',holes.length,'widest',Math.round(widest),'unbridged>130:',bad.map(([a,b])=>Math.round(a)+'+'+Math.round(b-a)).join(' ')||'none');}
\`)`);
