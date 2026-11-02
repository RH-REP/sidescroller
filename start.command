#!/bin/zsh -f
# sidescroller をダブルクリックで開く。このフォルダは開発 repo の clone（直すときは開発側でコミットし、update.command で取り込む）。利用データは無い（進み具合はブラウザの localStorage）。
set -u
USE_DIR="${0:A:h}"                              # この clone のフォルダ
if [[ ! -f "$USE_DIR/index.html" ]]; then echo "見つかりません: $USE_DIR/index.html（update.command で取り込んでください）"; read; exit 1; fi
open "$USE_DIR/index.html"
