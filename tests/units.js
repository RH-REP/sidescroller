// stages/stageNN.csv（ギミックとデザインの意図の正本）と、index.html の STAGE_UNITS（地形を作るコード）の並びが一致するか。
// 番号・種類・部品が1行ずつ合っていること、意図などの欄が空でないこと、最後が「ボス前」「ボス」であること。違えば終了コード1
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'gh.js'), 'utf8').split('eval(')[0];
eval(src + `eval(fs.readFileSync(path.join(__dirname,'g.js'),'utf8')+\`
function parseCsv(text) {                         // 引用符つきの欄にも対応する小さな CSV 読み
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^\\\\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\\\\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\\\\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const KIND = { start: 'スタート', unit: 'ユニット', cp: '中間' };
const errors = [], out = [];
for (let n = 1; n <= 10; n++) {
  const file = path.join(__dirname, '..', 'stages', 'stage' + String(n).padStart(2, '0') + '.csv');
  if (!fs.existsSync(file)) { errors.push('stage' + n + ': ' + file + ' が無い'); continue; }
  const [head, ...rows] = parseCsv(fs.readFileSync(file, 'utf8')).filter(r => r.length > 1);
  const col = name => head.indexOf(name);
  for (const name of ['ステージ', '番号', '種類', '部品', 'ギミック', '役割', '意図', '道', '向き']) if (col(name) < 0) errors.push('stage' + n + ': 列「' + name + '」が無い');
  const code = STAGE_UNITS[n - 1].map(([id, kind, key]) => [id, KIND[kind], key]).concat([['ボス前', 'ボス前', 'arena'], ['ボス', 'ボス', 'boss']]);
  if (rows.length !== code.length) errors.push('stage' + n + ': CSV ' + rows.length + ' 行、コード ' + code.length + ' 行');
  for (let i = 0; i < Math.max(rows.length, code.length); i++) {
    const r = rows[i] || [], c = code[i] || [];
    const got = [r[col('番号')], r[col('種類')], r[col('部品')]].join(' / '), want = c.join(' / ');
    if (got !== want) errors.push('stage' + n + ' ' + (i + 2) + '行目: CSV「' + got + '」 コード「' + want + '」');
    if (+r[col('ステージ')] !== n) errors.push('stage' + n + ' ' + (i + 2) + '行目: ステージの欄が ' + r[col('ステージ')]);
    for (const name of ['ギミック', '役割', '意図', '道', '向き']) if (r.length && !(r[col(name)] || '').trim()) errors.push('stage' + n + ' ' + (i + 2) + '行目: 「' + name + '」が空');
  }
  out.push('stage' + n + ' ' + rows.length + '行');
}
console.log(out.join(' | '));
console.log(errors.length ? 'NG ' + errors.length + ' 件\\\\n' + errors.join('\\\\n') : 'OK CSV とコードの並びが一致');
process.exitCode = errors.length ? 1 : 0;
\`)`);
