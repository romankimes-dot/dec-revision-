"""Applique aux TSV des Mémentos les constats de relecture (JSONL : fix / add / remove)."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
FICHIERS = {"asso": "associations", "audit": "audit", "social": "social",
            "compta": "comptable", "fiscal": "fiscal", "soc": "societes"}
def main(dossier):
    for j in sorted(pathlib.Path(dossier).glob("*.jsonl")):
        slug = next(v for k, v in FICHIERS.items() if j.stem.startswith(k) and (k != "soc" or not j.stem.startswith("social")))
        tsv = ROOT / "kit_src" / "mementos" / f"{slug}.tsv"
        lignes = tsv.read_text(encoding="utf-8").splitlines()
        ops = [json.loads(l) for l in j.read_text(encoding="utf-8").splitlines() if l.strip()]
        rempl = {o["old"]: o["new"] for o in ops if o["action"] == "fix"}
        suppr = {o["old"] for o in ops if o["action"] == "remove"}
        ajout = {o["after"]: o["new"] for o in ops if o["action"] == "add"}
        out, fait = [], 0
        for l in lignes:
            if l in suppr: fait += 1; continue
            if l in rempl: out.append(rempl[l]); fait += 1
            else: out.append(l)
            if l in ajout and ajout[l] not in lignes: out.append(ajout[l]); fait += 1
        tsv.write_text("\n".join(out) + "\n", encoding="utf-8")
        autres = [o for o in ops if o["action"] not in ("fix", "add", "remove")]
        print(f"{j.name} -> {slug}.tsv : {fait}/{len(ops) - len(autres)} appliqués", *[f"\n   {o}" for o in autres])
if __name__ == "__main__":
    main(sys.argv[1])
