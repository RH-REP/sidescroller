#!/bin/zsh -f
# sidescroller をダブルクリックで開く。このフォルダは開発 repo の clone（直すときは開発側でコミットし、update.command で取り込む）。利用データは無い（進み具合はブラウザの localStorage）。
# 起動の前に最新を取り込む（update.command --auto。取り込めなくても今の版で続ける）。取り込んだ新しい start.command で開き直す
if [[ -z "${APP_START_UPDATED:-}" && -x "${0:A:h}/update.command" ]]; then
  "${0:A:h}/update.command" --auto
  [[ -x "${0:A}" ]] && APP_START_UPDATED=1 exec "${0:A}" "$@"
fi
set -u
USE_DIR="${0:A:h}"                              # この clone のフォルダ
if [[ ! -f "$USE_DIR/index.html" ]]; then echo "見つかりません: $USE_DIR/index.html（update.command で取り込んでください）"; read; exit 1; fi
open "$USE_DIR/index.html"
