# Deploy — GitHub + Supabase + Vercel

## 1) GitHub — код байршуулах
```bash
cd zaya-ananda
git init
git add .
git commit -m "Zaya's Ananda"
# github.com дээр шинэ хоосон repo үүсгэ, дараа нь:
git branch -M main
git remote add origin https://github.com/<taniiNer>/<repo>.git
git push -u origin main
```
(`.gitignore` нь `node_modules`, `.next`, `.env`, `data/db.json`-г оруулахгүй тул нууц зүйл, локал өгөгдөл GitHub-д орохгүй.)

## 2) Supabase — өгөгдлийн сан
1. https://supabase.com → New project үүсгэ (нэр, нууц үг, регион).
2. Зүүн талын **SQL Editor** → **New query** → `supabase/schema.sql` доторх бүх кодыг хуулж → **Run**.
   (users, cms_items, orders, messages хүснэгтүүд үүснэ.)
3. **Project Settings → API** дотроос дараах 3-ыг хуулж ав:
   - Project URL
   - `anon` public key
   - `service_role` key (нууц — зөвхөн серверт)

## 3) Орчны хувьсагч
`.env.example`-г хуулж `.env.local` болго, утгуудыг бөглө:
```
AUTH_SECRET=<урт санамсаргүй мөр>
ADMIN_EMAIL=<админ имэйл>            # хоосон бол нэвтэрсэн хэн ч админ
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 4) Vercel — байршуулах
1. https://vercel.com → **Add New → Project** → GitHub repo-оо сонго.
2. **Environment Variables** дээр дээрх бүх түлхүүрийг нэм.
3. **Deploy**.

## 5) Аппыг Supabase руу холбох (дараагийн алхам)
Одоо апп нь өгөгдлөө локал `data/db.json`-д хадгалдаг — энэ нь локал дээр ажиллах ч Vercel (serverless) дээр **тогтвортой хадгалагдахгүй**. Иймд `lib/db.ts`, `lib/repo.ts`-г Supabase-руу шилжүүлэх шаардлагатай.
👉 Та Supabase-ийн URL + keys (эсвэл GitHub repo линк)-ээ надад өгвөл би өгөгдлийн давхаргыг Supabase рүү залгаж (users, cms_items, orders, messages) production-д бэлэн болгоно.
