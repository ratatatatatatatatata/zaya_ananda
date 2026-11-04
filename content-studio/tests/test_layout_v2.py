import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
import render_post_v2


class LayoutV2Tests(unittest.TestCase):
    def test_heading_first_and_painted_glyph_separation(self):
        from PIL import Image
        d=json.loads((ROOT/"examples/nature.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            out=Path(tmp)/"v2"
            r=render_post_v2.build(d,ROOT/"examples/pine.png",out)
            with Image.open(out/"poster.png") as im:self.assertEqual(im.size,(1080,1350))
            with Image.open(out/"phone-preview.png") as im:self.assertEqual(im.size,(360,450))
            for a,b in zip(r["text"],r["text"][1:]):self.assertLessEqual(a["bounds"][3]+16,b["bounds"][1])
            self.assertLess(r["text"][-1]["bounds"][3],r["image_box"][1])
            self.assertTrue(all(not row["missing_glyphs"] for row in r["text"]))
            with self.assertRaises(FileExistsError):render_post_v2.build(d,ROOT/"examples/pine.png",out)

    def test_long_copy_refuses_to_reduce_font(self):
        d=json.loads((ROOT/"examples/nature.json").read_text(encoding="utf-8"))
        d["headline"]=["Өдөр тутмын талархал болон байгальтай харилцах тухай маш урт гарчиг"]
        with tempfile.TemporaryDirectory() as tmp:
            out=Path(tmp)/"v2"
            with self.assertRaisesRegex(ValueError,"overflows"):render_post_v2.build(d,ROOT/"examples/pine.png",out)
            self.assertFalse(out.exists())


if __name__=="__main__":unittest.main()
