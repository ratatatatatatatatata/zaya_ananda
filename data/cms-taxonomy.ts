import type { Locale } from "@/lib/types";

const Lx = (mn: string, en: string, ko: string, ja: string, zh: string): Record<Locale, string> => ({ mn, en, ko, ja, zh });

/** Үйлчилгээний ангилал — бүлэг + дэд ангилалтай. DB-д монгол нэрээр хадгална. */
export const SERVICE_GROUPS: { group: string; subs: string[] }[] = [
  { group: "Оношилгоо", subs: ["Аура оношилгоо", "Сканнер оношилгоо"] },
  { group: "Зурхай ба Мэргэ", subs: ["Тоон зурхайн матрикс", "Шагайн мэргэ"] },
  { group: "Засал, Эмчилгээ", subs: ["Advanced эмчилгээ", "Лаа засал үйлчилгээ", "Жэт аппарат эмчилгээ", "Озонатор эмчилгээ", "Хувь заяаны засал эмчилгээ"] },
];

/** Сургалтын ангилал */
export const COURSE_CATS = ["Бясалгалын сургалт", "Сүнслэг аялал"];

/** Ангилал/бүлгийн 5 хэлний орчуулга (DB-ийн монгол нэрээр түлхүүрлэнэ) */
export const CAT_I18N: Record<string, Record<Locale, string>> = {
  "Оношилгоо": Lx("Оношилгоо", "Diagnostics", "진단", "診断", "诊断"),
  "Аура оношилгоо": Lx("Аура оношилгоо", "Aura Diagnostics", "오라 진단", "オーラ診断", "气场诊断"),
  "Сканнер оношилгоо": Lx("Сканнер оношилгоо", "Scanner Diagnostics", "스캐너 진단", "スキャナー診断", "扫描诊断"),
  "Зурхай ба Мэргэ": Lx("Зурхай ба Мэргэ", "Astrology & Divination", "점성술과 점술", "占星術と占い", "占星与占卜"),
  "Тоон зурхайн матрикс": Lx("Тоон зурхайн матрикс", "Numerology Matrix", "수비학 매트릭스", "数秘術マトリックス", "数字命理矩阵"),
  "Шагайн мэргэ": Lx("Шагайн мэргэ", "Ankle-bone Divination", "샤가이 점술", "シャガイ占い", "羊拐占卜"),
  "Засал, Эмчилгээ": Lx("Засал, Эмчилгээ", "Healing & Therapy", "치유와 치료", "ヒーリングと治療", "疗愈与治疗"),
  "Advanced эмчилгээ": Lx("Advanced эмчилгээ", "Advanced Therapy", "어드밴스드 테라피", "アドバンス治療", "高级治疗"),
  "Лаа засал үйлчилгээ": Lx("Лаа засал үйлчилгээ", "Candle Healing", "촛불 힐링", "キャンドルヒーリング", "蜡烛疗愈"),
  "Жэт аппарат эмчилгээ": Lx("Жэт аппарат эмчилгээ", "Jet Device Therapy", "제트 기기 치료", "ジェット機器治療", "喷射仪器治疗"),
  "Озонатор эмчилгээ": Lx("Озонатор эмчилгээ", "Ozone Therapy", "오존 테라피", "オゾン治療", "臭氧治疗"),
  "Хувь заяаны засал эмчилгээ": Lx("Хувь заяаны засал эмчилгээ", "Destiny Healing", "운명 힐링", "運命ヒーリング", "命运疗愈"),
  "Бясалгалын сургалт": Lx("Бясалгалын сургалт", "Meditation Courses", "명상 강좌", "瞑想講座", "冥想课程"),
  "Сүнслэг аялал": Lx("Сүнслэг аялал", "Spiritual Journeys", "영적 여행", "スピリチュアルな旅", "灵性之旅"),
  "Зөвлөгөө": Lx("Зөвлөгөө", "Advice", "조언", "アドバイス", "建议"),
  "Видео зөвлөгөө": Lx("Видео зөвлөгөө", "Video Advice", "영상 조언", "動画アドバイス", "视频建议"),
};

export function catLabel(cat: string | undefined, lang: Locale): string {
  if (!cat) return "";
  return CAT_I18N[cat]?.[lang] || cat;
}

/** Сэтгэл санааны сонголтууд (Сэтгэлийн туяа) */
export const MOODS: { key: string; emoji: string; label: Record<Locale, string> }[] = [
  { key: "stress", emoji: "😮‍💨", label: Lx("Стресстэй байна", "Feeling stressed", "스트레스를 받아요", "ストレスを感じる", "感到压力") },
  { key: "tired", emoji: "😴", label: Lx("Ядарч сульдсан", "Tired & drained", "지치고 피곤해요", "疲れている", "疲惫不堪") },
  { key: "anxious", emoji: "😟", label: Lx("Түгшүүртэй байна", "Feeling anxious", "불안해요", "不安を感じる", "感到焦虑") },
  { key: "sad", emoji: "🌧", label: Lx("Сэтгэл гутарсан", "Feeling down", "우울해요", "気分が沈む", "情绪低落") },
  { key: "lost", emoji: "🧭", label: Lx("Чиглэлээ алдсан", "Feeling lost", "방향을 잃었어요", "道に迷っている", "迷失方向") },
  { key: "energy", emoji: "⚡", label: Lx("Эрч хүч хэрэгтэй", "Need energy", "에너지가 필요해요", "エネルギーが欲しい", "需要能量") },
  { key: "peace", emoji: "🕊", label: Lx("Амар амгалан хүсэж байна", "Seeking peace", "평온을 원해요", "安らぎを求めている", "渴望平静") },
  { key: "love", emoji: "💗", label: Lx("Хайр, урам хэрэгтэй", "Need love & support", "사랑과 위로가 필요해요", "愛と励ましが欲しい", "需要爱与鼓励") },
  { key: "growth", emoji: "🌱", label: Lx("Өөрийгөө хөгжүүлмээр байна", "Want to grow", "성장하고 싶어요", "成長したい", "想要成长") },
];
