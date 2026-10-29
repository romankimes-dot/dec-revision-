"""Repère la page de début de chaque article dans le PDF : pages.py pdf out.json"""
import sys, subprocess, json, re
sys.path.insert(0, '/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad/py')
from build import ARTS
pdf, out = sys.argv[1:3]
n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
txt = []
for i in range(1, n + 1):
    t = subprocess.run(['pdftotext', '-layout', '-f', str(i), '-l', str(i), pdf, '-'], capture_output=True, text=True).stdout
    txt.append(' '.join(t.split()))
res = {}; start = 1
for c, num, spec, title, asked in ARTS:
    lab = ('Article ' + num) if c == 'CGI' else ('Article ' + num.replace('L', 'L. ', 1))
    key = f'{c} {lab} {" ".join(title.split())[:18]}'
    for i in range(start, n):  # index 0 = garde
        if key in txt[i]:
            res[f"{c}-{num}".replace(' ', '_')] = i + 1; start = i; break
    else:
        print('introuvable', key)
json.dump(res, open(out, 'w'), indent=0)
print(n, 'pages', len(res), 'articles repérés')
