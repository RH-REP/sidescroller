# sidescroller

横スクロールのアクションゲーム（全10面）。HTML 1枚で、外部のライブラリを使わない。

- 遊ぶ: https://rh-rep.github.io/sidescroller/
- 最新は `index.html`。古い版と試作は `versions/` にそのまま置いてある（例: https://rh-rep.github.io/sidescroller/versions/game_v3.html ）。
- 仕様・コードの作り・分かっている問題・テストの走らせ方は [docs/HANDOFF.md](docs/HANDOFF.md)。

## 操作

- 移動 ←→ / A D、ジャンプ Space / Z / W / ↑（長押しで高く）、剣 X / J / K（ステージ5から）
- ポーズ P / Esc、または画面右上の ⏸
- スマホ: 横向きの全画面で、ゲーム画面に重ねたボタンで遊ぶ

## 手元で使う

- `start.command`: `index.html` をブラウザで開く。
- `update.command`: このフォルダ（clone）に最新を取り込む（`git pull --ff-only`）。
- データ: クリアした面と中間セーブ（1つ）はブラウザの localStorage（`sidescroll10_progress`）に残る。中間セーブは、その面をクリアするか「やり直し」で消える。ファイルには何も書かない。記録（`log/`）も作らない。

## テスト

Node で、描画を空にしてゲームを動かす（ブラウザ不要）。

```sh
cd tests
sh extract.sh            # index.html から g.js を取り出す
node ui.js               # デバッグモードの角のタップと、ステージ選択
node k.js                # ボス部屋での気合いと、やられたあとのHP
node save.js             # 中間セーブが再読み込みのあとも残るか
node robo.js             # ロボアーム戦の避けやすさと届きやすさ
node gh.js info          # 全10面の地形の概要
```

ほかのテストは [docs/HANDOFF.md](docs/HANDOFF.md) の6章。

## 公開

GitHub Pages で、main ブランチの直下をそのまま公開している（`.nojekyll`）。main に push すると、1〜2分で上の URL に出る。

## 改善のコメント（右上の !）

公開向けのゲームなので、画面に「!」は付けない（開発側の共通の決まりの例外）。改善の要望は GitHub の Issue に直接書く。Issue #1 はシステム用。
