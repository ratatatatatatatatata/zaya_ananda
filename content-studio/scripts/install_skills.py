#!/usr/bin/env python3
"""Install new personal skill directories; refuse existing targets."""
import argparse
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--target", choices=["codex", "claude", "both"], required=True)
    a = p.parse_args()
    jobs = []
    if a.target in ("codex", "both"):
        jobs.append((ROOT.parent/".agents/skills/zaya-ananda-content", Path.home()/".codex/skills/zaya-ananda-content"))
    if a.target in ("claude", "both"):
        jobs.append((ROOT/"integrations/claude/zaya-ananda-content", Path.home()/".claude/skills/zaya-ananda-content"))
    for source, target in jobs:
        if not (source/"SKILL.md").is_file():
            p.error("Missing skill package: " + str(source))
        if target.exists() or target.is_symlink():
            p.error("Existing skill preserved: " + str(target))
    for source, target in jobs:
        shutil.copytree(source, target)
        print("Installed " + str(target))

if __name__ == "__main__":
    main()
