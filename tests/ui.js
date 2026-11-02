const src=require('fs').readFileSync(require('path').join(__dirname,'gh.js'),'utf8').split('eval(')[0];
eval(src+`eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const tap=(x,y)=>handleScreenTap({clientX:x,clientY:y}); const r=[];
r.push('start:'+state);
tap(20,20);tap(780,20);tap(20,20);tap(780,20); r.push('4 taps debug='+debug+' state='+state);
tap(20,20); r.push('5th tap debug='+debug+' state='+state);
tap(400,300); r.push('tap center ->'+state);
r.push('unlocked(10)='+unlocked(10));
tap(70+4*136+10,110+120+10); r.push('tap stage10 ->'+state+' STAGE='+STAGE);
const bs=screenButtons(); r.push('section buttons='+bs.map(b=>b.label).join('/'));
const bb=bs.find(b=>b.label==='ボス'); tap(bb.x+5,bb.y+5); r.push('tap ボス ->'+state+' x-arenaL='+Math.round(player.x-arena.L));
debug=false; goSelect(); r.push('debug off unlocked(2)='+unlocked(2)+' unlocked(1)='+unlocked(1));
tap(20,20);tap(20,20);tap(780,20); r.push('same corner twice resets: debug='+debug);
console.log(r.join(' ; '));
\`)`);
