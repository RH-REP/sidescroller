// 落ちると戻される（back）：全部の面の back で、上の道から下の通路へ落ちても、ダメージなしで、
// 左の段まで歩いて戻って上の道へ上り直せるか。かかった時間（失敗の損失）も出す。上り直せなければ終了コード1
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const out = []; let bad = 0;
for (let n = 1; n <= 10; n++) for (const [id, , key, p = {}] of STAGE_UNITS[n - 1]) {
  if (key !== 'back') continue;
  debug = true; invincible = false; startStage(n); debug = false;
  const c = chunkLog.find(c => c.type === id);
  const cor = solids.find(s => s.backTo && s.x === c.x + 90), step = cor.backTo, ledge = solids.find(s => s.x === c.x + 150 && s.y === c.y - 100);
  const fallX = ledge.x + ledge.w + 20;                                  // 上の道の先（穴・動く床・崩れる床の所）から落ちる
  Object.assign(player, { x: fallX, y: c.y - 140, vx: 0, vy: 0, ground: null, safe: { x: ledge.x + 20, y: ledge.y - player.h } });
  for (const t of solids) if (t.kind === 'crumble' && t.x >= ledge.x + ledge.w && t.x < ledge.x + ledge.w + 400) { t.st = 2; t.t = 9999; t.gone = true; }   // 崩れたあと
  cameraX = fallX - 400; updateTerrain();
  const hp0 = player.hp; let landed = false, back = -1, teleport = false, px = player.x, phase = 0;
  for (let f = 0; f < 60 * 15 && back < 0; f++) {
    const P = player;
    if (P.ground === cor) landed = true;
    kb.left = kb.right = false; kb.jump = false;
    if (phase === 0) { kb.left = true; if (P.ground === cor && P.x < step.x + step.w + 24) { jumpPressed = true; kb.jump = true; phase = 1; } }   // 段の右で跳ぶ（左上へ）
    else if (phase === 1) { kb.left = P.x > step.x + 40; kb.jump = true; if (P.ground === step) phase = 2; }   // 段の上まで来たら左を離す
    else { kb.right = true; kb.jump = true; if (P.ground === step && P.x + P.w > step.x + step.w - 4) jumpPressed = true; if (P.ground === ledge) back = f; }   // 段から右上の道へ
    loop();
    if (process.env.TRACE && id === process.env.TRACE && f % 6 === 0) console.log(f, phase, Math.round(P.x - c.x), Math.round(P.y + P.h), P.ground ? (P.ground === cor ? 'cor' : P.ground === step ? 'step' : P.ground === ledge ? 'ledge' : Math.round(P.ground.x - c.x) + ',' + P.ground.y) : '-');
    if (Math.abs(P.x - px) > 60) teleport = true; px = P.x;
  }
  kb.left = kb.right = kb.jump = false;
  const ok = landed && back >= 0 && player.hp === hp0 && !teleport;
  if (!ok) bad++;
  out.push(id + '（' + (p.what || 'pit') + (p.ice ? '・氷' : '') + '） 下の通路に落ちた=' + landed + ' ダメージ ' + (hp0 - player.hp) + ' 上の道へ戻るまで ' + (back >= 0 ? (back / 60).toFixed(1) + '秒' : '戻れない') + (ok ? '' : ' NG'));
}
console.log(out.join('\\\\n'));
process.exitCode = bad ? 1 : 0;
\`)`);
