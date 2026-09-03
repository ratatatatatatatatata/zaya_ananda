/** Matrix of Destiny-ийн 1–22 эрчимд бууруулах дүрэм. */
export function reduceArcana(value: number): number {
  let result = Math.abs(Math.trunc(value));
  while (result > 22) {
    result = String(result).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return result || 22;
}

function yearEnergy(year: number): number {
  return reduceArcana(String(year).split("").reduce((sum, digit) => sum + Number(digit), 0));
}

export type MatrixPointKey =
  | "a" | "a2" | "a1" | "a3"
  | "b" | "b2" | "b1" | "b3"
  | "c" | "c2" | "c1"
  | "d" | "d2" | "d1"
  | "e" | "e1" | "e2"
  | "f" | "g" | "y" | "k";

export type DestinyMatrix = {
  day: number;
  month: number;
  year: number;
  points: Record<MatrixPointKey, number>;
  karmicTail: [number, number, number];
  talents: {
    spiritual: [number, number, number];
    maternal: [number, number, number];
    paternal: [number, number, number];
  };
  purposes: {
    personal: number;
    social: number;
    spiritual: number;
  };
};

/**
 * Matrix Destiny-ийн нийтэд тайлбарлагдсан 22 арканын үндсэн октаграмын тооцоо.
 * Цэгийн нэршлүүд нь диаграмын байрлалыг илэрхийлнэ.
 */
export function calculateDestinyMatrix(day: number, month: number, year: number): DestinyMatrix {
  const a = reduceArcana(day);
  const b = reduceArcana(month);
  const c = yearEnergy(year);
  const d = reduceArcana(a + b + c);
  const e = reduceArcana(a + b + c + d);

  const f = reduceArcana(a + b);
  const g = reduceArcana(b + c);
  const y = reduceArcana(c + d);
  const k = reduceArcana(d + a);

  const a1 = reduceArcana(a + e);
  const a2 = reduceArcana(a + a1);
  const a3 = reduceArcana(a1 + e);
  const b1 = reduceArcana(b + e);
  const b2 = reduceArcana(b + b1);
  const b3 = reduceArcana(b1 + e);
  const c1 = reduceArcana(c + e);
  const c2 = reduceArcana(c + c1);
  const d1 = reduceArcana(d + e);
  const d2 = reduceArcana(d + d1);
  const e1 = reduceArcana(e + d1);
  const e2 = reduceArcana(e + e1);

  const personal = e;
  const social = reduceArcana(f + y);
  const spiritual = reduceArcana(personal + social);
  const maternalInner = reduceArcana(b3 + f);

  return {
    day,
    month,
    year,
    points: { a, a2, a1, a3, b, b2, b1, b3, c, c2, c1, d, d2, d1, e, e1, e2, f, g, y, k },
    karmicTail: [d1, d2, d],
    talents: {
      spiritual: [b, b2, b1],
      maternal: [g, reduceArcana(g + maternalInner), maternalInner],
      paternal: [f, c2, c1],
    },
    purposes: { personal, social, spiritual },
  };
}
