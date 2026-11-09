"""Table des notions UE 2 : une notion -> où chercher dans chaque Mémento (n°) et dans V1-V8 (folio).

Source : kit_src/mementos/notions_ue2.txt. Chaque n° cité doit exister dans le TSV du Mémento
(sinon le script s'arrête). Sortie : imprimer/Table_notions_UE2.html.
"""
import html, json, pathlib, re, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "kit_src" / "mementos"
OUT = ROOT / "imprimer" / "Table_notions_UE2.html"
COLS = [("AUD", "audit", "Audit"), ("SOC", "societes", "Sociétés"), ("CPT", "comptable", "Comptable"),
        ("FISC", "fiscal", "Fiscal"), ("SCL", "social", "Social"), ("ASSO", "associations", "Associations")]


def cle(t):
    t = unicodedata.normalize("NFD", t)
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in t if unicodedata.category(c) != "Mn").lower()).strip()


def main():
    nums = {}
    for sig, slug, _ in COLS:
        nums[sig] = {}
        for l in (SRC / f"{slug}.tsv").read_text(encoding="utf-8").splitlines():
            typ, num, titre = l.split("\t")
            if typ not in "PTC":
                nums[sig].setdefault(num, titre)
    kidx = {e["id"]: e for e in json.loads((ROOT / "data" / "index_prerempli.json").read_text(encoding="utf-8"))["entrees"]}
    rows, erreurs, revue = [], [], []
    for n, brut in enumerate((SRC / "notions_ue2.txt").read_text(encoding="utf-8").splitlines(), 1):
        if not brut.strip() or brut.startswith("#"):
            continue
        champs = [c.strip().replace("\x00", " || ") for c in brut.replace("||", "\x00").split("|")]
        if len(champs) != 3:
            erreurs.append(f"l.{n}: {len(champs)} champs"); continue
        labels, refs, kids = champs
        cells = {}
        for bloc in filter(None, (b.strip() for b in refs.split(";"))):
            sig, *ns = bloc.split()
            for x in ns:
                num, prim = x.rstrip("*"), x.endswith("*")
                if sig not in nums or num not in nums[sig]:
                    erreurs.append(f"l.{n}: {sig} {num} absent du TSV"); continue
                cells.setdefault(sig, []).append((num, prim))
                revue.append(f"{labels.split(' || ')[0]}\t{sig} {num}\t{nums[sig][num]}")
        textes = []
        for k in kids.split():
            e = kidx.get(k)
            if not e: erreurs.append(f"l.{n}: {k} inconnu"); continue
            if re.fullmatch(r"V\d", e["volume"]) and e["ref"]:
                textes.append((e["volume"], e["ref"], e["texte"]))
        textes = sorted(set(textes), key=lambda t: (t[0], int(t[1])))
        for lab in labels.split(" || "):
            rows.append((lab.strip(), cells, textes))
    if erreurs:
        sys.exit("\n".join(erreurs))
    (SRC / "notions_ue2_revue.txt").write_text("\n".join(revue) + "\n", encoding="utf-8")
    rows.sort(key=lambda r: cle(r[0]))
    corps, lettre = [], None
    for lab, cells, textes in rows:
        l = cle(lab)[0].upper()
        if l != lettre:
            lettre = l
            corps.append(f'<tr class="let"><td colspan="{len(COLS) + 2}">{l}</td></tr>')
        tds = "".join(
            "<td>" + " ".join(f"<b>{n}</b>" if p else n for n, p in cells.get(sig, [])) + "</td>" for sig, _, _ in COLS)
        tx = " · ".join(f'<span class="v">{v}·{r}</span> <span class="a">{html.escape(t)}</span>' for v, r, t in textes)
        corps.append(f'<tr><td class="t">{html.escape(lab)}</td>{tds}<td class="x">{tx}</td></tr>')
    ths = "".join(f"<th>{nom}</th>" for _, _, nom in COLS)
    OUT.write_text(f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Table des notions UE 2</title>
<style>
@page {{ size: A4 landscape; margin: 9mm 8mm; }}
body {{ font: 8pt/1.2 "Helvetica Neue", Arial, sans-serif; color:#111; background:#fff; margin:0; }}
h1 {{ font-size: 14pt; margin: 0 0 2px; }}
.leg {{ color:#444; margin-bottom: 5px; font-size: 7.5pt; }}
table {{ width:100%; border-collapse: collapse; table-layout: fixed; }}
thead {{ display: table-header-group; }}
th {{ text-align:left; font-size:7.5pt; border-bottom:2px solid #111; padding:2px 3px; }}
tr {{ break-inside: avoid; }}
td {{ border-bottom:1px solid #ccc; border-left:1px solid #e4e4e4; padding:1.5px 3px; vertical-align:top; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }}
td.t {{ border-left:0; font-weight:600; }}
td b {{ background:#111; color:#fff; padding:0 2px; border-radius:2px; }}
td.x {{ font-size:7pt; }}
.v {{ font-weight:700; }} .a {{ color:#555; }}
tr.let td {{ font-weight:800; font-size:10pt; border-bottom:1.5px solid #111; border-left:0; padding-top:5px; }}
tr:nth-child(even) td {{ background:#f6f6f6; }} tr.let td {{ background:#fff !important; }}
col.n {{ width:24%; }} col.m {{ width:10.4%; }} col.s {{ width:7.6%; }} col.x {{ width:22%; }}
</style></head><body>
<h1>Table des notions — DEC UE 2</h1>
<div class="leg">Je cherche une notion → j'ouvre le bon livre au bon endroit. <b>Mémentos</b> : numéros de <b>paragraphe</b> (pas des pages) ;
le numéro sur fond noir est le point d'entrée conseillé, les autres mènent aux développements voisins.
<b>Textes</b> : volume V1 à V8 · folio, puis l'article. V1 NEP · V2 Livre VIII C. com. · V3 PCG · V4 Déontologie · V5 Référentiel OEC · V6 Textes choisis · V8 Fiscal choisi.
Le numéro vise le début du développement : lire à partir de là. Notion absente ? → index complet K5 ou table alphabétique du Mémento. {len(rows)} entrées.</div>
<table><colgroup><col class="n"><col class="m"><col class="m"><col class="m"><col class="s"><col class="s"><col class="s"><col class="x"></colgroup>
<thead><tr><th>Notion</th>{ths}<th>Textes (V1–V8 · folio)</th></tr></thead>
<tbody>{"".join(corps)}</tbody></table>
</body></html>
""", encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} : {len(rows)} lignes, {len(revue)} renvois Mémentos")


if __name__ == "__main__":
    main()
