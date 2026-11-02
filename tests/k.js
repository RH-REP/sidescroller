const src=require('fs').readFileSync(require('path').join(__dirname,'gh.js'),'utf8').split('eval(')[0];
eval(src+`eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const r=[];
for (const n of [1,10]) { debug=true;invincible=false;loadStage(n);startStage(n,checkpoints.length);
  player.hp=1; let f=0; while(!gate.active&&f<600){kb.right=true;loop();f++;} kb.right=false;
  const bx=boss.x, st=boss.state; const hpStart=player.hp; let g=0; while(kiai>0&&g<200){loop();g++;}
  r.push('stage'+n+' 入室時HP '+hpStart+' → 気合い後 '+player.hp+'/'+player.maxHp+'（道中の最大 '+MAX_HP+'） 気合い '+g+'フレーム ボスは気合い中 '+(boss.x===bx?'止まっていた':'動いた')+' 気合い前の状態='+st+' 後='+boss.state);
  player.hp=0; die(); for(let i=0;i<70;i++)loop(); r.push('  やられて戻った後のHP '+player.hp+'/'+player.maxHp);
}
console.log(r.join(' ; '));
\`)`);
