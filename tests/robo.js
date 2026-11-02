// 4面ロボアーム戦の測り方：低いレーザーを跳んで避けられる押し始めの幅、コアが開いている間にばねから踏めるか、本体の上に乗れるか
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const A = () => arena, r = {};
debug = true; invincible = false; loadStage(4); startStage(4, checkpoints.length);
for (let f = 0; f < 600 && !gate.active; f++) { kb.right = true; loop(); } kb.right = false;
while (kiai > 0) loop();
function reset(x) {                      // ボスを第1形態の止まった状態に戻し、プレイヤーを床の x に置く
  Object.assign(boss, { state: 'pause', timer: 1e9, hp: boss.maxHp, phase: 1, roar: 0, inv: 0, flash: 0 }); shots = [];
  Object.assign(player, { x, y: A().F - player.h, vx: 0, vy: 0, inv: 0, kb: 0, hp: player.maxHp });
  kb.left = kb.right = kb.jump = false; for (let i = 0; i < 5; i++) loop();
}
// 1) 低いレーザー：予告の始まりから j フレーム目にジャンプを押し、hold フレーム押し続けたとき当たらないか
for (const hold of [99, 6, 3]) {
  const ok = [];
  for (let j = 0; j < 100; j++) {
    reset(A().L + 120);
    boss.n = 0; boss.state = 'laser'; BOSS.robo.update(boss, A()); boss.state = 'pause'; boss.timer = 1e9;
    const hp0 = player.hp; let hk = 0;
    for (let f = 0; f < 130; f++) { if (f === j) { jumpPressed = true; hk = hold; } kb.jump = hk-- > 0; loop(); }
    if (player.hp === hp0) ok.push(j);
  }
  r['laser_low_hold' + hold] = ok.length ? ok[0] + '..' + ok[ok.length - 1] + ' (' + ok.length + 'f)' : 'none';
}
// 1b) 第2形態：低い・高いレーザーが続けて来る。低い方だけを1回跳んで両方を避けられる押し始めの幅（n=0 は低い方が先、n=2 は高い方が先）
for (const n of [0, 2]) for (const hold of [99, 6]) {
  const ok = [];
  for (let j = 0; j < 140; j++) {
    reset(A().L + 120); boss.phase = 2;
    boss.n = n; boss.state = 'laser'; BOSS.robo.update(boss, A()); boss.state = 'pause'; boss.timer = 1e9;
    const hp0 = player.hp; let hk = 0;
    for (let f = 0; f < 170; f++) { if (f === j) { jumpPressed = true; hk = hold; } kb.jump = hk-- > 0; loop(); }
    if (player.hp === hp0) ok.push(j);
  }
  r['phase2_' + (n ? 'highFirst' : 'lowFirst') + '_hold' + hold] = ok.length ? ok[0] + '..' + ok[ok.length - 1] + ' (' + ok.length + 'f)' : 'none';
}
// 2) コアが開いた瞬間に、ばねから run px 左にいて、右とジャンプ（長押し / 押さない）を押し続ける
const vent = Math.round(60 * 2.4);
for (const s of liveSolids.filter(s => s.kind === 'spring')) for (const jump of [true, false]) {
  const res = [];
  for (const run of [0, 40, 80, 160, 240]) {
    reset(s.x - run - player.w); boss.state = 'vent'; boss.timer = 1e9;
    let at = -1, onTop = false;
    for (let f = 0; f < vent && at < 0; f++) {
      kb.right = true; kb.jump = jump; loop();
      if (boss.hp < boss.maxHp) at = f;
      const g = player.ground; if (g && g.kind === 'robobody' && player.y + player.h <= g.y + 1) onTop = true;
    }
    res.push('run' + run + '=' + (at >= 0 ? (at / 60).toFixed(1) + 's' : 'miss') + (onTop ? '(on top!)' : ''));
  }
  r['spring@' + Math.round(s.x - A().L) + (jump ? '_hold' : '_nojump')] = res.join(' ');
}
r.core = 'x ' + Math.round(boss.x - A().L) + '..' + Math.round(boss.x + boss.w - A().L) + ', top ' + Math.round(A().F - boss.y) + 'px, vent ' + vent + 'f';
console.log(Object.entries(r).map(([k, v]) => k + ': ' + v).join('\\\\n'));
\`)`);
