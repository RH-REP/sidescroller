const ctx=new Proxy({measureText:()=>({width:0})},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
const mk=()=>({getContext:()=>ctx,style:{},addEventListener(){},classList:{add(){},toggle(){},contains:()=>false},querySelectorAll:()=>[],dataset:{},getBoundingClientRect:()=>({left:0,top:0,width:800,height:400})});
const el=mk();global.window=global;global.NO_ART=true;global.innerWidth=800;global.innerHeight=400;
global.document={getElementById:()=>el,body:el,documentElement:el,elementFromPoint:()=>null,addEventListener(){},hidden:false};
global.navigator={maxTouchPoints:0};global.screen={};global.performance={now:()=>Date.now()};
global.addEventListener=()=>{};let loop;global.requestAnimationFrame=f=>{loop=f};
const MODE=process.argv[2], ONLY=+process.argv[3]||0;
eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+`
const out=[];
for(let n=1;n<=10;n++){ if(ONLY&&n!==ONLY)continue;
  loadStage(n);
  const info={stage:n,chunks:chunkLog.length,worldW:WORLD_W,arenaL:arena.L,arenaF:arena.F,cps:checkpoints.length,enemies:enemyDefs.length,hearts:heartDefs.length,worldTop};
  if(MODE==='info'){out.push(info);continue;}
  debug=true; invincible=true;
  startStage(n, MODE==='boss'?checkpoints.length:0);
  let back=0,f=0,maxX=0,hold=0,err=null,lastX=0,stuck=0; const LIM=MODE==='boss'?60*180:60*600;
  try{
  for(;f<LIM;f++){
    const P=player;
    if(MODE==='boss'){ const bx=boss.x+boss.w/2; kb.right=bx>P.x+20; kb.left=bx<P.x-20; if(f%23==0){jumpPressed=true;hold=f%3==0?30:8;} if(f%9==0)attackPressed=true; }
    else { const P=player;
      const groundAt=(x)=>{let y=1e9;for(const s of liveSolids)if(s!==gate&&!s.gone&&x>=s.x&&x<s.x+s.w&&s.y>=P.y+P.h-4&&s.y<y)y=s.y;for(const m of movers)if(x>=m.x&&x<m.x+m.w&&m.y>=P.y+P.h-4&&m.y<y)y=m.y;return y;};
      if(back>0){back--;kb.left=true;kb.right=false;} else {kb.right=true;kb.left=false;}
      const dir=kb.right?1:-1, ahead=dir>0?P.x+P.w+26:P.x-26;
      const wall=liveSolids.some(s=>s.kind!=='spring'&&!s.gone&&ahead>s.x&&ahead<s.x+s.w&&s.y<P.y+P.h-4&&s.y+s.h>P.y);
      if(P.ground&&(groundAt(ahead)>P.y+P.h+60||wall)){jumpPressed=true;hold=26;}
      if(Math.abs(P.x-lastX)<0.5){ if(++stuck>90){ back=50; stuck=0; } } else stuck=0; lastX=P.x;
      if(f%10==0)attackPressed=true; if(gate.active){ const bx=boss.x+boss.w/2; kb.right=bx>P.x+20; kb.left=bx<P.x-20; if(f%23==0){jumpPressed=true;hold=f%3==0?30:8;} } }
    if(reward&&(reward.mode==='fall'||reward.mode==='ground')){P.x=reward.x-14;P.y=reward.y-20;P.vy=0;}   // 倒したら宝を取る
    kb.jump=hold-->0;
    loop(); maxX=Math.max(maxX,player.x); if(state==='clear')break;
  }}catch(e){err=e.stack.split('\\n').slice(0,3).join(' | ');}
  const stuckAt=chunkLog.filter(c=>c.x<=maxX).pop();out.push({stuck:stuckAt&&!gate.active?stuckAt.type+"@"+Math.round(maxX-stuckAt.x)+"/y"+Math.round(stuckAt.y):"",stage:n,state,cleared:state==='clear',sec:(f/60).toFixed(0),reachedArena:gate.active||state==='clear',maxXpct:Math.round(100*maxX/arena.L),bossHp:boss.hp+'/'+boss.maxHp,err});
}
console.log(out.map(o=>JSON.stringify(o)).join('\\n'));`);
