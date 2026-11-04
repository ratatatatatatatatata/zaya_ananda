#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Local-only source shortlist. This is retrieval, never a claim verifier."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ALIASES = {
    "таларх": ["таларх", "дадaл"],
    "байгал": ["байгаль", "лус", "савдаг", "орчин"],
    "бясалгал": ["бясалгал", "ананда", "дадлага"],
    "аура": ["аура", "давхарга", "био энерги"],
    "гал": ["галын", "гал голомт"],
    "өөрийгөө тан": ["өөрийгөө тан", "би хэн", "өөрийг"],
}

def shortlist(topic, notes):
    q = topic.casefold().strip()
    terms = {t for t in re.findall(r"[а-яёөүa-z]+", q) if len(t) >= 3}
    for key, values in ALIASES.items():
        if key in q:
            terms.update(values)
    rows = []
    for index, note in enumerate(notes):
        title = str(note.get("title", "")).casefold()
        body = json.dumps(note, ensure_ascii=False).casefold()
        matches = sorted(t for t in terms if t in body)
        score = sum(4 if t in title else 1 for t in matches)
        if score:
            rows.append({"source_index": index, "score": score, "matched_terms": matches, "note": note})
    return sorted(rows, key=lambda r: (-r["score"], r["source_index"]))[:3]

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--topic", required=True)
    p.add_argument("--out", type=Path, required=True)
    a = p.parse_args()
    # Always keep retrieved private excerpts under this ignored local directory.
    out = a.out.resolve()
    if not out.is_relative_to(ROOT / ".local"):
        p.error("Private source briefs must stay inside content-studio/.local/")
    if out.exists():
        p.error("Output already exists; choose a new version")
    config = ROOT / ".local/config.json"
    path = os.environ.get("ANANDA_COURSE_NOTES")
    if not path and config.is_file():
        path = json.loads(config.read_text(encoding="utf-8")).get("course_notes")
    if not path or not Path(path).expanduser().is_file():
        p.error("Local course source is not configured; no course claim can be drafted")
    source = Path(path).expanduser().resolve()
    # A checked-out repository must never be the private course archive.
    if source.is_relative_to(ROOT.parent):
        p.error("Course archive must be outside the Git repository")
    notes = json.loads(source.read_text(encoding="utf-8"))
    if not isinstance(notes, list) or not all(isinstance(n, dict) for n in notes):
        p.error("Expected a list of course note objects")
    rows = shortlist(a.topic, notes)
    result = {"topic": a.topic, "status": "candidate-sources-require-context-reading" if rows else "no-matching-source", "private_local_only": True, "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "candidates": rows, "instruction": "Read full context before drafting. A keyword match does not verify a claim. Do not transmit this brief to Claude, GitHub, or external services."}
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("x", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(json.dumps({"status": result["status"], "candidate_indices": [r["source_index"] for r in rows], "local_brief": str(out)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
