"""Index transversal des Mémentos Francis Lefebvre.

Lit data/mementos/*.tsv (TYPE, NUM, TITRE) et produit
imprimer/Index_Mementos.html : index alphabétique unique (notion -> Mémento -> n°),
puis le plan condensé de chaque Mémento.
"""
import html
import pathlib
import re
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "mementos"
OUT = ROOT / "imprimer" / "Index_Mementos.html"

NOMS = {
    "associations": ("ASSO", "Associations 26"),
    "audit": ("AUDIT", "Audit 25-26"),
    "social": ("SOC", "Social 26"),
    "fiscal": ("FISC", "Fiscal 26"),
    "comptable": ("COMPTA", "Comptable 26"),
    "societes": ("SOC.COM", "Sociétés commerciales 27"),
}
ORDRE = list(NOMS)

STOP = re.compile(r"^(le |la |les |l'|l’|un |une |des |du |de la |de l'|de |d'|« )+", re.I)


def cle(titre):
    t = unicodedata.normalize("NFD", titre)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    t = STOP.sub("", t.strip("« »\"' "))
    return re.sub(r"[^a-z0-9 ]", " ", t).split() or ["~"]


def lire(fichier):
    lignes = []
    for brut in fichier.read_text(encoding="utf-8").splitlines():
        if not brut.strip():
            continue
        typ, num, titre = brut.split("\t")
        lignes.append((typ, num, titre))
    return lignes


def entrees(slug, lignes):
    """Rattache chaque entrée à son contexte (partie / chapitre / section)."""
    sigle, _ = NOMS[slug]
    partie = chapitre = section = ""
    out = []
    for typ, num, titre in lignes:
        if typ == "P":
            partie, chapitre, section = titre, "", ""
            continue
        if typ == "T":
            chapitre, section = "", ""
            continue
        if typ == "C":
            chapitre, section = titre, ""
            continue
        if typ == "S":
            section = titre
        ctx = chapitre or partie
        if typ in ("R", "L", "X") and section and section != titre:
            ctx = f"{ctx} › {section}" if ctx else section
        if typ == "N":
            ctx = "Nouveauté de l'édition"
        out.append({"slug": slug, "sigle": sigle, "num": num, "titre": titre,
                    "ctx": ctx, "nouv": typ == "N"})
    return out


def plan_html(slug, lignes):
    _, nom = NOMS[slug]
    rows = []
    for typ, num, titre in lignes:
        if typ == "N":
            continue
        if typ in ("P", "T", "C"):
            rows.append(f'<div class="pl pl{typ}">{html.escape(titre)}</div>')
        else:
            rows.append(f'<div class="pl pl{typ}"><b>{html.escape(num)}</b> {html.escape(titre)}</div>')
    return f'<section class="plan"><h2>Plan — Mémento {html.escape(nom)}</h2>{"".join(rows)}</section>'


def main():
    fichiers = sorted(SRC.glob("*.tsv"), key=lambda f: ORDRE.index(f.stem) if f.stem in ORDRE else 99)
    toutes, plans, legende = [], [], []
    for f in fichiers:
        lignes = lire(f)
        toutes += entrees(f.stem, lignes)
        plans.append(plan_html(f.stem, lignes))
        sigle, nom = NOMS[f.stem]
        legende.append(f"<b>{sigle}</b> = Mémento {html.escape(nom)}")
    toutes.sort(key=lambda e: (cle(e["titre"]), ORDRE.index(e["slug"]), int(re.sub(r"\D", "", e["num"]) or 0)))

    corps, lettre = [], None
    for e in toutes:
        l = cle(e["titre"])[0][0].upper()
        if l != lettre:
            lettre = l
            corps.append(f'<tr class="let"><td colspan="3">{l}</td></tr>')
        n = " ★" if e["nouv"] else ""
        corps.append(
            f'<tr><td class="t">{html.escape(e["titre"])}{n}<span class="c">{html.escape(e["ctx"])}</span></td>'
            f'<td class="m m-{e["slug"]}">{e["sigle"]}</td><td class="n">{html.escape(e["num"])}</td></tr>')

    page = f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Index Mémentos</title>
<style>
@page {{ size: A4; margin: 10mm 9mm; }}
:root {{ --fg:#111; --mut:#666; --bg:#fff; --rule:#ddd; }}
body {{ font: 8pt/1.2 "Helvetica Neue", Arial, sans-serif; color:var(--fg); background:var(--bg); margin:0 auto; max-width: 210mm; padding: 0 16px; }}
h1 {{ font-size: 15pt; margin: 6px 0 2px; }}
h2 {{ font-size: 12pt; margin: 14px 0 6px; break-after: avoid; }}
.leg {{ color:var(--mut); margin-bottom: 8px; }}
.idx {{ columns: 2; column-gap: 8mm; }}
table {{ width:100%; border-collapse: collapse; }}
tr {{ break-inside: avoid; }}
td {{ border-bottom: 1px solid var(--rule); padding: 1px 2px; vertical-align: top; }}
td.t {{ width: 100%; }}
td.m {{ font-size: 7pt; font-weight: 700; white-space: nowrap; padding-top: 2px; }}
td.n {{ font-weight: 700; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }}
.c {{ display:block; font-size: 6.5pt; color: var(--mut); }}
tr.let td {{ font-weight: 800; font-size: 11pt; border-bottom: 2px solid var(--fg); padding-top: 6px; }}
.m-associations {{ color:#555; }} .m-audit {{ color:#7a7a7a; }} .m-social {{ color:#8b1e2b; }}
.m-fiscal {{ color:#1b2a4a; }} .m-comptable {{ color:#1679c4; }} .m-societes {{ color:#4a4a4a; }}
.plan {{ break-before: page; columns: 2; column-gap: 8mm; }}
.plan h2 {{ column-span: all; }}
.pl {{ break-inside: avoid; }}
.plP {{ font-weight: 800; font-size: 10pt; margin-top: 6px; border-bottom: 2px solid var(--fg); }}
.plT {{ font-weight: 700; margin-top: 4px; }}
.plC {{ font-weight: 700; margin-top: 4px; text-decoration: underline; }}
.plS {{ padding-left: 6px; font-weight: 600; }}
.plR {{ padding-left: 12px; }}
.plL, .plX {{ padding-left: 18px; color: #333; }}
@media screen and (max-width: 700px) {{ .idx, .plan {{ columns: 1; }} }}
</style></head><body>
<h1>Index transversal des Mémentos</h1>
<div class="leg">Les numéros renvoient aux <b>paragraphes</b> des Mémentos (pas aux pages). ★ = nouveauté de l'édition.
{" · ".join(legende)}. {len(toutes)} entrées.</div>
<div class="idx"><table>{"".join(corps)}</table></div>
{"".join(plans)}
</body></html>
"""
    OUT.write_text(page, encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} : {len(toutes)} entrées, {len(fichiers)} Mémentos")


if __name__ == "__main__":
    main()
