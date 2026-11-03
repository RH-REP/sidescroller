// 中間セーブが再読み込みのあとも残るか。localStorage をファイルに置き、別のプロセスで読み直す（= 再読み込み）
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const STEP = process.argv[2];
if (!STEP) {
  const store = path.join(os.tmpdir(), `sidescroller_save_${process.pid}.json`);
  fs.writeFileSync(store, '{}');
  const run = s => execFileSync(process.execPath, [__filename, s], { env: { ...process.env, STORE: store }, encoding: 'utf8' }).trim();
  const r = ['reach', 'reload', 'retry', 'reach', 'clear', 'reload'].map(s => run(s));
  fs.unlinkSync(store);
  console.log(r.join('\n'));
  return;
}
const store = process.env.STORE, data = JSON.parse(fs.readFileSync(store, 'utf8'));
global.localStorage = { getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); fs.writeFileSync(store, JSON.stringify(data)); } };
const src = fs.readFileSync(path.join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(require('fs').readFileSync(require('path').join(__dirname,'g.js'),'utf8')+\`
const saved = () => JSON.stringify(progress.resume || null);
function clearBoss() { boss.state = 'dead'; boss.deadT = 0; for (let i = 0; i < 900 && state !== 'clear'; i++) { if (reward && (reward.mode === 'fall' || reward.mode === 'ground')) { player.x = reward.x - 14; player.y = reward.y - 20; player.vy = 0; } loop(); } }   // 倒して宝を取るまで
if (STEP === 'reach') {            // 1面を始め、中間1の先へ瞬間移動して通らせる。そこで2回やられる
  invincible = true; chooseStage(1); player.x = checkpoints[1] + 5; loop();
  die(); die(); state = 'playing'; die();
  console.log('reach   cp=' + cp + ' saved=' + saved());
} else if (STEP === 'reload') {    // 読み直して1面を選ぶ
  chooseStage(1);
  console.log('reload  saved=' + saved() + ' -> 開始 cp=' + cp + ' 挑戦=' + attempts + ' x=' + Math.round(player.x) + '（中間1=' + checkpoints[1] + '）');
} else if (STEP === 'retry') {     // やり直しで保存が消えるか
  chooseStage(1); retryStage();
  console.log('retry   cp=' + cp + ' saved=' + saved());
} else if (STEP === 'clear') {     // クリアで保存が消えるか
  chooseStage(1); clearBoss();
  console.log('clear   state=' + state + ' cleared=' + progress.cleared + ' saved=' + saved());
}
\`)`);
