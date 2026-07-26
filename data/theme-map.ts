import type { WorldKind } from "@/components/three/Worlds";

/** Агуулгад тулгуурласан дизайн зураглал.
 *  Сайт дээрх ангилал бүр өөрийн бэлгэдэл, өнгө, 3D ертөнцтэй —
 *  ингэснээр «лаа засал» гал, «бясалгал» бадам цэцэг, «аялал» ариун хөндий шиг
 *  тухайн зүйлийнхээ утгыг шууд илэрхийлнэ. */
export type GlyphKey =
  | "aura" | "scanner" | "matrix" | "shagai" | "advanced" | "candle"
  | "jet" | "ozone" | "destiny" | "lotus" | "mountain" | "scroll" | "film"
  | "stone" | "gift" | "default";

export type CategoryTheme = {
  glyph: GlyphKey;
  /** Тодруулах өнгө — гэрлийн туяа, хүрээ, бэлгэдэлд */
  from: string;
  to: string;
  world: WorldKind;
  /** Богино тайлбар — дэлгэрэнгүй хуудасны eyebrow */
  eyebrow: string;
};

export const CATEGORY_THEME: Record<string, CategoryTheme> = {
  "Аура оношилгоо":            { glyph: "aura",     from: "#2BC8BB", to: "#9B6EF0", world: "chamber",   eyebrow: "Аурын давхаргууд" },
  "Сканнер оношилгоо":         { glyph: "scanner",  from: "#5E8DE0", to: "#2BC8BB", world: "chamber",   eyebrow: "Биеийн энергийн уншилт" },
  "Тоон зурхайн матрикс":      { glyph: "matrix",   from: "#9B6EF0", to: "#5E8DE0", world: "library",   eyebrow: "Төрсөн огнооны тоон эрчим" },
  "Шагайн мэргэ":              { glyph: "shagai",   from: "#E3BE62", to: "#C98B4B", world: "pedestal",  eyebrow: "Эртний мэргэ төлөг" },
  "Advanced эмчилгээ":         { glyph: "advanced", from: "#2BC8BB", to: "#5FCFC4", world: "chamber",   eyebrow: "Гүн энергийн засал" },
  "Лаа засал үйлчилгээ":       { glyph: "candle",   from: "#F0B27A", to: "#E3BE62", world: "candle",    eyebrow: "Галын ариусгал" },
  "Жэт аппарат эмчилгээ":      { glyph: "jet",      from: "#6FA8DC", to: "#2BC8BB", world: "chamber",   eyebrow: "Аппаратын эмчилгээ" },
  "Озонатор эмчилгээ":         { glyph: "ozone",    from: "#5FCFC4", to: "#8FD9A8", world: "gallery",   eyebrow: "Озоны цэвэршүүлэлт" },
  "Хувь заяаны засал эмчилгээ":{ glyph: "destiny",  from: "#9B6EF0", to: "#E3BE62", world: "seed",      eyebrow: "Хувь заяаны утас" },
  "Бясалгалын сургалт":        { glyph: "lotus",    from: "#2BC8BB", to: "#7CDCD2", world: "lotus",     eyebrow: "Бясалгалын дадлага" },
  "Сүнслэг аялал":             { glyph: "mountain", from: "#F0B27A", to: "#5FCFC4", world: "sanctuary", eyebrow: "Ариун газрын аян" },
  "Зөвлөгөө":                  { glyph: "scroll",   from: "#E3BE62", to: "#9BC7F0", world: "archive",   eyebrow: "Мэргэдийн үг" },
  "Видео зөвлөгөө":            { glyph: "film",     from: "#9BC7F0", to: "#9B6EF0", world: "archive",   eyebrow: "Видео зөвлөгөө" },
};

/** Бүлгийн (эцэг ангилал) өнгө — жагсаалтын таб, толгойд */
export const GROUP_THEME: Record<string, { from: string; to: string; glyph: GlyphKey }> = {
  "Оношилгоо": { from: "#2BC8BB", to: "#5E8DE0", glyph: "aura" },
  "Зурхай ба Мэргэ": { from: "#9B6EF0", to: "#E3BE62", glyph: "matrix" },
  "Засал, Эмчилгээ": { from: "#F0B27A", to: "#2BC8BB", glyph: "candle" },
};

/** Төрөл бүрийн үндсэн загвар — ангилал тохирохгүй үед */
export const KIND_THEME: Record<string, CategoryTheme> = {
  service: { glyph: "advanced", from: "#2BC8BB", to: "#5E8DE0", world: "chamber", eyebrow: "Энергийн засал" },
  course:  { glyph: "lotus",    from: "#2BC8BB", to: "#7CDCD2", world: "lotus",   eyebrow: "Ариусахуйн үйл" },
  product: { glyph: "stone",    from: "#E3BE62", to: "#7CDCD2", world: "pedestal",eyebrow: "Энергийн хамгаалалт" },
  resource:{ glyph: "scroll",   from: "#E3BE62", to: "#9BC7F0", world: "archive", eyebrow: "Гэгээрлийн зам" },
  free:    { glyph: "gift",     from: "#7CDCD2", to: "#9B6EF0", world: "library", eyebrow: "Гэгээн бэлэг" },
};

/** Агуулгаас загвар сонгох — эхлээд ангилал, дараа нь төрөл */
export function themeFor(kind: string, category?: string | null): CategoryTheme {
  if (category && CATEGORY_THEME[category]) return CATEGORY_THEME[category];
  return KIND_THEME[kind] || KIND_THEME.service;
}
