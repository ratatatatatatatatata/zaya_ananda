export type Locale = "mn" | "en" | "ko" | "ja" | "zh";
export type L = Record<Locale, string>;
export type LA = Record<Locale, string[]>;

export type Tone = "violet" | "gold" | "jade" | "rose" | "sky";

export interface Service {
  id: string;
  slug: string;
  title: L;
  short: L;
  description: L;
  price: number;
  duration: L;
  category: L;
  glyph: string;
  tone: Tone;
  highlights: LA;
  instructor?: string;
  deliveryType?: L;
  tags?: string[];
  featured?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: L;
  short: L;
  description: L;
  price: number;
  level: L;
  lessons: number;
  duration: L;
  format: L;
  mode?: "online" | "tankhim" | "both";
  category: L;
  glyph: string;
  tone: Tone;
  highlights: LA;
  outcomes: LA;
  instructor?: string;
  students?: number;
  certificate?: boolean;
  startDate?: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: L;
  short: L;
  description: L;
  price: number;
  oldPrice?: number;
  category: L;
  glyph: string;
  tone: Tone;
  inStock: boolean;
  badge?: L;
  material?: L;
  meaning?: L;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: L;
  quote: L;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: L;
  bio: L;
  glyph: string;
  tone: Tone;
}

export interface Faq {
  q: L;
  a: L;
}

export type ItemKind = "service" | "course" | "product";

export interface CartItem {
  kind: ItemKind;
  slug: string;
  title: L;
  price: number;
  qty: number;
  tone: Tone;
  glyph: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isAdmin?: boolean;
  /** Зөвхөн ADMIN_EMAIL эзэмшигч — бусдад админ эрх олгож чадна */
  isSuper?: boolean;
}

export interface User extends PublicUser {
  passwordHash: string;
}

export interface OrderItem {
  kind: ItemKind;
  slug: string;
  title: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  userId: string | null;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "cancelled";
  expiresAt?: string;
  customer: { name: string; email: string; phone: string; note?: string };
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

/** Хэрэглэгчид очих мэдэгдэл */
export interface Notification {
  id: string;
  userId: string;
  kind: "reply" | "expiry" | "booking" | "system";
  title: string;
  body?: string | null;
  link?: string | null;
  dedupeKey?: string | null;
  read: boolean;
  createdAt: string;
}

/** Энергийн заслын цаг захиалга */
export interface ServiceBooking {
  id: string;
  userId?: string | null;
  itemId: string;
  serviceName: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:00 — 10..17 */
  time: string;
  name: string;
  phone: string;
  email?: string;
  note?: string | null;
  status: "pending" | "confirmed" | "done" | "cancelled";
  createdAt: string;
}

/** Сүнслэг аяллын захиалга */
export interface JourneyBooking {
  id: string;
  userId?: string | null;
  slug: string;
  journeyName: string;
  /** Аялах өдөр — YYYY-MM-DD */
  date: string;
  people: number;
  name: string;
  phone: string;
  email: string;
  note?: string | null;
  status: "pending" | "confirmed" | "done" | "cancelled";
  createdAt: string;
}

/** Аяллын дараах сэтгэгдэл */
export interface JourneyReview {
  id: string;
  userId?: string | null;
  slug: string;
  name: string;
  rating: number;
  text: string;
  /** Админаас сонгосон эсэх — зөвхөн сонгогдсон нь нийтэд харагдана */
  featured: boolean;
  createdAt: string;
}

export interface EventItem {
  id: string;
  type: L;
  title: L;
  date: string;
}

export interface StaffMember {
  image?: string;
  name: string;
  role?: string;
  info?: string;
  /** Зургийн босоо байрлал 0–100 (0 = дээд хэсэг, 100 = доод хэсэг) */
  focus?: number;
}

export interface TeacherPreset {
  name: string;
  image?: string;
  role?: string;
  info?: string;
  /** Зургийн босоо байрлал 0–100 (0 = дээд хэсэг, 100 = доод хэсэг) */
  focus?: number;
}

export type CmsTranslations = Partial<Record<Locale, { title?: string; summary?: string; body?: string; navLabel?: string }>>;

export interface BankInfo {
  bankName?: string;
  account?: string;
  holder?: string;
}

export interface SiteSettings {
  logo?: string;
  aboutTitle?: string;
  aboutBody?: string;
  aboutVideo?: string;
  /** Хуудас бүрийн толгойн богино бичлэг — түлхүүр: home/services/courses/ayalal/shop/about/resources/item */
  heroVideos?: Record<string, string>;
  /** Толгойн дэвсгэр — бичлэг эсвэл зураг. Түлхүүр: hero slot */
  heroMedia?: Record<string, { kind: "video" | "image"; src: string }>;
  /** Нүүр хуудасны «Зурхай» слайдерын картууд */
  zurhaiCards?: { emoji: string; title: string; desc: string; href: string }[];
  /** Админаас нэмсэн нэмэлт мэдрэмжүүд (Сэтгэлийн туяа) */
  customMoods?: { key: string; emoji: string; label: string }[];
  /** Зурхайн тайллын гар бичвэрүүд — түлхүүр: zodiac:leo, life:7, arcana:12, day:mon, element:fire */
  zurhaiRules?: { key: string; text: string }[];
  /** Холбоо барих мэдээлэл — админаас шинэчилнэ */
  contact?: { phone?: string; email?: string; address?: string; hours?: string; mapQuery?: string };
  /** Энергийн заслын цаг захиалгын урьдчилгаа төлбөр (₮). 0 бол урьдчилгаа авахгүй. */
  servicePrepay?: number;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  team?: StaffMember[];
  teachers?: TeacherPreset[];
  bank?: BankInfo;
}

export interface SitePage {
  id: string;
  title: string;
  navLabel?: string;
  body?: string;
  image?: string;
  video?: string;
  position?: number;
  i18n?: CmsTranslations;
  createdAt?: string;
}

export interface CmsItem {
  id: string;
  kind: "service" | "course" | "product" | "resource" | "promo" | "free";
  title: string;
  summary: string;
  body?: string;
  price?: number;
  category?: string;
  mode?: "online" | "tankhim" | "both";
  image?: string;
  images?: string[];
  link?: string;
  videoLessons?: number;
  students?: number;
  views?: number;
  teacherName?: string;
  teacherImage?: string;
  teacherInfo?: string;
  accessDays?: number;
  /** Сургалтын түвшин — anhan | dund | gunzgii | master */
  level?: string;
  /** «Дараа нь юу үзэх вэ» зөвлөмж */
  nextNote?: string;
  /** Дараагийн сургалтын id */
  nextItemId?: string;
  lessons?: { title: string; path?: string; url?: string; quality?: string; subtitles?: string }[];
  moods?: string[];
  i18n?: CmsTranslations;
  createdAt: string;
}
