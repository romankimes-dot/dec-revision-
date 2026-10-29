#!/usr/bin/env python3
"""Génère data/notions.json (carte des notions, depuis docs/PLAN.md section 2) et data/stats.json
(récurrence des thèmes, depuis docs/data/sujets_codes*.jsonl). --check : échoue si les fichiers ne sont pas à jour."""
import json, re, sys, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def notions():
    txt = (ROOT / 'docs/PLAN.md').read_text(encoding='utf-8')
    sec = txt.split('## 2. Carte des notions', 1)[1].split('\n## 3.', 1)[0]
    rows = [l for l in sec.splitlines() if l.startswith('| ') and not l.startswith('| Thème') and not l.startswith('|---')]
    out = []
    for l in rows:
        cols = [c.strip() for c in l.strip().strip('|').split('|')]
        if len(cols) != 5:
            raise SystemExit(f'ligne de carte mal formée : {l[:80]}')
        theme, freq, niveau, dire, ou = cols
        star = theme.startswith('★')
        e1 = '(E1)' in theme
        name = theme.replace('★', '').replace('(E1)', '').strip()
        m = re.search(r'(\d+)', freq)
        sessions = int(m.group(1)) if m else 0
        verif = sorted({int(n) for g in re.findall(r'\[verif ([\d,\- ]+)\]', dire) for n in re.findall(r'\d+', g)})
        clean = re.sub(r'\s*\[verif [^\]]*\]', '', dire).replace('**', '')
        clean = clean.replace('exemption L. 233-17 2° : pas « grand groupe » (D. 230-2 : 30 / 60 / 250), pas 9/18/50',
                              'exemption de comptes consolidés sauf « grand groupe » (L. 233-17 2°, D. 230-2 : 30 M€ / 60 M€ / 250)')
        nv = niveau.replace('**', '')
        nov = 'A' if nv.startswith('A') else ('C' if nv.startswith('C') else 'B')
        after = nv.split('/', 1)[1].strip() if '/' in nv else ''
        mai = 'A' if nov == 'A' else (after[0] if after[:1] in ('A', 'B', 'C') else nov)
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower().split(' ')[0])[:40].strip('-')
        out.append({'id': f'{len(out)+1:02d}-{slug}', 'theme': name, 'star': star, 'e1': e1, 'sessions': sessions,
                    'freq': freq.replace('**', ''), 'niveau': nv, 'nov': nov, 'mai': mai, 'dire': clean,
                    'ou': ou.replace('**', ''), 'verif': verif})
    items = json.loads((ROOT / 'data/items.json').read_text(encoding='utf-8'))['items']
    stars = [n for n in out if n['star']]
    if len(stars) != len(items):
        raise SystemExit('15 étoiles attendues, alignées sur data/items.json')
    for n, it in zip(stars, items):
        n['item'] = it['id']
    return {'version': '2026-10-28', 'source': 'docs/PLAN.md section 2', 'notions': out}

def stats():
    rows = []
    for f in sorted((ROOT / 'docs/data').glob('sujets_codes*.jsonl')):
        rows += [json.loads(l) for l in f.read_text(encoding='utf-8').splitlines() if l.strip()]
    sess = sorted({r['session'] for r in rows})
    th_q, th_s, th_last = collections.Counter(), collections.defaultdict(set), {}
    dom_q, dom_s = collections.Counter(), collections.defaultdict(set)
    prof = collections.Counter()
    per = {s: collections.Counter() for s in sess}
    for r in rows:
        dom_q[r['domaine']] += 1; dom_s[r['domaine']].add(r['session']); prof[r.get('profession')] += 1
        per[r['session']][r['domaine']] += 1
        for t in r.get('themes', []):
            th_q[t] += 1; th_s[t].add(r['session']); th_last[t] = max(th_last.get(t, ''), r['session'])
    return {
        'version': '2026-10-28', 'source': 'docs/data/sujets_codes*.jsonl (codage question par question des sujets officiels SIEC)',
        'sessions': sess, 'n_sessions': len(sess), 'n_questions': len(rows),
        'profession': dict(prof),
        'domaines': [{'code': d, 'sessions': len(dom_s[d]), 'questions': n} for d, n in dom_q.most_common()],
        'themes': [{'code': t, 'sessions': len(th_s[t]), 'questions': n, 'derniere': th_last[t]}
                   for t, n in sorted(th_q.items(), key=lambda x: (-len(th_s[x[0]]), -x[1], x[0])) if t != 'autre'],
        'par_session': {s: dict(per[s]) for s in sess},
    }

def dump(obj):
    return json.dumps(obj, ensure_ascii=False, indent=1) + '\n'

targets = {ROOT / 'data/notions.json': dump(notions()), ROOT / 'data/stats.json': dump(stats())}
if '--check' in sys.argv:
    bad = [str(p) for p, c in targets.items() if not p.exists() or p.read_text(encoding='utf-8') != c]
    if bad:
        raise SystemExit('pas à jour (lancer python3 -I scripts/build_data.py) : ' + ', '.join(bad))
    print('données à jour')
else:
    for p, c in targets.items():
        p.write_text(c, encoding='utf-8')
    print('écrit :', ', '.join(p.name for p in targets))
