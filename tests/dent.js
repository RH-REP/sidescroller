// 浅い穴（「落ちても戻れる」ユニット）：全部の面の dent と、dent 付きの動く床・崩れる床で、穴の底に落ちても
// ダメージなしで、小ジャンプ（3フレーム押し）で前の床へ出られるか。出られなければ終了コード1
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out = []; let bad = 0;
for (let n = 1; n <= 10; n++) for (const [id, , key, p = {}] of STAGE_UNITS[n - 1]) {
  if (key !== 'dent' && !p.dent) continue;
  debug = true; invincible = false; startStage(n); debug = false;
  const c = chunkLog.find(c => c.type === id), depth = key === 'dent' ? (p.d || DENT) : p.dent;
  const pit = solids.find(s => s.x >= c.x + 100 && s.x <= c.x + 130 && s.y === c.y + depth);
  for (const t of solids) if (t.kind === 'crumble' && t.x >= pit.x && t.x < pit.x + pit.w) { t.st = 2; t.t = 9999; t.gone = true; }   // 崩れたあと
  Object.assign(player, { x: pit.x + 6, y: pit.y - player.h, vx: 0, vy: 0, ground: null, safe: { x: pit.x + 6, y: pit.y - player.h } });
  cameraX = pit.x - 300; updateTerrain();
  for (let f = 0; f < 10; f++) loop();
  const hp0 = player.hp, inPit = player.y + player.h === pit.y; let outAt = -1;
  for (let f = 0; f < 300 && outAt < 0; f++) { kb.right = true; if (f % 40 === 0) jumpPressed = true; kb.jump = f % 40 < 3; loop(); if (player.ground && player.y + player.h <= c.y) outAt = f; }
  kb.right = kb.jump = false;
  const ok = inPit && outAt >= 0 && player.hp === hp0 && pit.y < 400;
  if (!ok) bad++;
  out.push(id + ' 深さ' + depth + 'px（底 y=' + pit.y + (pit.y < 400 ? '、画面に見える' : '、画面の外') + '） ' + (outAt >= 0 ? '小ジャンプで ' + (outAt / 60).toFixed(1) + '秒で出られた' : '出られない') + ' HP ' + hp0 + '→' + player.hp + (ok ? '' : ' NG'));
}
console.log(out.join('\\\\n'));
process.exitCode = bad ? 1 : 0;
\`)`);
