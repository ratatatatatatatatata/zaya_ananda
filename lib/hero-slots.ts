/** Толгойн бичлэг тавигдах боломжтой хуудсууд (client-safe) */
export const HERO_SLOTS = [
  { key: "home", label: "Нүүр хуудас" },
  { key: "services", label: "Энергийн засал" },
  { key: "courses", label: "Ариусахуйн үйл" },
  { key: "ayalal", label: "Сүнслэг аялал" },
  { key: "shop", label: "Энергийн хамгаалалт" },
  { key: "gift", label: "Гэгээн бэлэг" },
  { key: "merge", label: "Зурхай" },
  { key: "account", label: "Хувийн булан (профайл)" },
  { key: "resources", label: "Гэгээрлийн зам" },
  { key: "about", label: "Бидний тухай" },
  { key: "item", label: "Дэлгэрэнгүй хуудас" },
  { key: "band", label: "Дундах ишлэлийн зурвас" },
] as const;

export type HeroSlot = (typeof HERO_SLOTS)[number]["key"];
