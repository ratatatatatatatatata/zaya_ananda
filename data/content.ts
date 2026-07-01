import type { Service, Course, Product, Testimonial, TeamMember, Faq, L, LA, Tone, EventItem } from "@/lib/types";

const l = (mn: string, en: string, ko: string, ja: string, zh: string): L => ({ mn, en, ko, ja, zh });
const la = (mn: string[], en: string[], ko: string[], ja: string[], zh: string[]): LA => ({ mn, en, ko, ja, zh });

export const siteConfig = {
  name: "Zaya's Ananda",
  tagline: l(
    "Далд ухамсар, энерги-мэдээллийн судалгааны төв",
    "Center for subconscious & energy-information research",
    "잠재의식·에너지 정보 연구 센터",
    "潜在意識・エネルギー情報研究センター",
    "潜意识与能量信息研究中心"
  ),
  description: l(
    "Дотоод тэнцвэр, ухамсрын сэрэл, өөрийгөө танихуйн аялалд хамтдаа. Биоэнерги засал, медитаци, онлайн сургалт болон тусгай бүтээгдэхүүний цогц төв.",
    "Together on a journey of inner balance, awakening and self-discovery. A complete center for bioenergy healing, meditation, online courses and curated products.",
    "내면의 균형, 각성, 자기 발견의 여정을 함께. 바이오에너지 힐링, 명상, 온라인 강좌와 엄선된 제품의 종합 센터.",
    "心の調和・目覚め・自己探求の旅をともに。バイオエネルギー、瞑想、オンライン講座、厳選製品の総合センター。",
    "一起踏上内在平衡、觉醒与自我探索之旅。集生物能量疗愈、冥想、在线课程与精选产品于一体的中心。"
  ),
  phone: "7202-2002",
  email: "zayasanandacentre@gmail.com",
  address: l(
    "Улаанбаатар хот, Хан-Уул дүүрэг, Намуун төгөл хотхон, 8Б",
    "Namuun Tögöl residence 8B, Khan-Uul District, Ulaanbaatar",
    "울란바토르 한올구 나문투굴 단지 8B",
    "ウランバートル ハンウール区 ナムーン・トゥグル団地 8B",
    "乌兰巴托 汗乌拉区 纳穆恩图格勒小区 8Б"
  ),
  mapQuery: "WW49+4X3 Mahatma Gandhi St, HUD - 15 khoroo, Ulaanbaatar 17010, Mongolia",
  workingHours: l(
    "Даваа–Бямба, 09:00–19:00",
    "Mon–Sat, 09:00–19:00",
    "월–토, 09:00–19:00",
    "月–土 9:00–19:00",
    "周一至周六 09:00–19:00"
  ),
  social: { facebook: "#", instagram: "#", youtube: "#" },
};

export const services: Service[] = [];

export const courses: Course[] = [];

export const products: Product[] = [];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Б. Оюунцэцэг", rating: 5,
    role: l("Сургалтын төгсөгч", "Course graduate", "수강 수료생", "講座修了生", "课程毕业学员"),
    quote: l(
      "Суурь сургалт миний өдөр тутмын амьдралд тайван байдлыг авчирсан. Багш нар маш дэмжлэгтэй, ойлгомжтой заадаг.",
      "The foundation course brought calm into my daily life. The teachers are supportive and explain clearly.",
      "기초 과정은 제 일상에 평온을 가져다주었습니다. 선생님들이 매우 친절하고 이해하기 쉽게 가르칩니다.",
      "基礎講座は日常に落ち着きをもたらしてくれました。先生方はとても親身で分かりやすいです。",
      "基础课程为我的日常带来了平静。老师们非常支持，讲解清晰。") },
  { id: "t2", name: "Г. Энхболд", rating: 5,
    role: l("Үйлчлүүлэгч", "Client", "고객", "お客様", "客户"),
    quote: l(
      "Энергийн цэвэрлэгээний дараа дотроо хөнгөрсөн, сэргэг мэдрэмж төрсөн. Орчин нь тайван, нягт нямбай.",
      "After the energy clearing I felt lighter and refreshed. The space is calm and well cared for.",
      "에너지 정화 후 한결 가벼워지고 상쾌해졌습니다. 공간이 차분하고 정성스럽습니다.",
      "エネルギークリアリングの後、心が軽くなり、すっきりしました。空間は穏やかで丁寧です。",
      "能量净化之后我感到轻松、焕然一新。环境安静而细致。") },
  { id: "t3", name: "С. Номин", rating: 5,
    role: l("Медитацийн хөтөлбөрийн оролцогч", "Meditation program participant", "명상 프로그램 참가자", "瞑想プログラム参加者", "冥想课程学员"),
    quote: l(
      "21 өдрийн хөтөлбөр завгүй хуваарьт минь яг таарсан. Богино дасгалууд боловч үр дүн нь мэдрэгдэхүйц.",
      "The 21-day program fit my busy schedule perfectly. Short practices, but the results are noticeable.",
      "21일 프로그램은 바쁜 일정에 딱 맞았습니다. 짧은 연습이지만 효과가 분명합니다.",
      "21日間のプログラムは忙しい私にぴったりでした。短い練習でも効果を実感できます。",
      "21天课程非常适合我忙碌的日程。练习虽短，效果却很明显。") },
  { id: "t4", name: "Д. Анужин", rating: 5,
    role: l("Коучинг үйлчлүүлэгч", "Coaching client", "코칭 고객", "コーチング利用者", "教练客户"),
    quote: l(
      "Хувийн зөвлөгөөний дараа зорилго маань тодорхой болж, итгэлтэй болсон. Үнэхээр чиглүүлэгч уулзалт байлаа.",
      "After the personal consultation my goals became clear and I felt confident. It was truly a guiding session.",
      "개인 상담 후 목표가 분명해지고 자신감이 생겼습니다. 정말 길잡이가 되는 시간이었습니다.",
      "個人相談の後、目標が明確になり自信が持てました。まさに導きとなるセッションでした。",
      "个人咨询之后，我的目标变得清晰，也更有信心了。这真是一次给予方向的会谈。") },
];

export const team: TeamMember[] = [
  { id: "m1", name: "Заяа", glyph: "✶", tone: "violet",
    role: l("Үүсгэн байгуулагч, ахлах зөвлөх", "Founder & lead guide", "창립자 & 수석 가이드", "創設者・主任ガイド", "创始人兼首席指导"),
    bio: l(
      "Олон жилийн туршлагатай, далд ухамсар ба энерги-мэдээллийн чиглэлээр сургалт, зөвлөгөө явуулдаг.",
      "With many years of experience, she leads courses and guidance in the subconscious and energy-information field.",
      "오랜 경험을 바탕으로 잠재의식과 에너지-정보 분야의 강좌와 상담을 이끕니다.",
      "長年の経験を持ち、潜在意識とエネルギー情報の分野で講座と相談を行っています。",
      "拥有多年经验，主理潜意识与能量信息领域的课程与咨询。") },
  { id: "m2", name: "Тэмүүлэн", glyph: "☾", tone: "sky",
    role: l("Медитаци, амьсгалын дасгалын багш", "Meditation & breathwork teacher", "명상·호흡 강사", "瞑想・呼吸法講師", "冥想与呼吸导师"),
    bio: l(
      "Медитаци, амьсгалын дасгалаар анхан шатнаас ахисан түвшний хичээл удирддаг.",
      "Leads meditation and breathwork classes from beginner to advanced levels.",
      "입문부터 심화까지 명상과 호흡 수업을 진행합니다.",
      "初級から上級まで瞑想と呼吸法のクラスを担当します。",
      "教授从入门到进阶的冥想与呼吸课程。") },
  { id: "m3", name: "Сараа", glyph: "✷", tone: "jade",
    role: l("Биоэнерги заслын мэргэжилтэн", "Bioenergy healing specialist", "바이오에너지 힐링 전문가", "バイオエネルギー専門家", "生物能量疗愈专家"),
    bio: l(
      "Биоэнерги засал, чакра тэнцвэржүүлэлтийн чиглэлээр үйлчлүүлэгчидтэй ажилладаг.",
      "Works with clients in bioenergy healing and chakra balancing.",
      "바이오에너지 힐링과 차크라 밸런싱으로 고객과 함께합니다.",
      "バイオエネルギー・ヒーリングとチャクラ・バランシングでお客様に寄り添います。",
      "在生物能量疗愈与脉轮平衡领域为客户服务。") },
];

export const faqs: Faq[] = [
  { q: l("Үйлчилгээнд хэрхэн цаг авах вэ?", "How do I book a service?", "서비스 예약은 어떻게 하나요?", "サービスの予約方法は？", "如何预约服务？"),
    a: l("Үйлчилгээний хуудаснаас сонгож, сагсанд нэмээд захиалга баталгаажуулна. Бид утсаар эсвэл имэйлээр холбогдож тодорхой цагийг тохирно.", "Choose from the services page, add to cart and confirm your order. We'll contact you by phone or email to arrange a time.", "서비스 페이지에서 선택해 장바구니에 담고 주문을 확정하세요. 전화나 이메일로 연락해 시간을 정합니다.", "サービスページから選び、カートに入れて注文を確定してください。電話またはメールでご連絡し、日時を調整します。", "在服务页面选择，加入购物车并确认订单。我们会通过电话或邮件联系你安排具体时间。") },
  { q: l("Онлайн сургалт хэрхэн явагддаг вэ?", "How do online courses work?", "온라인 강좌는 어떻게 진행되나요?", "オンライン講座はどのように進みますか？", "在线课程如何进行？"),
    a: l("Худалдан авсны дараа таны хувийн булан дахь хичээлүүд нээгдэнэ. Бичлэгээр өөрийн хэмнэлээр үзэх боломжтой бөгөөд зарим хөтөлбөр амьд уулзалттай.", "After purchase, the lessons unlock in your account. You can watch on demand at your own pace, and some programs include live sessions.", "구매 후 마이페이지에서 강의가 열립니다. 자신의 속도로 녹화 강의를 볼 수 있으며 일부 프로그램은 라이브 세션을 포함합니다.", "購入後、マイページでレッスンが解放されます。録画を自分のペースで視聴でき、一部のプログラムにはライブセッションがあります。", "购买后，课程将在你的账户中解锁。你可以按自己的节奏观看录播，部分课程包含直播。") },
  { q: l("Эхлэгч хүн оролцож болох уу?", "Can beginners join?", "초보자도 참여할 수 있나요?", "初心者でも参加できますか？", "初学者可以参加吗？"),
    a: l("Тийм. Анхан шатны сургалт болон үйлчилгээнүүд эхлэгчдэд тусгайлан зориулагдсан тул урьдчилсан мэдлэг шаардлагагүй.", "Yes. Our beginner courses and services are designed especially for newcomers, so no prior experience is needed.", "네. 입문 강좌와 서비스는 초보자를 위해 마련되어 사전 지식이 필요 없습니다.", "はい。入門講座やサービスは初心者向けに設計されており、予備知識は不要です。", "可以。我们的入门课程与服务专为初学者设计，无需任何基础。") },
  { q: l("Төлбөрөө хэрхэн төлөх вэ?", "How do I pay?", "결제는 어떻게 하나요?", "支払い方法は？", "如何付款？"),
    a: l("Захиалга баталгаажуулах үед төлбөрийн нөхцөлийг харуулна. Энэ нь жишиг систем тул бодит төлбөрийн системийг дараа холбож болно.", "Payment details are shown when you confirm your order. This is a demo system, so a real payment provider can be connected later.", "주문 확정 시 결제 조건이 표시됩니다. 데모 시스템이므로 실제 결제 수단은 추후 연동할 수 있습니다.", "注文確定時に支払い条件が表示されます。デモシステムのため、実際の決済は後で連携できます。", "确认订单时会显示付款方式。这是演示系统，真实支付可在之后接入。") },
  { q: l("Үйлчилгээ эрүүл мэндийн тусламжийг орлох уу?", "Do services replace medical care?", "서비스가 의료를 대체하나요?", "サービスは医療の代わりになりますか？", "服务能替代医疗吗？"),
    a: l("Үгүй. Манай үйлчилгээ нь амралт, тэнцвэр, өөрийгөө хөгжүүлэхэд чиглэсэн бөгөөд эмчийн оношилгоо, эмчилгээг орлохгүй.", "No. Our services support relaxation, balance and self-development and do not replace medical diagnosis or treatment.", "아니요. 저희 서비스는 휴식, 균형, 자기계발을 위한 것으로 의학적 진단이나 치료를 대체하지 않습니다.", "いいえ。当サービスはリラックス・調和・自己成長を目的とし、医療診断や治療に代わるものではありません。", "不能。我们的服务旨在帮助放松、平衡与自我成长，不能替代医疗诊断或治疗。") },
  { q: l("Буцаалтын нөхцөл ямар вэ?", "What's the refund policy?", "환불 정책은 어떻게 되나요?", "返金ポリシーは？", "退款政策是怎样的？"),
    a: l("Дижитал бүтээгдэхүүн болон эхэлсэн сургалтаас бусад тохиолдолд тохиролцоны дагуу буцаалт хийх боломжтой. Дэлгэрэнгүйг холбоо барих хэсгээр асууна уу.", "Except for digital products and started courses, refunds are possible by agreement. Please ask via the contact page for details.", "디지털 제품과 이미 시작한 강좌를 제외하면 협의에 따라 환불이 가능합니다. 자세한 내용은 문의 페이지로 문의해 주세요.", "デジタル製品と開始済みの講座を除き、相談のうえ返金が可能です。詳細はお問い合わせページからご確認ください。", "除数字产品和已开始的课程外，可按约定退款。详情请通过联系页面咨询。") },
];

export const aboutContent = {
  mission: l(
    "Zaya's Ananda нь хүн бүр дотоод тэнцвэр, тайван байдал, өөрийгөө танихуйн аялалд хүрэхэд дэмжлэг үзүүлэх зорилготой. Бид далд ухамсар, энерги-мэдээллийн чиглэлийн мэдлэг, практик дасгалыг ойлгомжтой, хүртээмжтэй хэлбэрээр хүргэдэг.",
    "Zaya's Ananda aims to support everyone in reaching inner balance, calm and self-discovery. We share knowledge and practical exercises in the subconscious and energy-information field in a clear, accessible way.",
    "Zaya's Ananda는 모든 사람이 내면의 균형, 평온, 자기 발견에 이르도록 돕는 것을 목표로 합니다. 잠재의식과 에너지-정보 분야의 지식과 실용적인 연습을 명확하고 접근하기 쉽게 전합니다.",
    "Zaya's Ananda は、すべての人が心の調和・落ち着き・自己探求に至るのを支えることを目指します。潜在意識とエネルギー情報の知識と実践を、分かりやすく身近な形でお届けします。",
    "Zaya's Ananda 致力于支持每个人达到内在平衡、平静与自我探索。我们以清晰、易懂的方式分享潜意识与能量信息领域的知识与实践。"
  ),
  story: l(
    "Манай төв нь медитаци, биоэнерги засал, онлайн сургалт болон тусгай бүтээгдэхүүний цогц орчныг нэг дор бүрдүүлснээрээ онцлог. Бид шинжлэх ухаанч хандлага, зөөлөн арга барил, ёс зүйг чухалчилдаг.",
    "Our center is distinctive in bringing meditation, bioenergy healing, online courses and curated products together in one place. We value a grounded approach, gentle methods and ethics.",
    "저희 센터는 명상, 바이오에너지 힐링, 온라인 강좌, 엄선된 제품을 한곳에 모은 점이 특징입니다. 과학적 접근, 부드러운 방법, 윤리를 중시합니다.",
    "当センターは、瞑想・バイオエネルギー・オンライン講座・厳選製品を一つにまとめている点が特徴です。科学的な姿勢、穏やかな手法、倫理を大切にしています。",
    "我们的中心特色在于将冥想、生物能量疗愈、在线课程与精选产品汇聚一处。我们重视理性的态度、温和的方法与职业伦理。"
  ),
  values: [
    { glyph: "❖", title: l("Хүндлэл", "Respect", "존중", "尊重", "尊重"),
      text: l("Үйлчлүүлэгч бүрийн хувийн орон зай, нууцлал, хэмнэлийг хүндэтгэнэ.", "We respect each client's personal space, privacy and pace.", "고객 한 분 한 분의 개인 공간, 프라이버시, 속도를 존중합니다.", "お客様一人ひとりの個人的な空間・プライバシー・ペースを尊重します。", "尊重每位客户的个人空间、隐私与节奏。") },
    { glyph: "✷", title: l("Аюулгүй байдал", "Safety", "안전", "安全", "安全"),
      text: l("Бүх сесси, сургалтыг дэмжлэгт, аюулгүй орчинд явуулна.", "Every session and course is held in a supportive, safe space.", "모든 세션과 강좌는 지지적이고 안전한 환경에서 진행됩니다.", "すべてのセッションと講座は、支えのある安全な環境で行います。", "所有疗程与课程都在支持、安全的环境中进行。") },
    { glyph: "☾", title: l("Хүртээмж", "Accessibility", "접근성", "アクセシビリティ", "可及性"),
      text: l("Эхлэгчээс ахисан түвшин хүртэл ойлгомжтой, алхам алхмаар.", "Clear and step by step, from beginner to advanced.", "입문부터 심화까지, 명확하게 단계별로.", "初心者から上級者まで、分かりやすく段階的に。", "从入门到进阶，清晰且循序渐进。") },
    { glyph: "✶", title: l("Тогтвортой үр дүн", "Lasting results", "지속되는 결과", "持続する成果", "持久的成效"),
      text: l("Богино дасгалаар тогтвортой зуршил, бодит өөрчлөлт.", "Steady habits and real change through short practices.", "짧은 연습으로 꾸준한 습관과 실질적 변화.", "短い練習で確かな習慣と本当の変化を。", "通过简短练习实现稳定习惯与真实改变。") },
  ],
  stats: [
    { value: "10+", label: l("жилийн туршлага", "years of experience", "년의 경험", "年の経験", "年经验") },
    { value: "2,400+", label: l("сэтгэл хангалуун үйлчлүүлэгч", "happy clients", "만족한 고객", "満足したお客様", "满意客户") },
    { value: "20+", label: l("сургалт, хөтөлбөр", "courses & programs", "강좌·프로그램", "講座・プログラム", "课程与计划") },
    { value: "4.9", label: l("дундаж үнэлгээ", "average rating", "평균 평점", "平均評価", "平均评分") },
  ],
};

export const homeFeatures: { glyph: string; tone: Tone; title: L; text: L }[] = [
  { glyph: "✶", tone: "violet", title: l("Мэргэжлийн баг", "Expert team", "전문 팀", "専門チーム", "专业团队"),
    text: l("Олон жилийн туршлагатай зөвлөх, багш нар.", "Guides and teachers with years of experience.", "오랜 경험의 상담가와 강사진.", "長年の経験を持つガイドと講師。", "拥有多年经验的指导者与讲师。") },
  { glyph: "☾", tone: "sky", title: l("Онлайн сургалт", "Online courses", "온라인 강좌", "オンライン講座", "在线课程"),
    text: l("Өөрийн хэмнэлээр, хаанаас ч суралцах.", "Learn at your own pace, anywhere.", "어디서나 자신의 속도로 학습.", "どこでも自分のペースで学習。", "随时随地按自己的节奏学习。") },
  { glyph: "✷", tone: "jade", title: l("Энерги засал", "Energy healing", "에너지 힐링", "エネルギー療法", "能量疗愈"),
    text: l("Биеийн тэнцвэр, дотоод амралтыг сэргээх.", "Restore balance and inner rest.", "신체의 균형과 내면의 휴식 회복.", "身体の調和と内なる休息を回復。", "恢复身体平衡与内在休息。") },
  { glyph: "❖", tone: "gold", title: l("Хувийн хандлага", "Personal approach", "개인 맞춤", "個別対応", "个性化方式"),
    text: l("Таны төлөв байдалд тохирсон зөвлөмж.", "Guidance tailored to where you are.", "당신의 상태에 맞춘 조언.", "あなたの状態に合わせた助言。", "针对你的状态量身建议。") },
];


// --- Extended metadata (instructors, delivery type, filter tags, course stats) ---
const serviceMeta: Record<string, { instructor?: string; deliveryType?: L; tags?: string[] }> = {
  s1: { instructor: "Сараа", deliveryType: l("Танхим", "Classroom", "오프라인", "対面", "线下"), tags: ["onoshilgoo", "tankhim"] },
  s2: { instructor: "Заяа", deliveryType: l("Танхим", "Classroom", "오프라인", "対面", "线下"), tags: ["zovlogoo", "tankhim"] },
  s3: { instructor: "Сараа", deliveryType: l("Танхим", "Classroom", "오프라인", "対面", "线下"), tags: ["zasal", "tankhim"] },
  s4: { instructor: "Тэмүүлэн", deliveryType: l("Танхим / Онлайн", "Classroom / Online", "오프라인 / 온라인", "対面 / オンライン", "线下 / 在线"), tags: ["byasalgal", "online", "tankhim"] },
  s5: { instructor: "Сараа", deliveryType: l("Танхим", "Classroom", "오프라인", "対面", "线下"), tags: ["zasal", "tankhim"] },
  s6: { instructor: "Заяа", deliveryType: l("Танхим / Онлайн", "Classroom / Online", "오프라인 / 온라인", "対面 / オンライン", "线下 / 在线"), tags: ["zovlogoo", "online", "tankhim"] },
};
services.forEach((s) => Object.assign(s, serviceMeta[s.id] ?? {}));

const courseMeta: Record<string, { instructor?: string; students?: number; certificate?: boolean; startDate?: string }> = {
  c1: { instructor: "Заяа", students: 324, certificate: true, startDate: "2026-07-15" },
  c2: { instructor: "Тэмүүлэн", students: 212, certificate: true, startDate: "2026-07-22" },
  c3: { instructor: "Тэмүүлэн", students: 540, certificate: false },
  c4: { instructor: "Сараа", students: 96, certificate: true, startDate: "2026-08-05" },
  c5: { instructor: "Заяа", students: 178, certificate: false },
  c6: { instructor: "Заяа", students: 143, certificate: true, startDate: "2026-07-29" },
};
courses.forEach((c) => Object.assign(c, courseMeta[c.id] ?? {}));

export const events: EventItem[] = [];

export interface Lesson { title: string; duration: string; free?: boolean }
export const courseLessons: Record<string, Lesson[]> = {
  "dald-ukhamsraa-serekh": [
    { title: "Танилцуулга ба сургалтын зорилго", duration: "8:20", free: true },
    { title: "Далд ухамсар хэрхэн ажилладаг вэ", duration: "14:05" },
    { title: "Бодол, итгэл үнэмшлийн нөлөө", duration: "12:40" },
    { title: "Давтагдсан хэв маягийг таних", duration: "16:10" },
    { title: "Амьсгал ба тайвшралын дасгал", duration: "11:30" },
    { title: "Өдөр тутмын практик систем", duration: "13:15" },
    { title: "Нэгтгэл ба дараагийн алхам", duration: "9:05" },
  ],
  "energi-medeelliin-anhan": [
    { title: "Энерги-мэдээлэл гэж юу вэ", duration: "7:40", free: true },
    { title: "Биеийн энергийн талбай", duration: "12:25" },
    { title: "Энерги мэдрэх суурь дасгал", duration: "15:00" },
    { title: "Ажиглах арга техник", duration: "13:20" },
    { title: "Хамгаалалт ба цэвэрлэгээ", duration: "12:10" },
    { title: "Практик нэгтгэл", duration: "10:35" },
  ],
  "meditatsiin-21-hutulbur": [
    { title: "1-р өдөр: Эхлэл ба бэлтгэл", duration: "10:00", free: true },
    { title: "Амьсгалдаа төвлөрөх", duration: "12:15" },
    { title: "Биеэ мэдрэх скан", duration: "11:40" },
    { title: "Бодлоо ажиглах", duration: "12:05" },
    { title: "Энэрэл ба талархал", duration: "11:20" },
    { title: "Зуршил болгох арга", duration: "10:50" },
    { title: "21 өдрийн дүгнэлт", duration: "9:30" },
  ],
  "bioenergi-zasal-mergejil": [
    { title: "Мэргэжлийн ёс зүй ба хязгаар", duration: "10:10", free: true },
    { title: "Биоэнерги заслын онол", duration: "16:25" },
    { title: "Гарын мэдрэмж хөгжүүлэх", duration: "14:50" },
    { title: "Заслын үндсэн дараалал", duration: "18:05" },
    { title: "Аюулгүй ажиллагаа", duration: "12:30" },
    { title: "Кейс судалгаа", duration: "15:15" },
    { title: "Дадлага ба өөрийн үнэлгээ", duration: "13:40" },
  ],
  "zuudnii-ukhamsar": [
    { title: "Зүүдний ертөнцийн танилцуулга", duration: "9:10", free: true },
    { title: "Зүүдээ тэмдэглэх арга", duration: "12:00" },
    { title: "Бодит байдлын шалгалт", duration: "11:25" },
    { title: "Нийлэг зүүдэнд бэлдэх", duration: "13:35" },
    { title: "Унтлагын чанарыг сайжруулах", duration: "10:20" },
  ],
  "uuriig-hugjuuleh-master": [
    { title: "Танилцуулга ба зорилго тавих", duration: "8:45", free: true },
    { title: "Ухамсрын өдөр тутмын дасгал", duration: "14:30" },
    { title: "Энергийн менежмент", duration: "13:10" },
    { title: "Зорилго төлөвлөлтийн систем", duration: "15:25" },
    { title: "Тогтвортой зуршил бүрдүүлэх", duration: "12:50" },
    { title: "Амьд Q&A-д бэлдэх", duration: "10:15" },
    { title: "Эцсийн төсөл ба дүгнэлт", duration: "16:00" },
  ],
};
