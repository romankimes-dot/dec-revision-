"""Découpe le contenu HTML LEGI d'un article en lignes et sélectionne des paragraphes."""
import re, html as H

SUF = r'(?: (?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies))'
ROM = re.compile(r'^((?=[IVX])X{0,3}(?:IX|IV|V?I{0,3})' + SUF + r'?(?: [A-D])?)\s?(?:\.|\s?[-–])\s*[-–]?\s*')
ARA = re.compile(r'^(\d+' + SUF + r'?)\s?\.\s*[-–]?\s*')
LET = re.compile(r'^([a-zA-Z](?: (?:bis|ter|quater|quinquies|sexies|septies))?(?:-0(?: bis| ter)?)?)\s?[\.\)]\s*[-–]?\s*(?=\S)')
DEG = re.compile(r'^(\d+°' + SUF + r'?)')

ALLOWED = {'table', 'tbody', 'thead', 'tr', 'td', 'th', 'sup', 'sub', 'i', 'b', 'em', 'strong', 'u', 'p', 'br', 'colgroup', 'col'}

def clean(frag):
    def tag(m):
        close, name, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if name not in ALLOWED: return ''
        if name in ('td', 'th') and not close:
            keep = ' '.join(re.findall(r'(?:colspan|rowspan)="\d+"', attrs or ''))
            return f'<{name}{" " + keep if keep else ""}>'
        return f'<{close}{name}>'
    return re.sub(r'<(/?)([a-zA-Z0-9]+)([^>]*)>', tag, frag)

def lines(content):
    """Liste de fragments HTML : un par alinéa ; tableaux conservés entiers."""
    c = content.replace('\r', '')
    out = []
    parts = re.split(r'(<table.*?</table>)', c, flags=re.S | re.I)
    for part in parts:
        if part.lower().startswith('<table'):
            out.append(('table', clean(part))); continue
        part = re.sub(r'</?p[^>]*>', '<br/>', part, flags=re.I)
        for seg in re.split(r'<br\s*/?>', part, flags=re.I):
            s = clean(seg).strip()
            s = re.sub(r'<(/?)p>', '', s)
            if re.sub(r'<[^>]+>|\s|&nbsp;', '', s):
                out.append(('p', ' '.join(s.split())))
    return out

def text(frag):
    return H.unescape(re.sub(r'<[^>]+>', '', frag)).strip()

def label(lines_):
    """Ajoute à chaque ligne son chemin (L1, L2) selon le style de l'article."""
    first = next((text(f) for k, f in lines_ if k == 'p'), '')
    roman = bool(ROM.match(first))
    L1 = L2 = None; res = []
    for k, f in lines_:
        t = text(f) if k == 'p' else ''
        if roman:
            m = ROM.match(t)
            if m:
                L1, L2 = m.group(1), None
                rest = t[m.end():]
                m2 = ARA.match(rest) or LET.match(rest)
                if m2: L2 = m2.group(1)
            else:
                m2 = ARA.match(t) or LET.match(t)
                if m2 and L1: L2 = m2.group(1)
        else:
            m = ARA.match(t)
            if m:
                L1, L2 = m.group(1), None
                rest = t[m.end():]
                m2 = LET.match(rest)
                if m2 and not DEG.match(rest): L2 = m2.group(1)
            else:
                m2 = LET.match(t)
                if m2 and not DEG.match(t): L2 = m2.group(1)
        res.append((k, f, L1, L2, t))
    return res

def select(content, spec):
    """spec : None (tout) ou liste de 'I', 'I.a', '1', '1:6°' (section 1 jusqu'avant la ligne commençant par 6°)."""
    L = label(lines(content))
    if not spec:
        return [(k, f) for k, f, *_ in L], []
    keep = []
    for k, f, l1, l2, t in L:
        ok = l1 is None
        for s in spec:
            stop = None
            if ':' in s: s, stop = s.split(':')
            if '.' in s:
                a, b = s.split('.', 1)
                if l1 == a and (l2 is None or l2 == b): ok = True
            elif l1 == s: ok = True
        keep.append(ok)
    # arrêts « :n° »
    for s in spec:
        if ':' in s:
            sec, stop = s.split(':'); stopping = False
            for i, (k, f, l1, l2, t) in enumerate(L):
                if l1 != sec: stopping = False; continue
                if t.startswith(stop): stopping = True
                if stopping: keep[i] = False
    out = []; omitted = []; gap = []
    for (k, f, l1, l2, t), ok in zip(L, keep):
        if ok:
            if gap:
                out.append(('gap', gap)); omitted.append(gap); gap = []
            out.append((k, f))
        else:
            d = DEG.match(t)
            lab = (l1 or '') + ((', ' + d.group(1)) if d else ((' ' + l2) if l2 else ''))
            lab = (l1 or '', lab)
            if not gap or gap[-1] != lab: gap.append(lab)
    if gap: out.append(('gap', gap)); omitted.append(gap)
    return out, omitted

def gaptext(gap):
    g = [x for x in gap if x[0]]
    if not g: return '[…]'
    (f1, fl), (l1, ll) = g[0], g[-1]
    if f1 != l1: return f'[… {f1} à {l1} : non reproduits …]'
    labs = [x[1].split(',')[0] for x in g]
    if len(set(labs)) > 1: return f'[… {labs[0]} à {labs[-1]} : non reproduits …]'
    degs = [x[1] for x in g if '°' in x[1]]
    if degs and len(degs) > 1: return f'[… {degs[0]} à {degs[-1].split(", ")[-1]} : non reproduits …]'
    return f'[… {f1} : non reproduit …]'
