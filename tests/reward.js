// クリアの流れ：全10面で、ボスを倒すと宝が出て床に落ち、ボス部屋の入口から歩いて（跳んで）取りに行けて、
// 掲げて → クリアの画面になり、宝が記録されるか。10面は城の扉が開いて通れるか。だめなら終了コード1
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out = []; let bad = 0;
progress = { cleared: 0, best: {}, items: {} };
for (let n = 1; n <= 10; n++) {
  debug = true; invincible = true; startStage(n, checkpoints.length); debug = false;
  let f = 0; while (!gate.active && f < 600) { kb.right = true; loop(); f++; } kb.right = false; while (kiai > 0) loop();
  boss.hp = 0; boss.state = 'dead'; boss.deadT = 0; shots = [];
  let landedAt = -1, gotAt = -1, clearAt = -1, px = player.x;
  for (f = 0; f < 60 * 20 && state !== 'clear'; f++) {
    const r = reward, P = player;
    kb.left = kb.right = kb.jump = false;
    if (r && r.mode === 'ground') { if (landedAt < 0) landedAt = f;
      const d = r.x - (P.x + P.w / 2); kb.right = d > 6; kb.left = d < -6;
      if (P.ground && Math.abs(d) < 60 && r.y < P.y) { jumpPressed = true; } kb.jump = true; }
    loop();
    if (state === 'got' && gotAt < 0) gotAt = f;
    if (process.env.DEBUG && +process.env.DEBUG === n && f % 30 === 0) console.log(n, f, state, r ? r.mode + ' ' + Math.round(r.x - arena.L) + ',' + Math.round(r.y) : '-', 'P', Math.round(player.x - arena.L), Math.round(player.y + player.h), player.ground ? 'g' : '-', 'deadT', (boss.deadT || 0).toFixed(2));
    if (Math.abs(player.x - px) > 60) { landedAt = -999; } px = player.x;   // 瞬間移動（落下）したら失敗
  }
  clearAt = state === 'clear' ? f : -1;
  const ok = landedAt >= 0 && gotAt >= 0 && clearAt >= 0 && progress.items[n] === true;
  if (!ok) bad++;
  out.push('stage' + n + ' 宝が床に ' + (landedAt >= 0 ? (landedAt / 60).toFixed(1) + '秒' : 'NG') + ' 取った ' + (gotAt >= 0 ? (gotAt / 60).toFixed(1) + '秒' : 'NG') +
    ' クリアの画面 ' + (clearAt >= 0 ? (clearAt / 60).toFixed(1) + '秒' : 'NG') + ' 記録 ' + !!progress.items[n] + (ok ? '' : ' NG'));
}
// 10面：スタートから右へ歩くと、扉が開いて通れる
debug = false; invincible = true; startStage(10); let f2 = 0; const door = castleDoor;
while (f2 < 60 * 8 && player.x < door.x + 200) { kb.right = true; loop(); f2++; } kb.right = false;
const doorOk = door.gone && player.x >= door.x + 200; if (!doorOk) bad++;
out.push('10面の城の扉 ' + (doorOk ? '開いて通れた（' + (f2 / 60).toFixed(1) + '秒）' : 'NG'));
console.log(out.join('\\\\n'));
process.exitCode = bad ? 1 : 0;
\`)`);
