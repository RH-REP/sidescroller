#!/bin/sh
# 使い方: sh extract.sh ../index.html   → tests/g.js にゲームのスクリプトを取り出す
cd "$(dirname "$0")"
python3 -c "import sys;s=open(sys.argv[1]).read();open('g.js','w').write(s.split('<script>')[1].split('</script>')[0])" "${1:-../index.html}"
node --check g.js && echo "g.js OK"
