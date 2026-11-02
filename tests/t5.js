const src=require('fs').readFileSync(require('path').join(__dirname,'gh.js'),'utf8').split('eval(')[0];
eval(src+`eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out=[];
for (const n of [2,5,6,7,8,9]){
  debug=true;invincible=false;loadStage(n);startStage(n,checkpoints.length);
  for(let f=0;f<120;f++){kb.right=true;loop();} kb.right=false;
  const def=BOSS[boss.type]; let hitsTaken=0,dzAfterHit=0,dz=0,wasDz=false,lastHurtF=-999;
  for(let f=0;f<60*60;f++){
    player.hp=player.maxHp; if(state!=='playing')break;
    const before=player.inv; loop();
    if(player.inv===INVINCIBLE&&before<INVINCIBLE){hitsTaken++;lastHurtF=f;}
    const d=boss.collide&&def.dizzy(boss); if(d&&!wasDz){dz++; if(f-lastHurtF<40)dzAfterHit++;} wasDz=d;
  }
  out.push(n+' '+boss.type+' 立ち止まって受けた攻撃='+hitsTaken+' 目回し='+dz+' うち攻撃を受けた直後の目回し='+dzAfterHit);
}
console.log(out.join(' | '));
\`)`);
