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
  lessons?: { title: string; path?: string; url?: string; quality?: string; subtitles?: string }[];
  moods?: string[];
  i18n?: CmsTranslations;
  createdAt: string;
}
