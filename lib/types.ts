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

export interface CmsItem {
  id: string;
  kind: "service" | "course" | "product" | "resource";
  title: string;
  summary: string;
  body?: string;
  price?: number;
  category?: string;
  mode?: "online" | "tankhim" | "both";
  image?: string;
  videoLessons?: number;
  students?: number;
  views?: number;
  teacherName?: string;
  teacherImage?: string;
  teacherInfo?: string;
  accessDays?: number;
  lessons?: { title: string; url: string }[];
  createdAt: string;
}
