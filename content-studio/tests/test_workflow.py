import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT/"scripts"/(name+".py"))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m

class WorkflowTests(unittest.TestCase):
    def test_fixed_template_render_and_protect_previous(self):
        from PIL import Image
        m = module("render_post")
        draft = json.loads((ROOT/"examples/nature.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)/"proof"
            report = m.build(draft, ROOT/"examples/pine.png", output)
            with Image.open(output/"poster.png") as im:
                self.assertEqual(im.size, (1080,1350))
            self.assertEqual(len(report["text"]), 3)
            self.assertTrue(all(not r["missing_glyphs"] for r in report["text"]))
            before = (output/"poster.png").read_bytes()
            with self.assertRaises(FileExistsError):
                m.build(draft, ROOT/"examples/pine.png", output)
            self.assertEqual(before, (output/"poster.png").read_bytes())
    def test_overflow_refused_before_output(self):
        m = module("render_post")
        draft = json.loads((ROOT/"examples/nature.json").read_text(encoding="utf-8"))
        draft["headline"] = ["Өөрийн өдөр тутмын талархлын тухай маш урт өгүүлбэр "*5]
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)/"proof"
            with self.assertRaisesRegex(ValueError, "overflows"):
                m.build(draft, ROOT/"examples/pine.png", output)
            self.assertFalse(output.exists())
    def test_unknown_topic_does_not_invent_source(self):
        m = module("prepare_topic")
        notes = [{"title":"Талархлын дадал", "explanation":"Өдөр тутмын талархал"}]
        self.assertEqual(m.shortlist("сансрын нислэг", notes), [])
        self.assertEqual(m.shortlist("талархал", notes)[0]["source_index"], 0)
    def test_private_paths_are_ignored(self):
        import subprocess
        paths = ["content-studio/.local/private.json", "content-studio/outputs/draft.json"]
        run = subprocess.run(["git", "check-ignore", *paths], cwd=ROOT.parent, capture_output=True, text=True)
        self.assertEqual(run.returncode, 0)
        self.assertEqual(set(run.stdout.splitlines()), set(paths))

if __name__ == "__main__":
    unittest.main()
