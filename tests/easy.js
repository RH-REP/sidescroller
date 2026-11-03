// EASY モード：HP とハートの回復が10倍か、ボス部屋の気合い、最少回数を更新しないか、切り替えが再読み込みのあとも残るか
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const STEP = process.argv[2];
if (!STEP) {
  const store = path.join(os.tmpdir(), `sidescroller_easy_${process.pid}.json`);
  fs.writeFileSync(store, '{}');
  const run = s => execFileSync(process.execPath, [__filename, s], { env: { ...process.env, STORE: store }, encoding: 'utf8' }).trim();
  console.log(['normal', 'toggle', 'reload', 'toggle'].map(run).join('\n'));
  fs.unlinkSync(store);
  return;
}
const store = process.env.STORE, data = JSON.parse(fs.readFileSync(store, 'utf8'));
global.localStorage = { getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); fs.writeFileSync(store, JSON.stringify(data)); } };
const src = fs.readFileSync(path.join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
function clearBoss() { boss.state = 'dead'; boss.deadT = 0; for (let i = 0; i < 900 && state !== 'clear'; i++) { if (reward && (reward.mode === 'fall' || reward.mode === 'ground')) { player.x = reward.x - 14; player.y = reward.y - 20; player.vy = 0; } loop(); } }   // 倒して宝を取るまで
function measure(label) {
  const r = [label + ' easy=' + !!progress.easy];
  for (const n of [1, 10]) {
    startStage(n); const hp0 = player.maxHp;
    player.hp = 1; const h = hearts[0]; player.x = h.x - player.w / 2; player.y = h.y - player.h / 2; player.inv = 0; loop(); const healed = player.hp - 1;
    startStage(n, 0); debugStartX = arena.L - 250; respawn();
    let f = 0; while (!gate.active && f < 600) { kb.right = true; loop(); f++; } kb.right = false; while (kiai > 0) loop();
    r.push('stage' + n + ' HP ' + hp0 + ' heart+' + healed + ' boss ' + player.maxHp);
  }
  progress.best[1] = 5; startStage(1); attempts = 2; clearBoss();
  r.push('clear(attempts=2, best was 5) -> best ' + progress.best[1]);
  return r.join(' | ');
}
if (STEP === 'normal' || STEP === 'reload') console.log(measure(STEP));
else { goSelect(); const b = screenButtons().find(b => b.id === 'easy'); handleScreenTap({ clientX: b.x + 5, clientY: b.y + 5 }); console.log(measure('tap EASY button -> ' + screenButtons().find(b => b.id === 'easy').label)); }
\`)`);
