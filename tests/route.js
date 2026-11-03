// 道筋の自動プレイ：各面の route（ユニットが記録した足場の順）を、本物の物理で辿ってボス部屋まで行けるか。
// 無敵で走る（敵の強さではなく、地形が越えられるかを見る）。落ちたら跳ぶ頃合いを変えてやり直す。
//   node route.js           本道
//   node route.js alt       寄り道・撃つ敵の段（alts）も全部通る
//   node route.js alt 4     4面だけ
// 越えられない足場があれば、そのユニットの番号を出して終了コード1
const src = require('fs').readFileSync(require('path').join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
const MODE = process.argv[2] || 'main', ONLY = +process.argv[3] || 0, DEBUG = !!process.env.DEBUG;
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
// 跳ぶ頃合いの組（落ちるたびに次へ）：reach=上の足場へ跳ぶ横の距離、edge=穴の手前で跳ぶ位置、hold=長押しのフレーム数
const VARIANTS = [];
for (const reach of [60, 100, 20, 130]) for (const edge of [6, 20, 34]) VARIANTS.push({ reach, edge, hold: 99 });
VARIANTS.push({ reach: 60, edge: 6, hold: 8 }, { reach: 100, edge: 20, hold: 8 });
const box = s => ({ x: s.x, y: s.y, w: s.w });
const gapH = (P, b) => Math.max(0, b.x - (P.x + P.w), P.x - (b.x + b.w));
function supportAt(x, feet) {                 // x の位置で、足もと付近（上6px〜下30px）に乗れる物があるか
  for (const s of liveSolids) if (s.kind !== 'break' && x >= s.x && x < s.x + s.w && s.y >= feet - 6 && s.y <= feet + 30) return true;
  for (const m of movers) if (x >= m.x && x < m.x + m.w && m.y >= feet - 6 && m.y <= feet + 30) return true;
  return false;
}
function edgeAhead(P, dir) {                 // 今の足場が続く先の端（つながった床・崩れる床をたどる）
  const feet = P.y + P.h; let x = dir > 0 ? P.x + P.w : P.x;
  for (let i = 0; i < 300 && supportAt(x + dir * 4, feet); i++) x += dir * 4;
  return x;
}
function landingBelow(x, feet) {              // 下りた先（150px 以内）に足場があるか
  for (const s of liveSolids) if (s.kind !== 'break' && x >= s.x && x < s.x + s.w && s.y > feet + 6 && s.y <= feet + 150) return true;
  return false;
}
function run(n, withAlts) {
  debug = true; invincible = true; loadStage(n); startStage(n); debug = false;
  const targets = route.slice();
  if (withAlts) for (const a of alts) { const i = targets.indexOf(a.from); targets.splice(i + 1, 0, ...a.path, ...(targets[i + 1] === a.to ? [] : [a.to])); }
  targets.push({ x: arena.L + 60, y: arena.F, w: 400 });                       // 最後はボス部屋の中
  const P = player, unitOf = s => unitAt(s.x + 1);
  let idx = 1, k = 0, holdLeft = 0, since = 0, falls = 0, retries = 0, worst = { n: 0 }, f = 0, px = P.x, py = P.y, swing = 0;
  const LIMIT = 60 * 60 * 8;
  for (; f < LIMIT && !gate.active && state === 'playing'; f++) {
    const tgt = targets[idx], V = VARIANTS[k % VARIANTS.length];
    if (!tgt) { kb.left = false; kb.right = true; kb.jump = false; loop(); continue; }   // 道筋の終わり：ボス部屋へ歩く
    const feet = P.y + P.h, pc = P.x + P.w / 2, b = box(tgt), dyUp = feet - b.y;
    const isOn = t => P.ground === t || (t.h == null && !t.period && Math.abs(feet - t.y) <= 3 && P.x + P.w > t.x && P.x < t.x + t.w);   // h が無いのは崩れる床3枚・ボス部屋の区切り
    const on = !!P.ground && isOn(tgt);
    const isSpring = tgt.kind === 'spring' || tgt.spring;
    if (on || (isSpring && P.springing)) { if (DEBUG) console.log('reach', idx, unitOf(tgt), JSON.stringify(box(tgt)), 'f=' + f, 'P=' + Math.round(P.x) + ',' + Math.round(feet)); idx++; since = 0; continue; }
    // 前の足場に戻ってしまった（跳び損ねて下の段へ落ちた）→ そこからやり直し、頃合いを変える
    if (P.ground && !isOn(targets[idx - 1])) for (let j = idx - 2; j >= Math.max(1, idx - 6); j--) {
      const t = targets[j]; if (t === tgt || t.kind === 'spring') continue;
      if (isOn(t)) { if (DEBUG) console.log('back to', j, unitOf(t), 'f=' + f); idx = j + 1; k++; retries++; break; }
    }
    // 行きたい x
    let aim;
    if (isSpring) aim = b.x + b.w / 2;
    else { const mg = Math.min(34, b.w / 2 - 1); aim = Math.max(b.x + mg, Math.min(b.x + b.w - mg, pc)); }
    const under = dyUp > 40 && P.x + P.w > b.x - 4 && P.x < b.x + b.w + 4;
    if (under && P.ground) aim = pc < b.x + b.w / 2 ? b.x - 34 : b.x + b.w + 34;      // 真下にいるなら外へ出てから跳ぶ
    let dir = Math.abs(aim - pc) > 2 ? Math.sign(aim - pc) : 0;
    const reach = gapH(P, b) <= V.reach, isMover = !!tgt.period;
    // 動く床：届かないうちは今の足場の端（動く床に乗っていれば真ん中）で待つ
    if (P.ground && !under && tgt.kind !== 'spring') {
      const g0 = P.ground, wd = Math.sign(b.x + b.w / 2 - pc) || 1, waitAt = g0.period ? (wd > 0 ? g0.x + g0.w - P.w / 2 - 6 : g0.x + P.w / 2 + 6) : edgeAhead(P, wd) - wd * (P.w / 2 + 8);
      const sameLevel = Math.abs(dyUp) <= 8 && gapH(P, b) < 30;
      const canJump = reach && dyUp <= 110 && dyUp >= -60;
      if ((isMover || g0.period) && !sameLevel && !canJump) { aim = waitAt; dir = Math.abs(aim - pc) > 4 ? Math.sign(aim - pc) : 0; }
    }
    if (P.ground && !on && dir === 0 && dyUp < -12) dir = 1;                         // 真下の足場へは前へ歩いて下りる（寄り道の帰り）
    kb.left = dir < 0; kb.right = dir > 0;
    // 跳ぶ
    let jump = false;
    if (P.ground && tgt.kind !== 'spring') {
      if (dyUp > 12) { const front = dir > 0 ? P.x + P.w : P.x;
        if (!under && dyUp <= 125 && (reach || (dir !== 0 && !supportAt(front + dir * 4, feet)))) jump = true; }
      else if (dir !== 0) {
        const front = dir > 0 ? P.x + P.w : P.x;
        if (!supportAt(front + dir * (V.edge + 2), feet)) {
          const down = dyUp < -12 && landingBelow(front + dir * 30, feet) && gapH(P, b) < 60;
          if (!down) jump = true;
        }
      }
      if (isMover && !(reach && dyUp <= 110 && dyUp >= -60) && !(Math.abs(dyUp) <= 8 && gapH(P, b) < 30)) jump = false;
    }
    if (jump) { jumpPressed = true; holdLeft = V.hold; }
    kb.jump = holdLeft-- > 0 || (P.springing && P.vy < 0) || (isSpring);
    // 剣：前に壊せる壁かトゲの敵がいれば振る
    if (SWORD && --swing <= 0) {
      const ahead = { x: dir >= 0 ? P.x + P.w : P.x - 70, y: P.y - 10, w: 70, h: P.h + 20 };
      if (liveSolids.some(s => s.kind === 'break' && hit(ahead, s)) || enemies.some(e => e.alive && hit(ahead, e))) { attackPressed = true; swing = 12; }
    }
    loop();
    if (DEBUG && f > LIMIT - 200 && f % 10 === 0) console.log('f', f, 'idx', idx, 'P', Math.round(P.x), Math.round(P.y + P.h), 'vy', P.vy.toFixed(1), 'kb', kb.left ? 'L' : kb.right ? 'R' : '-', kb.jump ? 'J' : '', 'ground', P.ground ? Math.round(P.ground.x) + ',' + Math.round(P.ground.y) : '-');
    // 落ちて戻された（瞬間移動）・進まない → 頃合いを変える
    const jumped = Math.abs(P.x - px) > 60 || Math.abs(P.y - py) > 200; px = P.x; py = P.y;
    if (jumped) { falls++; retries++; k++; holdLeft = 0; }
    if (++since > 60 * 20) { retries++; k++; since = 0; }
    if (retries > worst.n) worst = { n: retries, at: unitOf(tgt) };
    if (on) retries = 0;
    if (retries > VARIANTS.length * 3) return { n, ok: false, at: unitOf(tgt), idx, of: targets.length, f, falls };
    if (idx > 0 && targets[idx - 1] && since === 0) retries = 0;
  }
  if (DEBUG) console.log('end f=' + f + ' state=' + state + ' gate=' + gate.active + ' idx=' + idx + ' tgt=' + JSON.stringify(box(targets[idx] || {})) + ' P=' + Math.round(P.x) + ',' + Math.round(P.y + P.h) + ' ground=' + (P.ground ? Math.round(P.ground.x) + ',' + Math.round(P.ground.y) + (P.ground.period ? 'M' : '') : '-'));
  return { n, ok: gate.active, at: gate.active ? '' : unitOf(targets[Math.min(idx, targets.length - 1)]), idx, of: targets.length, f, falls, worst };
}
let bad = 0;
for (let n = 1; n <= 10; n++) {
  if (ONLY && n !== ONLY) continue;
  const r = run(n, MODE === 'alt');
  if (!r.ok) bad++;
  console.log('stage' + n + (MODE === 'alt' ? '（寄り道も）' : '') + ' ' + (r.ok ? 'ボス部屋まで ' + (r.f / 60).toFixed(0) + '秒' : 'NG ' + r.at + ' で止まった（足場 ' + r.idx + '/' + r.of + '）') +
    ' 落ちた回数 ' + r.falls + (r.worst && r.worst.n ? ' 一番やり直したのは ' + r.worst.at + '（' + r.worst.n + '回）' : ''));
}
process.exitCode = bad ? 1 : 0;
\`)`);
