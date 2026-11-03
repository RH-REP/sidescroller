// 中間地点の前後に敵がいないか：全10面のすべての中間地点（スタート・ボス前を含む）で、
// 中間地点とその前後150pxに6秒ずつ立ち、ダメージ・250px以内の敵の弾・250px以内の敵が無いかを見る。1つでもあれば終了コード1
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const NEAR = 250, FRAMES = 360, out = [], bad = [];
for (let n = 1; n <= 10; n++) {
  loadStage(n);
  for (let i = 0; i < checkpoints.length; i++) for (const off of [-150, 0, 150]) {
    debug = true; invincible = false; startStage(n, i); debug = false;
    const P = player, x = checkpoints[i] + off;
    if (x < 20) continue;                 // スタートの前は世界の外
    Object.assign(P, { x, y: topAt(x + 14) - P.h, vx: 0, vy: 0, ground: null, safe: { x, y: topAt(x + 14) - P.h } });
    let dmg = 0, shotMin = 1e9, enemyMin = 1e9; const who = new Set();
    for (let f = 0; f < FRAMES; f++) {
      const h = P.hp; loop(); if (P.hp < h) dmg += h - P.hp;
      const cx = P.x + P.w / 2, cy = P.y + P.h / 2;
      for (const s of shots) { const d = Math.hypot(s.x + (s.w || 0) / 2 - cx, s.y + (s.h || 0) / 2 - cy); if (d < shotMin) shotMin = d; if (d < NEAR) who.add('弾:' + s.kind); }
      for (const e of enemies) if (e.alive) { const d = Math.hypot(e.x + e.w / 2 - cx, e.y + e.h / 2 - cy); if (d < enemyMin) enemyMin = d; if (d < NEAR) who.add('敵:' + e.type); }
    }
    const ok = dmg === 0 && shotMin >= NEAR && enemyMin >= NEAR;
    const line = 'stage' + n + ' ' + (i === 0 ? 'スタート' : i === checkpoints.length - 1 ? 'ボス前' : '中間' + i) + (off ? (off > 0 ? ' 後ろ+' : ' 前') + off : '') +
      ' ダメージ' + dmg + ' 弾' + (shotMin < 1e9 ? Math.round(shotMin) + 'px' : 'なし') + ' 敵' + (enemyMin < 1e9 ? Math.round(enemyMin) + 'px' : 'なし') + (who.size ? ' [' + [...who].join(',') + ']' : '');
    if (!ok) bad.push(line);
  }
  out.push('stage' + n + ' 中間地点 ' + checkpoints.length + ' か所');
}
console.log(out.join(' | '));
console.log(bad.length ? 'NG ' + bad.length + ' 件\\\\n' + bad.join('\\\\n') : 'OK すべての中間地点の前後で、ダメージ・弾・敵なし');
process.exitCode = bad.length ? 1 : 0;
\`)`);
