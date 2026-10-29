"""Construit kit_src/V8_fiscal.html depuis LEGI (DILA). Usage : build.py [pages.json]"""
import sys, json, re, html as H, datetime
sys.path.insert(0, '/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad/py')
import legi, split

REF = '2026-10-29'
OUT = '/home/user/dec-revision-/kit_src/V8_fiscal.html'
SCR = '/tmp/claude-0/-home-user-dec-revision-/849c430f-c4c8-5348-b254-943d0289cfb2/scratchpad/'

# (code, num, sélection, intitulé court, demandé ?)
ARTS = [
 ('CGI', '34', None, 'BIC : définition des bénéfices industriels et commerciaux', 1),
 ('CGI', '35', None, 'BIC par nature (marchands de biens, location meublée…)', 1),
 ('CGI', '38', ['1', '2', '2 bis', '2 ter', '3', '4'], 'Bénéfice imposable : actif net, créances acquises, stocks', 1),
 ('CGI', '39', ['1:6°', '2', '4'], 'Charges déductibles (1° à 5° : frais généraux, amortissements, intérêts, impôts, provisions)', 1),
 ('CGI', '39 C', None, 'Amortissement des biens donnés en location (crédit-bail, location)', 1),
 ('CGI', '39 duodecies', ['1', '2', '3', '4', '5'], 'Plus-values professionnelles : court terme / long terme', 0),
 ('CGI', '39 quindecies', None, 'Plus-values à long terme : imposition, compensation', 0),
 ('CGI', '50-0', None, 'Régime micro-BIC : seuils et abattements', 1),
 ('CGI', '92', None, 'BNC : définition', 1),
 ('CGI', '93', None, 'BNC : détermination du bénéfice', 1),
 ('CGI', '102 ter', None, 'Régime micro-BNC', 1),
 ('CGI', '145', ['1', '6'], 'Régime mère-fille : conditions', 0),
 ('CGI', '150-0 A', ['I'], 'Plus-values de cession de valeurs mobilières et droits sociaux : champ', 1),
 ('CGI', '150-0 B ter', None, 'Apport-cession : report d\'imposition', 1),
 ('CGI', '150-0 D', ['1', '1 ter', '1 quater', '2', '11'], 'Gain net : abattements pour durée de détention (1 ter, 1 quater), moins-values', 1),
 ('CGI', '150-0 D ter', None, 'Abattement fixe du dirigeant partant à la retraite', 1),
 ('CGI', '150 U', None, 'Plus-values immobilières des particuliers : champ et exonérations', 1),
 ('CGI', '150 UB', None, 'Cession de droits sociaux de sociétés à prépondérance immobilière', 1),
 ('CGI', '150 V', None, 'Plus-values sur biens meubles', 1),
 ('CGI', '150 VB', None, 'Prix d\'acquisition (frais, travaux)', 1),
 ('CGI', '150 VC', None, 'Abattements pour durée de détention', 1),
 ('CGI', '150 VD', None, 'Moins-values', 1),
 ('CGI', '150 VE', None, 'Abattement exceptionnel / exonérations particulières', 1),
 ('CGI', '150 VF', None, 'Déclaration et paiement', 1),
 ('CGI', '150 VG', None, 'Déclaration de la plus-value', 1),
 ('CGI', '150 VH', None, 'Paiement de l\'impôt', 1),
 ('CGI', '151 septies', None, 'Exonération des plus-values des petites entreprises (recettes)', 1),
 ('CGI', '151 septies A', None, 'Exonération en cas de départ à la retraite', 1),
 ('CGI', '151 septies B', None, 'Abattement sur plus-values immobilières professionnelles', 1),
 ('CGI', '155', ['IV'], 'Loueur en meublé professionnel (LMP) : critères', 1),
 ('CGI', '158', ['3'], 'Revenus de capitaux mobiliers : abattement de 40 % (3-2°)', 1),
 ('CGI', '199 terdecies-0 A', ['I', 'II', 'III', 'IV', 'V'], 'Réduction IR-PME (souscription au capital)', 1),
 ('CGI', '200', ['1', '1 bis', '1 ter', '2', '5'], 'Dons des particuliers : réduction de 66 % / 75 %', 1),
 ('CGI', '200 A', None, 'Prélèvement forfaitaire unique (PFU) et option pour le barème', 1),
 ('CGI', '206', ['1', '1 bis', '2', '3', '4'], 'Personnes morales passibles de l\'IS ; organismes non lucratifs', 1),
 ('CGI', '209', ['I', 'II'], 'Territorialité de l\'IS ; report des déficits ; transfert sur agrément', 1),
 ('CGI', '210 A', None, 'Fusions : régime de faveur', 0),
 ('CGI', '216', None, 'Régime mère-fille : déduction des produits nets, quote-part 5 %', 0),
 ('CGI', '219', ['I.a', 'I.a quinquies', 'I.b', 'I.f'], 'Taux de l\'IS (25 %, taux réduit 15 %)', 1),
 ('CGI', '223 A', ['I', 'II'], 'Intégration fiscale (95 %)', 1),
 ('CGI', '231 quater', None, 'Taxe annuelle sur les bureaux (Île-de-France, PACA)', 1),
 ('CGI', '238 bis', ['1', '2', '3', '5 bis', '6', '7', '8'], 'Mécénat d\'entreprise : réduction de 60 %', 1),
 ('CGI', '238 quindecies', None, 'Exonération des plus-values de transmission d\'entreprise', 1),
 ('CGI', '239', None, 'Option pour l\'IS des sociétés de personnes (SCI)', 1),
 ('CGI', '239 quater A', None, 'Sociétés civiles de moyens (SCM)', 1),
 ('CGI', '260', None, 'TVA : option (location de locaux nus…)', 1),
 ('CGI', '293 B', None, 'Franchise en base de TVA', 1),
 ('CGI', '719', None, 'Cession de fonds de commerce : droits d\'enregistrement', 1),
 ('CGI', '726', None, 'Cession de droits sociaux : droits d\'enregistrement', 1),
 ('CGI', '787 B', None, 'Pacte Dutreil : transmission à titre gratuit', 1),
 ('CGI', '1717', None, 'Paiement fractionné ou différé des droits', 1),
 ('LPF', 'L169', None, 'Droit de reprise de l\'administration (IR, IS)', 1),
]
WANTED_EXTRA = ['39 duodecies', '39 quindecies', '145', '210 A', '216']

def fdate(d):
    y, m, j = d.split('-'); mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][int(m)-1]
    return f"{int(j)}{'er' if j=='01' else ''} {mois} {y}"

def esc(s): return H.escape(s, quote=False)

def pick(versions):
    cur = [v for v in versions if v['debut'] <= REF < v['fin'] and 'MORT_NE' not in v['etat']]
    cur.sort(key=lambda v: v['debut'])
    fut = sorted([v for v in versions if v['debut'] > REF and 'MORT_NE' not in v['etat']], key=lambda v: v['debut'])
    return (cur[-1] if cur else None), fut

def cdo_mods():
    import xml.etree.ElementTree as ET
    out = {}
    for c, f in (('CGI', 'cgi.xml'), ('LPF', 'lpf.xml')):
        for a in ET.parse(legi.D + f).getroot().iter('article'):
            if a.get('etat') == 'VIGUEUR': out[(c, a.get('num'))] = ' '.join(a.get('modTitle', '').split()) + ' (codes.droit.org)'
    return out
CDO = {}
FUT = {}

def main():
    global CDO
    CDO = cdo_mods()
    pages = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else {}
    need = {}
    for c, n, *_ in ARTS: need.setdefault(c, set()).add(n)
    idx = legi.index(need)
    found, missing, meta = [], [], []
    for c, n, spec, title, asked in ARTS:
        vs = idx.get((c, n), [])
        cur, fut = pick(vs)
        if not cur:
            missing.append((c, n, title)); continue
        # versions annoncées par la liste VERSIONS mais absentes des fichiers
        allv = {}
        for v in vs:
            for la in v['versions']: allv[la['id']] = la
        futl = [la for la in allv.values() if la.get('debut', '0') > REF and 'MORT_NE' not in la.get('etat', '') and not la.get('debut', '').startswith('2222')]
        found.append((c, n, spec, title, asked, cur, fut, futl))
    # ---------- corps
    body = []
    toc = []
    for c, n, spec, title, asked, a, fut, futl in found:
        anchor = f"{c}-{n}".replace(' ', '_')
        sel, omitted = split.select(a['html'], spec)
        nexts = sorted([v for v in fut if 'MORT_NE' not in v['etat']], key=lambda v: v['debut'])
        mod0, retro = legi.modifs2(a, nexts)
        modtxt = re.sub(r'\s*\((?:V|VT|T|M)\)', '', mod0) or CDO.get((c, n), 'texte modificatif non indiqué')
        modtxt = re.sub(r'\s*\((?:V|VT|T|M)\)', '', modtxt)
        if retro: modtxt += ' ; modifié ensuite, avec effet rétroactif, par : ' + re.sub(r'\s*\((?:V|VT|T|M)\)', '', retro)
        fin = '' if a['fin'].startswith('2999') else f" jusqu'au {fdate(a['fin'])} (exclu)"
        lab = ('Article ' + n) if c == 'CGI' else ('Article ' + n.replace('L', 'L. ', 1))
        h = [f'<section class="art" id="{anchor}">',
             f'<h2 class="ah"><span class="cd">{c}</span> {esc(lab)}<span class="tt">{esc(title)}</span></h2>',
             f'<p class="ver">Version en vigueur du {fdate(a["debut"])}{fin} — {esc(modtxt)} — <span class="id">{a["id"]}</span></p>']
        if spec:
            h.append(f'<p class="ext">Extrait : paragraphes {esc(", ".join(s.split(":")[0].replace(".", " ") for s in spec))} reproduits'
                     + (' (1 : du 1° au 5° seulement)' if n == '39' else '') + ' ; les passages non reproduits sont signalés par [… ].</p>')
        if not a['fin'].startswith('2999'):
            nxt = [v for v in fut if v['debut'] == a['fin']] + [la for la in futl if la.get('debut') == a['fin']]
            if nexts and nexts[0]['debut'] == a['fin']:
                fts = legi.modifs2(nexts[0], nexts[1:])[0]
            else:
                fts = legi.abroge(a)
            fts = re.sub(r'\s*\((?:V|VT|T|M|Ab)\)', '', fts) or 'texte non indiqué'
            conc = legi.concordance(a)
            conc = [x for x in conc if 'biens et services' in x]
            if conc: fts += ' ; correspondance : ' + ', '.join(x.replace('Code des impositions sur les biens et services - art. ', 'CIBS art. ') for x in conc)
            if nxt:
                msg = f"cette version cesse de s'appliquer le {fdate(a['fin'])} : une nouvelle rédaction, déjà publiée, entre en vigueur à cette date ({fts})."
            else:
                msg = f"article <b>abrogé à compter du {fdate(a['fin'])}</b> ({fts})."
            h.append(f'<p class="fut">Attention : {msg} Texte ci-dessous = version applicable en 2026.</p>')
            FUT[(c, n)] = msg
        for k, f in sel:
            if k == 'gap':
                h.append(f'<p class="gap">{esc(split.gaptext(f))}</p>')
            elif k == 'table':
                h.append(f'<div class="tb">{f}</div>')
            else:
                h.append(f'<p>{f}</p>')
        if split.text(a['nota'] or ''):
            nl = split.lines(a['nota'])
            h.append('<div class="nota"><b>Nota.</b> ' + ' '.join(f'<span>{x}</span><br>' if k == 'p' else x for k, x in nl) + '</div>')
        h.append('</section>')
        body.append('\n'.join(h))
        toc.append((c, n, title, a, modtxt, asked, anchor, bool(spec), (c, n) in FUT))
        meta.append(dict(code=c, num=n, id=a['id'], debut=a['debut'], fin=a['fin'], etat=a['etat'], mod=modtxt,
                         extrait=spec, futur=FUT.get((c, n), ''),
                         path=a['path']))
    json.dump(dict(found=meta, missing=missing), open(SCR + 'meta.json', 'w'), ensure_ascii=False, indent=1)
    # ---------- page de garde
    rows = []
    for c, n, title, a, modtxt, asked, anchor, ext, futf in toc:
        p = pages.get(anchor, '…')
        lab = n if c == 'CGI' else 'LPF ' + n.replace('L', 'L. ', 1)
        mk = ('*' if not asked else '') + (' (extr.)' if ext else '') + (' ⚠' if futf else '')
        short = re.sub(r'\s*\(V\)|\s*\(M\)|\s*\(VT\)|\s*\(T\)', '', modtxt)
        short = short.replace('LOI n°', 'L. ').replace('LOI n° ', 'L. ').replace('Décret n°', 'D. ').replace('Ordonnance n°', 'Ord. ')
        rows.append(f'<tr><td class="n">{esc(lab)}<span class="mk">{esc(mk)}</span></td><td>{esc(title)}</td>'
                    f'<td class="v">{a["debut"][8:10]}/{a["debut"][5:7]}/{a["debut"][2:4]}</td><td class="pg">{p}</td></tr>')
    half = (len(rows) + 1) // 2
    NASK = sum(1 for x in ARTS if x[4])
    miss = ''.join(f'<li>{c} art. {esc(n)} — {esc(t)}</li>' for c, n, t in missing) or '<li>aucun : tous les articles demandés ont été trouvés dans LEGI.</li>'
    garde = f'''<section class="garde">
<div class="band">ONGLET VERT · FISCAL</div>
<div class="gt"><span class="vol">V8</span><div><div class="t1">Fiscal choisi</div>
<div class="t2">CGI et LPF : {len(toc)} articles en vigueur au 29 octobre 2026 (loi de finances pour 2026 n° 2026-103 du 19 février 2026 incluse)</div></div></div>
<p class="intro">Volume de secours avant la livraison du Mémento Fiscal 2026, puis texte officiel exact. Sous chaque article : date de début de la version reproduite, texte modificatif et identifiant Légifrance (LEGIARTI). Le numéro cité par l'index (K3) est le folio « V8 · n » en haut de page.</p>
<div class="warn"><b>Art. 293 B (franchise en base de TVA) :</b> reproduit dans sa version applicable en 2026. Il est <b>abrogé au 1er janvier 2027</b> par l'ordonnance n° 2025-1247 du 17 décembre 2025 (recodification de la TVA dans le code des impositions sur les biens et services, CIBS), entrée en vigueur reportée au 1er janvier 2027 par l'ordonnance n° 2026-671 du 27 juillet 2026. Correspondances indiquées par LEGI : CIBS art. L. 233-3, L. 233-9, L. 233-10, L. 233-11 et L. 233-21. Pour la session de mai 2027, citer le CIBS (à vérifier dans le Mémento 2027). Même date d'effet pour l'abrogation de l'art. 260 et pour la nouvelle rédaction des art. 39, 93, 200, 231 quater et 238 bis (signalées sous chaque article).</div>
<div class="tocw">{''.join('<table class="toc"><thead><tr><th>Art.</th><th>Objet</th><th>Version</th><th>p.</th></tr></thead><tbody>' + ''.join(r) + '</tbody></table>' for r in (rows[:half], rows[half:]))}</div>
<p class="leg">* article ajouté aux {NASK} articles demandés (entrées de l'index K3 ou fiche K2·11). (extr.) : extrait, les paragraphes reproduits sont indiqués sous l'article. ⚠ : modification déjà publiée à effet postérieur au 29/10/2026.</p>
<p class="leg"><b>Articles manquants :</b></p><ul class="leg">{miss}</ul>
<p class="leg"><b>Sources.</b> Base LEGI de la DILA (données ouvertes Légifrance, licence ouverte) : archive globale du 13/07/2025 et {NINC} mises à jour quotidiennes jusqu'à celle du 28/10/2026 (LEGI_20261028-212713) ; version retenue = celle dont la période de vigueur couvre le 29/10/2026. Contrôle croisé avec l'édition codes.droit.org (CGI mis à jour le 01/09/2026). Légifrance n'a pas pu être consulté directement (403 aux robots). Édition non officielle : seul le Journal officiel fait foi. Généré le {datetime.date.today().strftime('%d/%m/%Y')}.</p>
</section>'''
    css = open(SCR + 'py/v8.css').read()
    doc = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>V8 Fiscal choisi</title>
<link rel="stylesheet" href="kit.css">
<style>{css}</style></head><body>
{garde}
<main class="corps">
{chr(10).join(body)}
</main>
</body></html>'''
    open(OUT, 'w').write(doc)
    print('articles', len(toc), 'manquants', missing)

NINC = 0
if __name__ == '__main__':
    import glob
    NINC = len(glob.glob(legi.D + 'inc/LEGI_*/.ok'))
    main()
