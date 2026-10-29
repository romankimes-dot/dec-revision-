"""Index des articles CGI / LPF depuis le Freemium LEGI + incréments quotidiens (DILA)."""
import os, re, glob, json, xml.etree.ElementTree as ET
D = '/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad/dl/'
CODES = {'CGI': 'LEGITEXT000006069577', 'LPF': 'LEGITEXT000006069583'}
NUMRE = re.compile(rb'<NUM>([^<]*)</NUM>')

def files():
    """id -> chemin du fichier le plus récent (freemium puis incréments par ordre chronologique)."""
    m = {}
    roots = [D + 'free'] + sorted(glob.glob(D + 'inc/LEGI_*'))
    for r in roots:
        for dp, dn, fn in os.walk(r):
            if '/article/' not in dp: continue
            code = 'CGI' if CODES['CGI'] in dp else ('LPF' if CODES['LPF'] in dp else None)
            if not code: continue
            for f in fn:
                if f.startswith('LEGIARTI'):
                    m[(code, f[:-4])] = os.path.join(dp, f)
    return m

def suppressions():
    s = set()
    for f in glob.glob(D + 'inc/LEGI_*/**/liste_suppression*', recursive=True):
        for l in open(f, errors='ignore'):
            mm = re.search(r'(LEGIARTI\d+)', l)
            if mm: s.add(mm.group(1))
    return s

def parse(path):
    r = ET.parse(path).getroot()
    g = lambda p: (r.findtext(p) or '').strip()
    ma = r.find('META/META_SPEC/META_ARTICLE')
    liens = []
    for l in r.iter('LIEN'):
        liens.append(dict(l.attrib, txt=' '.join((l.text or '').split())))
    versions = [dict(v.attrib) for v in r.iter('LIEN_ART')]
    cont = r.find('BLOC_TEXTUEL/CONTENU')
    nota = r.find('NOTA/CONTENU')
    ser = lambda e: '' if e is None else ((e.text or '') + ''.join(ET.tostring(c, encoding='unicode') for c in e))
    return dict(id=g('META/META_COMMUN/ID'), num=ma.findtext('NUM').strip(), etat=ma.findtext('ETAT'),
                debut=ma.findtext('DATE_DEBUT'), fin=ma.findtext('DATE_FIN'), liens=liens,
                versions=versions, html=ser(cont), nota=ser(nota), path=path)

def index(nums_by_code):
    m = files(); sup = suppressions(); out = {}
    for (code, aid), p in m.items():
        if aid in sup: continue
        raw = open(p, 'rb').read(3000)
        mm = NUMRE.search(raw)
        if not mm: continue
        num = mm.group(1).decode().strip()
        if num in nums_by_code.get(code, ()):
            out.setdefault((code, num), []).append(parse(p))
    return out

def modifs(a):
    """Texte(s) ayant créé la version : liens cible MODIFIE/CREATION de date ≤ début, le plus récent.
    Pour une version sans fin (en vigueur), à défaut, le lien MODIFIE le plus récent (effet rétroactif)."""
    typ = ('MODIFIE', 'CREATION', 'TRANSFERE', 'CODIFICATION')
    allc = [l for l in a['liens'] if l.get('sens') == 'cible' and l.get('typelien') in typ]
    c = [l for l in allc if l.get('datesignatexte', '9') <= a['debut']]
    if not c and a['fin'].startswith('2999'): c = allc
    if not c: return []
    best = max(l['datesignatexte'] for l in c)
    groups = {}
    for l in c:
        if l['datesignatexte'] != best: continue
        base = re.split(r'\s+-\s+art\.', l['txt'])[0]
        groups.setdefault(base, [])
        art = l.get('num') or ''
        if art and art not in groups[base]: groups[base].append(art)
    return [dict(txt=b + ((' - art. ' + ', '.join(sorted(v, key=lambda x: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', x)]))) if v else ''))
            for b, v in groups.items()]

def futurs(a):
    return [l for l in a['liens'] if l.get('sens') == 'cible' and l.get('typelien') in ('MODIFIE', 'ABROGE', 'TRANSFERE')
            and l.get('datesignatexte', '0') > a['debut'] and l.get('naturetexte') != 'CODE']

def _fmt(links):
    groups = {}
    for l in links:
        base = re.split(r'\s+-\s+art\.', l['txt'])[0]
        groups.setdefault(base, [])
        art = l.get('num') or ''
        if art and art not in groups[base]: groups[base].append(art)
    key = lambda x: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', x)]
    return ' ; '.join(b + ((' - art. ' + ', '.join(sorted(v, key=key))) if v else '') for b, v in groups.items())

def modifs2(a, nexts):
    """(texte créateur, textes rétroactifs postérieurs) ; nexts = versions suivantes (leurs créateurs sont exclus)."""
    excl = set()
    for n in nexts:
        for l in n['liens']:
            if l.get('sens') == 'cible' and l.get('typelien') == 'MODIFIE': excl.add(l['txt'])
    typ = ('MODIFIE', 'CREATION', 'TRANSFERE', 'CODIFICATION')
    c = [l for l in a['liens'] if l.get('sens') == 'cible' and l.get('typelien') in typ and l['txt'] not in excl]
    before = [l for l in c if l.get('datesignatexte', '9') <= a['debut']]
    after = sorted([l for l in c if l.get('datesignatexte', '0') > a['debut']], key=lambda l: l['datesignatexte'])
    if before:
        best = max(l['datesignatexte'] for l in before)
        return _fmt([l for l in before if l['datesignatexte'] == best]), _fmt(after)
    return _fmt(after), ''

def abroge(a):
    return _fmt([l for l in a['liens'] if l.get('sens') == 'cible' and l.get('typelien') == 'ABROGE'])

def concordance(a):
    return [re.sub(r'\s*\((?:V|VD|VT|T|M|Ab)\)', '', l['txt']) for l in a['liens'] if l.get('typelien') == 'CONCORDANCE']
