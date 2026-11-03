// ボス前の中間地点：各面で、ボス部屋の手前に中間地点があるか、まわりに敵がいないか、そこから歩いてボス部屋に入れるか、ボスにやられたらそこへ戻るか
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out = [];
for (let n = 1; n <= 10; n++) {
  debug = true; invincible = false; loadStage(n);
  const last = checkpoints.length - 1, cx = checkpoints[last];
  startStage(n, last);
  const near = enemies.filter(e => Math.abs(e.x - cx) < 600).length;   // 中間地点の前後600px にいる敵
  let hit = 0; for (let f = 0; f < 300; f++) { const h = player.hp; loop(); if (player.hp < h) hit += h - player.hp; }   // 5秒立っていて、ダメージを受けないか（ハートの回復で隠れないよう1回ずつ数える）
  let f = 0; while (!gate.active && f < 600) { kb.right = true; loop(); f++; } kb.right = false;
  const entered = gate.active; while (kiai > 0) loop();
  die(); for (let i = 0; i < 90; i++) loop();
  out.push('stage' + n + ' 中間' + last + ' x=' + Math.round(cx) + '（ボス部屋の' + Math.round(arena.L - cx) + 'px手前） 敵' + near + ' 立って5秒の被ダメ' + hit +
    ' 歩いて入室=' + entered + '(' + (f / 60).toFixed(1) + 's) やられて戻った場所=' + (Math.abs(player.x - cx) < 1 ? 'ボス前' : Math.round(player.x)) + ' HP' + player.hp + '/' + player.maxHp);
}
console.log(out.join('\\\\n'));
\`)`);
