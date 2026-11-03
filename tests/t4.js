const src=require('fs').readFileSync(require('path').join(__dirname,'gh.js'),'utf8').split('eval(')[0];
const MODE=process.argv[2];
eval(src+`eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out=[];
for (let n=1;n<=10;n++){
  debug=true;invincible=true;loadStage(n);startStage(n,checkpoints.length);
  for(let f=0;f<120;f++){kb.right=true;loop();} kb.right=false;
  const def=BOSS[boss.type]; let hits=0,dz=0,wasDz=false,f=0,dmg2=0;
  for(;f<60*240 && (state==='playing'||state==='got');f++){
    if(reward&&(reward.mode==='fall'||reward.mode==='ground')){player.x=reward.x-14;player.y=reward.y-20;player.vy=0;}   // 倒したら宝を取る
    const B=boss, P=player, dzNow=B.collide&&def.dizzy(B);
    if(dzNow&&!wasDz)dz++; wasDz=dzNow;
    const ready=B.inv===0&&P.kb===0&&B.collide&&B.roar<=0&&B.state!=='dead';
    const allow = MODE==='any' ? true : dzNow;
    if(ready&&allow&&f%6===0){
      const st=def.hurtBy(B,'stomp')>0&&!(def.spikyNow&&def.spikyNow(B)), sw=SWORD&&def.hurtBy(B,'sword')>0;
      if(st){ P.x=B.x+B.w/2-14; P.y=B.y-50; P.vy=3; }
      else if(sw){ const behind=B.dir>0?-1:1; P.x=behind<0?B.x-34:B.x+B.w+6; P.face=behind<0?1:-1; P.y=Math.min(B.y+B.h-40,arena.F-40); P.vy=0; attackPressed=true; }
    }
    const hp=B.hp; B.connected=false; loop(); boss.connected=false; if(boss.hp<hp){hits++; if(hp-boss.hp===2)dmg2++;}
  }
  out.push(n+' '+boss.type+' clear='+(state==='clear')+' 時間='+(f/60).toFixed(0)+'秒 当てた回数='+hits+'(うち2ダメ'+dmg2+') 目回し/隙の回数='+dz);
}
console.log(out.join(' | '));
\`)`);
