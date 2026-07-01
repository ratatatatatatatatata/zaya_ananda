# Zaya's Ananda Center — Sitemap

## Public
- `/` — Нүүр (hero, trust, services+filters, courses, how-it-works, about, shop, events, testimonials, CTA)
- `/services` — Үйлчилгээ (listing + filters)
- `/services/[slug]` — Үйлчилгээний дэлгэрэнгүй (booking, instructor, FAQ, disclaimer)
- `/courses` — Сургалт (listing)
- `/courses/[slug]` — Сургалтын дэлгэрэнгүй (curriculum, certificate, QPay)
- `/shop` — Дэлгүүр (products)
- `/shop/[slug]` — Бүтээгдэхүүний дэлгэрэнгүй
- `/resources` — Зөвлөгөө, мэдээлэл (events, news, articles)
- `/about` — Бидний тухай (founder, team, mission, FAQ)
- `/contact` — Холбоо барих
- `/cart` → `/checkout` — Сагс ба төлбөр (Cart → Customer info → Delivery/booking → QPay/bank → Confirmation → Success)

## Account (auth required)
- `/login`, `/register`
- `/account` — Хэрэглэгчийн булан / dashboard
  - Миний сургалтууд · Үзсэн хичээлийн явц · Миний цаг захиалгууд · Миний захиалгууд · Төлбөрийн түүх · Хадгалсан бүтээгдэхүүн · Профайл · Нууц үг · Нэвтэрсэн төхөөрөмжүүд · Тусламж

## Planned (next phase)
- `/learn/[course]` — Хамгаалалттай видео хичээл (protected player, watermark, sidebar, progress, notes, PDF)
- `/admin` — Админ удирдлага (users, teachers, services, slots, bookings, courses, videos, products, stock, orders, QPay, bank verify, banners, reviews, events, articles, discounts, reports)

## API
- `/api/auth/{register,login,logout,me}` · `/api/account` (PATCH) · `/api/orders` · `/api/contact`
