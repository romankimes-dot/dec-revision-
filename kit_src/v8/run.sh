set -e
S=/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad
K=/home/user/dec-revision-/kit_src
export NODE_PATH=$(npm root -g)
python3 -I $S/py/build.py
node $K/render.cjs $K/V8_fiscal.html $S/v8_src.pdf
python3 -I $S/py/pages.py $S/v8_src.pdf $S/p.json
python3 -I $S/py/build.py $S/p.json
node $K/render.cjs $K/V8_fiscal.html $S/v8_src.pdf
python3 -I $S/py/pages.py $S/v8_src.pdf $S/p2.json
cmp <(python3 -c "import json;print(sorted(json.load(open('$S/p.json')).items()))") <(python3 -c "import json;print(sorted(json.load(open('$S/p2.json')).items()))") && echo STABLE
