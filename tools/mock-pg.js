// Minimal PostgREST-compatible mock so the app renders locally without Supabase egress.
const http = require("http");

const ph = (a, b, label) =>
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/>
      </linearGradient>
      <radialGradient id="r" cx="30%" cy="25%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".55"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <rect width="1200" height="800" fill="url(#r)"/>
      <circle cx="900" cy="620" r="240" fill="#ffffff" opacity=".10"/>
      <circle cx="240" cy="180" r="130" fill="#ffffff" opacity=".12"/>
      <text x="60" y="740" font-family="Georgia,serif" font-size="44" fill="#ffffff" opacity=".85">${label}</text>
    </svg>`
  ).toString("base64");

const D = (n) => new Date(Date.UTC(2026, 5, n, 9, 0, 0)).toISOString();

const svc = (id, title, summary, category, price, day, a, b) => ({
  id, kind: "service", title, summary, category, price, mode: "tankhim",
  body: `<p>${summary}</p><p>Манай мэргэжлийн багш нар танд хувийн онцлогт тохирсон зөвлөгөө, дэмжлэг үзүүлнэ. Уулзалт ойролцоогоор 60–90 минут үргэлжилнэ.</p><ul><li>Урьдчилсан ярилцлага, зорилго тодруулах</li><li>Үндсэн үйл ажиллагаа</li><li>Дараах зөвлөмж, дасгал</li></ul>`,
  image: ph(a, b, title), teacher_name: "Заяа Бат-Эрдэнэ", views: 400 + day * 37,
  created_at: D(day),
});

const crs = (id, title, summary, category, price, day, lessons, students, a, b) => ({
  id, kind: "course", title, summary, category, price, mode: "online",
  body: `<p>${summary}</p><p>Хичээлүүд бичлэгээр бэлэн тул та өөрийн хурдаар үзэх боломжтой. Дасгал бүрийг өдөр тутмын амьдралдаа шууд хэрэглэж эхэлнэ.</p>`,
  image: ph(a, b, title), video_lessons: lessons, students, views: students * 6,
  teacher_name: "Заяа Бат-Эрдэнэ", access_days: 180, created_at: D(day),
  moods: ["peace", "growth"],
});

const prd = (id, title, summary, price, day, a, b) => ({
  id, kind: "product", title, summary, price,
  body: `<p>${summary}</p><p>Гар аргаар бэлтгэсэн, чанарын шалгуур хангасан бүтээгдэхүүн. Улаанбаатар хотод хүргэлттэй.</p>`,
  image: ph(a, b, title), images: [ph(a, b, title), ph(b, a, title)],
  created_at: D(day),
});

const rows = {
  users: [
    { id: "u1", name: "Туруу", email: "turuu.naranbaatar0711@gmail.com", phone: "94205252", created_at: D(1) },
    { id: "u2", name: "Оюунцэцэг", email: "oyunaa@example.com", phone: "99112233", created_at: D(4) },
  ],
  messages: [
    { id: "m1", name: "Болд", email: "bold@example.com", phone: "99001122", subject: "Сургалтын талаар", message: "Дараагийн бясалгалын сургалт хэзээ эхлэх вэ?", created_at: D(12) },
  ],
  orders: [
    { id: "o1", user_id: "u1", items: [{ kind: "course", title: "Энерги-мэдээллийн анхан шат", price: 240000, qty: 1 }], total: 240000, status: "paid", customer: { name: "Туруу", email: "turuu@example.com", phone: "94205252" }, created_at: D(10) },
  ],
  pages: [
    { id: "pg1", title: "Түгээмэл асуулт", nav_label: "Асуулт хариулт", position: 1, body: "<p>Хамгийн түгээмэл асуултуудын хариулт.</p>", created_at: D(2) },
  ],
  site_settings: [
    {
      id: "main",
      about_title: "Бидний тухай",
      about_body:
        "<p>Zaya's Ananda төв нь далд ухамсар, энерги-мэдээллийн судалгаанд суурилсан эрүүл мэнд, дотоод тэнцвэрийн төв юм. Бид 2015 оноос хойш мянга мянган хүнд өөрийгөө таньж, дотоод амар амгаланг олоход тусалсан.</p><p>Манай багш нар олон улсын сургалтад хамрагдсан, туршлагатай мэргэжилтнүүд.</p>",
      facebook: "https://facebook.com", instagram: "https://instagram.com", youtube: "https://youtube.com",
      bank: { bankName: "Хаан банк", account: "5304611250", holder: "Заяа Бат-Эрдэнэ" },
      team: [
        { name: "Заяа Бат-Эрдэнэ", role: "Үүсгэн байгуулагч, багш", image: ph("#16AFA4", "#0C5C57", ""), info: "20 гаруй жилийн туршлагатай энерги эмчилгээний мастер." },
        { name: "Сарантуяа", role: "Бясалгалын багш", image: ph("#DFBC5E", "#B8912F", ""), info: "Бясалгал, амьсгалын дасгалын чиглэлээр мэргэшсэн." },
      ],
      teachers: [
        { name: "Заяа Бат-Эрдэнэ", role: "Үүсгэн байгуулагч, багш", image: ph("#16AFA4", "#0C5C57", ""), info: "20 гаруй жилийн туршлагатай энерги эмчилгээний мастер." },
      ],
      updated_at: D(20),
    },
  ],
  cms_items: [
    svc("s1", "Аура оношилгоо", "Таны биеийн энергийн талбарыг хэмжиж, тэнцвэргүй бүсийг тодорхойлно.", "Аура оношилгоо", 80000, 3, "#16AFA4", "#0C5C57"),
    svc("s2", "Сканнер оношилгоо", "Орчин үеийн төхөөрөмжөөр бүх эрхтний ерөнхий байдлыг үнэлнэ.", "Сканнер оношилгоо", 120000, 5, "#5E8DE0", "#274C9A"),
    svc("s3", "Тоон зурхайн матрикс", "Төрсөн огноон дээр суурилсан хувь заяаны зураглал, чиглүүлэг.", "Тоон зурхайн матрикс", 100000, 7, "#9B6EF0", "#6B40B4"),
    svc("s4", "Лаа засал үйлчилгээ", "Уламжлалт лаа заслаар сөрөг энергийг цэвэрлэх зан үйл.", "Лаа засал үйлчилгээ", 150000, 9, "#DFBC5E", "#B8912F"),
    svc("s5", "Озонатор эмчилгээ", "Озоны эмчилгээгээр бие махбодыг цэвэршүүлэх, сэргээх.", "Озонатор эмчилгээ", 90000, 11, "#34BBA2", "#14806C"),
    svc("s6", "Хувь заяаны засал эмчилгээ", "Амьдралын том шилжилтэд дэмжлэг үзүүлэх гүнзгий засал.", "Хувь заяаны засал эмчилгээ", 250000, 13, "#F09CBC", "#E97BA8"),
    crs("c1", "Энерги-мэдээллийн анхан шат", "Энергийн үндсэн ойлголт, өөрийгөө цэвэрлэх энгийн аргууд.", "Бясалгалын сургалт", 240000, 6, 12, 340, "#16AFA4", "#5E8DE0"),
    crs("c2", "21 өдрийн бясалгал", "Өдөр бүр 15 минут — гурван долоо хоногт тогтвортой дадал.", "Бясалгалын сургалт", 120000, 8, 21, 620, "#9B6EF0", "#16AFA4"),
    crs("c3", "Сүнслэг аялал: Дотоод замнал", "Гүн бясалгал, дүрслэлийн аргаар дотоод ертөнцөө нээх.", "Сүнслэг аялал", 320000, 10, 9, 180, "#DFBC5E", "#9B6EF0"),
    crs("c4", "Амьсгалын урлаг", "Стресс тайлах, эрч хүч сэргээх амьсгалын дадлууд.", "Бясалгалын сургалт", 90000, 14, 8, 410, "#34BBA2", "#3B6FD4"),
    prd("p1", "Ном: Далд ухамсрын түлхүүр", "Далд ухамсрын үндсэн зарчмуудыг энгийн хэлээр тайлбарласан гарын авлага.", 35000, 4, "#DFBC5E", "#B8912F"),
    prd("p2", "Ариун утлага", "Байшин, ажлын орчныг цэвэрлэх байгалийн гаралтай утлага.", 25000, 6, "#34BBA2", "#14806C"),
    prd("p3", "Аметист чулуун бөмбөлөг", "Тайван байдал, хамгаалалтын шинжтэй байгалийн аметист.", 85000, 8, "#9B6EF0", "#6B40B4"),
    prd("p4", "Бясалгалын дэвсгэр", "Зузаан, тав тухтай, байгалийн материалаар хийсэн дэвсгэр.", 120000, 12, "#5E8DE0", "#274C9A"),
    prd("p5", "Лаа багц — Тэнцвэр", "Гар аргаар цутгасан, ургамлын тосон үнэртэй лааны багц.", 45000, 15, "#F09CBC", "#E97BA8"),
    { id: "r1", kind: "resource", title: "Өглөөний 10 минутын дасгал", summary: "Өдрөө тайван эхлүүлэх энгийн дараалал.", category: "Зөвлөгөө", body: "<p>Өглөө сэрээд хийх богино дараалал.</p>", image: ph("#16AFA4", "#9B6EF0", "Зөвлөгөө"), created_at: D(5) },
    { id: "r2", kind: "resource", title: "Стресс тайлах амьсгал", summary: "4-7-8 амьсгалын техник хэрхэн ажилладаг вэ.", category: "Видео зөвлөгөө", body: "<p>Амьсгалын техникийн тайлбар.</p>", image: ph("#5E8DE0", "#16AFA4", "Зөвлөгөө"), created_at: D(9) },
    { id: "r3", kind: "resource", title: "Унтахын өмнөх зан үйл", summary: "Чанартай нойрны төлөө оройн 20 минут.", category: "Зөвлөгөө", body: "<p>Оройн зан үйлийн жишээ.</p>", image: ph("#9B6EF0", "#274C9A", "Зөвлөгөө"), created_at: D(13) },
    { id: "f1", kind: "free", title: "Үнэгүй: Эхний алхам бясалгал", summary: "Шинэ эхлэгчдэд зориулсан 12 минутын бясалгал.", body: "<p>Үнэгүй нээлттэй хичээл.</p>", image: ph("#DFBC5E", "#16AFA4", "Гэгээн бэлэг"), created_at: D(7) },
    { id: "f2", kind: "free", title: "Үнэгүй: Талархлын дадал", summary: "Өдөр бүрийн талархлын богино дасгал.", body: "<p>Үнэгүй нээлттэй хичээл.</p>", image: ph("#34BBA2", "#DFBC5E", "Гэгээн бэлэг"), created_at: D(11) },
    { id: "pr1", kind: "promo", title: "Зуны хөнгөлөлт — Бүх сургалт 20%", summary: "6-р сарын турш бүх онлайн сургалтад хөнгөлөлт үзүүлнэ.", link: "/courses", image: ph("#16AFA4", "#9B6EF0", "Урамшуулал"), created_at: D(2) },
  ],
};

function applyQuery(list, qs) {
  let out = [...list];
  for (const [k, v] of qs.entries()) {
    if (k === "select" || k === "limit" || k === "order" || k === "offset") continue;
    const m = /^(eq|neq|gt|lt|gte|lte)\.(.*)$/.exec(v);
    if (!m) continue;
    const [, op, raw] = m;
    out = out.filter((r) => {
      const cur = r[k];
      if (op === "eq") return String(cur) === raw;
      if (op === "neq") return String(cur) !== raw;
      return true;
    });
  }
  const order = qs.get("order");
  if (order) {
    for (const part of order.split(",").reverse()) {
      const [col, dir] = part.split(".");
      out.sort((a, b) => {
        const x = a[col] ?? "", y = b[col] ?? "";
        const c = x < y ? -1 : x > y ? 1 : 0;
        return dir === "desc" ? -c : c;
      });
    }
  }
  const limit = qs.get("limit");
  if (limit) out = out.slice(0, Number(limit));
  return out;
}

http
  .createServer((req, res) => {
    const u = new URL(req.url, "http://localhost");
    const m = /^\/rest\/v1\/([a-z_]+)$/.exec(u.pathname);
    res.setHeader("Content-Type", "application/json");
    if (!m) {
      res.statusCode = 404;
      return res.end("[]");
    }
    const table = m[1];
    if (!rows[table]) rows[table] = [];
    if (req.method === "GET") return res.end(JSON.stringify(applyQuery(rows[table], u.searchParams)));
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const payload = body ? JSON.parse(body) : {};
      if (req.method === "POST") {
        rows[table].push(payload);
        return res.end(JSON.stringify([payload]));
      }
      if (req.method === "PATCH") {
        const found = applyQuery(rows[table], u.searchParams)[0];
        if (found) Object.assign(found, payload);
        return res.end(JSON.stringify(found ? [found] : []));
      }
      if (req.method === "DELETE") {
        const kill = new Set(applyQuery(rows[table], u.searchParams).map((r) => r.id));
        rows[table] = rows[table].filter((r) => !kill.has(r.id));
        return res.end("[]");
      }
      res.end("[]");
    });
  })
  .listen(54321, () => console.log("mock postgrest on :54321"));
