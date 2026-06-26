import type { Service, Course, Product, Testimonial, TeamMember, Faq, L, LA, Tone } from "@/lib/types";

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
  phone: "+976 8000 0000",
  email: "info@zaya-ananda.com",
  address: l(
    "Улаанбаатар хот, Сүхбаатар дүүрэг",
    "Ulaanbaatar, Sükhbaatar District",
    "울란바토르, 수흐바타르 구",
    "ウランバートル、スフバートル区",
    "乌兰巴托苏赫巴托区"
  ),
  workingHours: l(
    "Даваа–Бямба, 09:00–19:00",
    "Mon–Sat, 09:00–19:00",
    "월–토, 09:00–19:00",
    "月–土 9:00–19:00",
    "周一至周六 09:00–19:00"
  ),
  social: { facebook: "#", instagram: "#", youtube: "#" },
};

export const services: Service[] = [
  {
    id: "s1", slug: "bioenergi-onoshilgoo", glyph: "✶", tone: "violet", price: 150000, featured: true,
    title: l("Биоэнерги оношилгоо ба засал", "Bioenergy diagnosis & healing", "바이오에너지 진단과 힐링", "バイオエネルギー診断とヒーリング", "生物能量诊断与疗愈"),
    short: l("Биеийн энергийн талбайг уншиж, тэнцвэрийг сэргээх бие даасан сесси.", "An individual session that reads your energy field and restores balance.", "신체의 에너지장을 읽고 균형을 회복하는 1:1 세션.", "身体のエネルギー場を読み取り、バランスを整える個別セッション。", "解读身体能量场、恢复平衡的一对一疗程。"),
    description: l(
      "Энэхүү сесси нь таны биеийн энергийн талбай, чакрын урсгалыг уншиж, тогтворгүй цэгүүдийг илрүүлнэ. Зөөлөн арга техникээр энергийн урсгалыг сэргээж, дотоод тайвшралыг мэдрэхэд тусална.",
      "This session reads your energy field and chakra flow to find areas of imbalance. With gentle techniques it helps restore the flow and bring a sense of inner calm.",
      "이 세션은 신체의 에너지장과 차크라 흐름을 읽어 불균형 지점을 찾습니다. 부드러운 기법으로 흐름을 회복하고 내면의 평온을 느끼도록 돕습니다.",
      "このセッションでは、身体のエネルギー場とチャクラの流れを読み取り、乱れた箇所を見つけます。穏やかな技法で流れを整え、心の落ち着きを感じられるようサポートします。",
      "本疗程解读你的能量场与脉轮流动，找出失衡之处。以温和的手法恢复能量流动，帮助你感受内在的平静。"),
    duration: l("75 минут", "75 minutes", "75분", "75分", "75分钟"),
    category: l("Засал", "Healing", "힐링", "ヒーリング", "疗愈"),
    highlights: la(
      ["Энергийн талбайн оношилгоо", "Чакрын урсгал сэргээх", "Хувийн зөвлөмж, дасгал"],
      ["Energy field assessment", "Restoring chakra flow", "Personal guidance & exercises"],
      ["에너지장 진단", "차크라 흐름 회복", "개인 맞춤 조언과 연습"],
      ["エネルギー場の診断", "チャクラの流れの回復", "個別アドバイスとワーク"],
      ["能量场评估", "恢复脉轮流动", "个性化建议与练习"]),
  },
  {
    id: "s2", slug: "dald-ukhamsar-regress", glyph: "❂", tone: "gold", price: 220000, featured: true,
    title: l("Далд ухамсрын регресс сесси", "Subconscious regression session", "잠재의식 회귀 세션", "潜在意識リグレッション", "潜意识回溯疗程"),
    short: l("Гүн амралтын төлөвт орж, дотоод дурсамж, хэв маягтай ажиллах.", "Enter deep relaxation to work with inner memories and patterns.", "깊은 이완 상태에서 내면의 기억과 패턴을 다룹니다.", "深いリラックス状態で内なる記憶やパターンに向き合います。", "进入深度放松，与内在记忆和模式工作。"),
    description: l(
      "Регресс сесси нь зөөлөн удирдамжтайгаар гүн амралтын төлөвт хүргэж, далд ухамсарт хадгалагдсан хэв маягийг ажиглах боломж олгоно. Энэ нь дотоод ертөнцийг тодорхой ойлгож, сэтгэлзүйн ачааллыг зөөлрүүлэхэд тусалдаг аюулгүй орчин юм.",
      "With gentle guidance, the regression session brings you into deep relaxation to observe patterns held in the subconscious. It is a safe space that helps you understand your inner world and ease emotional burdens.",
      "회귀 세션은 부드러운 안내로 깊은 이완 상태에 이르러 잠재의식에 자리한 패턴을 관찰하게 합니다. 내면을 더 분명히 이해하고 정서적 부담을 덜어주는 안전한 공간입니다.",
      "リグレッションセッションは、穏やかな誘導で深いリラックス状態へ導き、潜在意識にあるパターンを観察します。内なる世界を理解し、心の負担を和らげる安全な場です。",
      "回溯疗程在温和的引导下带你进入深度放松，观察潜意识中存留的模式。这是一个安全的空间，帮助你理解内在世界、舒缓情绪负担。"),
    duration: l("90 минут", "90 minutes", "90분", "90分", "90分钟"),
    category: l("Гүн сесси", "Deep session", "심층 세션", "深いセッション", "深度疗程"),
    highlights: la(
      ["Гүн амралтын удирдамж", "Дотоод хэв маягтай ажиллах", "Аюулгүй, нууцлалтай орчин"],
      ["Guided deep relaxation", "Working with inner patterns", "Safe, confidential space"],
      ["깊은 이완 안내", "내면 패턴 다루기", "안전하고 비밀이 보장되는 공간"],
      ["深いリラックスの誘導", "内なるパターンへの取り組み", "安全で機密性のある空間"],
      ["引导深度放松", "处理内在模式", "安全私密的空间"]),
  },
  {
    id: "s3", slug: "energi-tseverlegee", glyph: "✷", tone: "jade", price: 120000,
    title: l("Энерги-мэдээллийн цэвэрлэгээ", "Energy-information clearing", "에너지-정보 정화", "エネルギー情報クリアリング", "能量信息净化"),
    short: l("Хуримтлагдсан хүнд энерги, ачааллыг зөөлөн аргаар сулруулах.", "Gently release accumulated heavy energy and tension.", "쌓인 무거운 에너지와 긴장을 부드럽게 풀어줍니다.", "溜まった重いエネルギーと緊張を穏やかに解放します。", "温和释放积累的沉重能量与压力。"),
    description: l(
      "Өдөр тутмын стресс биеийн энергийн талбайд хуримтлагддаг. Энэ үйлчилгээ нь тэрхүү хүнд мэдрэмжийг амьсгал, дуу авианы аргаар сулруулж, сэргэг цэвэр төлөвт оруулна.",
      "Daily stress accumulates in the body's energy field. This service eases that heaviness through breath and sound, bringing you back to a fresh, clear state.",
      "일상의 스트레스는 신체의 에너지장에 쌓입니다. 이 서비스는 호흡과 소리로 그 무거움을 풀어 맑고 상쾌한 상태로 되돌립니다.",
      "日々のストレスは身体のエネルギー場に蓄積します。本サービスは呼吸と音でその重さを和らげ、清々しい状態へ戻します。",
      "日常压力会积累在身体的能量场中。本服务通过呼吸与声音舒缓这种沉重，让你回到清新通透的状态。"),
    duration: l("60 минут", "60 minutes", "60분", "60分", "60分钟"),
    category: l("Цэвэрлэгээ", "Clearing", "정화", "クリアリング", "净化"),
    highlights: la(
      ["Амьсгал ба дуу авианы арга", "Хүнд ачаалал сулруулах", "Сэргэг төлөв сэргээх"],
      ["Breath and sound methods", "Releasing heaviness", "Restoring freshness"],
      ["호흡과 소리 기법", "무거움 해소", "상쾌함 회복"],
      ["呼吸と音の技法", "重さの解放", "爽やかさの回復"],
      ["呼吸与声音方法", "释放沉重感", "恢复清新状态"]),
  },
  {
    id: "s4", slug: "meditatsi-udirdamj", glyph: "☾", tone: "sky", price: 80000,
    title: l("Удирдамжтай медитаци", "Guided meditation", "가이드 명상", "ガイド瞑想", "引导冥想"),
    short: l("Анхаарлаа төвлөрүүлж, дотоод нам гүмийг мэдрэх ганцаарчилсан хичээл.", "A one-on-one session to focus the mind and feel inner stillness.", "마음을 집중하고 내면의 고요를 느끼는 1:1 수업.", "心を整え、内なる静けさを感じる個別レッスン。", "专注内心、感受内在宁静的一对一课程。"),
    description: l(
      "Медитацийг хэрхэн зөв эхлэх, амьсгалаа удирдах, бодлын урсгалыг ажиглах суурь техникийг ганцаарчлан эзэмшинэ. Анхан шатнаас эхлэгчдэд ээлтэй, өдөр тутам хийх дасгалаар хангана.",
      "Learn the basics of starting meditation, guiding your breath and observing your thoughts in a one-on-one format. Beginner-friendly, with exercises you can practice every day.",
      "명상을 올바르게 시작하는 법, 호흡을 다루는 법, 생각의 흐름을 관찰하는 기초 기법을 1:1로 배웁니다. 입문자에게 친화적이며 매일 할 수 있는 연습을 제공합니다.",
      "瞑想の始め方、呼吸の整え方、思考の流れの観察といった基礎を個別形式で学びます。初心者にやさしく、毎日できるワークを提供します。",
      "以一对一的形式学习如何正确开始冥想、引导呼吸、观察思绪的基础技巧。适合初学者，并提供可每日练习的内容。"),
    duration: l("60 минут", "60 minutes", "60분", "60分", "60分钟"),
    category: l("Медитаци", "Meditation", "명상", "瞑想", "冥想"),
    highlights: la(
      ["Амьсгалын суурь техник", "Анхаарал төвлөрүүлэх", "Өдөр тутмын дасгал"],
      ["Basic breathing technique", "Focusing attention", "Daily practice"],
      ["기본 호흡 기법", "집중력 향상", "매일의 연습"],
      ["基本の呼吸法", "集中力を高める", "毎日の練習"],
      ["基础呼吸技巧", "专注训练", "每日练习"]),
  },
  {
    id: "s5", slug: "chakra-tentsverjuulelt", glyph: "✿", tone: "rose", price: 140000,
    title: l("Чакра тэнцвэржүүлэлт", "Chakra balancing", "차크라 밸런싱", "チャクラ・バランシング", "脉轮平衡"),
    short: l("Долоон гол энергийн төвийн урсгалыг эв нэгдэлд оруулах.", "Bring the seven main energy centers into harmony.", "일곱 개의 주요 에너지 센터를 조화롭게 합니다.", "七つの主要なエネルギーセンターを調和させます。", "让七个主要能量中心达到和谐。"),
    description: l(
      "Биеийн долоон гол энергийн төвийн урсгалыг сэргээж, дотоод эв нэгдэл, тогтвортой байдлыг бий болгоно. Дуу авиа, өнгө, амьсгалын аргыг хослуулан, гэртээ үргэлжлүүлэх дасгалын зөвлөмж өгнө.",
      "Restore the flow of the body's seven main energy centers to create inner harmony and stability. Combining sound, color and breath, with guidance to continue at home.",
      "신체의 일곱 에너지 센터의 흐름을 회복하여 내면의 조화와 안정을 만듭니다. 소리·색·호흡을 결합하며, 집에서 이어갈 수 있는 연습을 안내합니다.",
      "身体の七つのエネルギーセンターの流れを整え、内なる調和と安定をもたらします。音・色・呼吸を組み合わせ、自宅で続けられるワークもご案内します。",
      "恢复身体七个主要能量中心的流动，营造内在的和谐与稳定。结合声音、色彩与呼吸，并提供可在家继续的练习建议。"),
    duration: l("70 минут", "70 minutes", "70분", "70分", "70分钟"),
    category: l("Засал", "Healing", "힐링", "ヒーリング", "疗愈"),
    highlights: la(
      ["Долоон чакрын урсгал", "Дуу авиа, өнгөний арга", "Гэрийн дасгалын зөвлөмж"],
      ["Flow of seven chakras", "Sound and color methods", "Home practice guidance"],
      ["일곱 차크라의 흐름", "소리와 색 기법", "홈 연습 안내"],
      ["七つのチャクラの流れ", "音と色の技法", "自宅ワークの案内"],
      ["七脉轮的流动", "声音与色彩方法", "居家练习指导"]),
  },
  {
    id: "s6", slug: "huviin-zovlogoo", glyph: "❖", tone: "violet", price: 180000,
    title: l("Хувь хүний зөвлөгөө & коучинг", "Personal consultation & coaching", "개인 상담과 코칭", "個人相談＆コーチング", "个人咨询与教练"),
    short: l("Зорилго, шийдвэр, дотоод хөгжлийн асуудлаар чиглүүлэх уулзалт.", "A session to guide your goals, decisions and inner growth.", "목표, 결정, 내적 성장을 안내하는 세션.", "目標・決断・内面の成長を導くセッション。", "引导目标、决策与内在成长的会谈。"),
    description: l(
      "Амьдралын чухал шилжилт, зорилго төлөвлөлт, дотоод хөгжлийн асуудлаар туршлагатай зөвлөхтэй ганцаарчлан ярилцаж, тодорхой алхмуудыг хамтдаа төлөвлөнө. Өөрийн нөөц бололцоог нээж, итгэлтэйгээр урагшлахад дэмжлэг болно.",
      "Talk one-on-one with an experienced guide about life transitions, goal-setting and inner growth, and plan concrete steps together. It supports you to unlock your resources and move forward with confidence.",
      "인생의 전환, 목표 설정, 내적 성장에 대해 경험 많은 상담가와 1:1로 이야기하고 구체적인 단계를 함께 계획합니다. 자신의 잠재력을 열고 자신 있게 나아가도록 돕습니다.",
      "人生の転機、目標設定、内面の成長について経験豊富なガイドと一対一で話し、具体的なステップを一緒に計画します。自分の力を引き出し、自信を持って前進できるよう支えます。",
      "与经验丰富的指导者一对一探讨人生转折、目标设定与内在成长，并共同规划具体步骤。帮助你释放自身潜能，自信前行。"),
    duration: l("90 минут", "90 minutes", "90분", "90分", "90分钟"),
    category: l("Коучинг", "Coaching", "코칭", "コーチング", "教练"),
    highlights: la(
      ["Зорилго төлөвлөлт", "Дотоод нөөц нээх", "Тодорхой үйлдлийн төлөвлөгөө"],
      ["Goal planning", "Unlocking inner resources", "A clear action plan"],
      ["목표 계획", "내적 자원 열기", "명확한 실행 계획"],
      ["目標の計画", "内なる力を引き出す", "明確な行動計画"],
      ["目标规划", "释放内在资源", "明确的行动计划"]),
  },
];

export const courses: Course[] = [
  {
    id: "c1", slug: "dald-ukhamsraa-serekh", glyph: "✶", tone: "violet", price: 290000, lessons: 12, featured: true,
    title: l("Далд ухамсраа сэрээх — суурь сургалт", "Awakening the subconscious — foundation", "잠재의식 깨우기 — 기초 과정", "潜在意識を目覚めさせる — 基礎講座", "唤醒潜意识——基础课程"),
    short: l("Далд ухамсрын зарчмыг ойлгож, өдөр тутамдаа хэрэглэх суурь хөтөлбөр.", "A foundation program to understand the subconscious and apply it daily.", "잠재의식의 원리를 이해하고 일상에 적용하는 기초 프로그램.", "潜在意識の原理を理解し日常に活かす基礎プログラム。", "理解潜意识原理并应用于日常的基础课程。"),
    description: l(
      "Далд ухамсар хэрхэн ажилладаг, бодол, мэдрэмж, зан үйлд хэрхэн нөлөөлдгийг практик дасгалтай судална. Өөрийн давтагдсан хэв маягийг танин мэдэж, тэдгээрийг зөөлрүүлэх арга техникийг эзэмшинэ.",
      "Study how the subconscious works and shapes thoughts, feelings and behavior, with practical exercises. You'll recognize your recurring patterns and learn techniques to soften them.",
      "잠재의식이 어떻게 작동하고 생각·감정·행동에 영향을 주는지 실습과 함께 배웁니다. 반복되는 패턴을 인식하고 이를 완화하는 기법을 익힙니다.",
      "潜在意識がどのように働き、思考・感情・行動に影響するかを実践とともに学びます。繰り返すパターンに気づき、それを和らげる技法を身につけます。",
      "通过实践练习学习潜意识如何运作、如何影响思想、情绪与行为。你将识别反复出现的模式，并掌握缓解它们的方法。"),
    level: l("Анхан шат", "Beginner", "입문", "初級", "入门"),
    duration: l("6 долоо хоног", "6 weeks", "6주", "6週間", "6周"),
    format: l("Онлайн, бичлэгээр", "Online, on-demand", "온라인 녹화", "オンライン録画", "在线录播"),
    category: l("Ухамсар", "Consciousness", "의식", "意識", "意识"),
    highlights: la(
      ["12 видео хичээл", "Долоо хоног бүрийн дасгал", "Хаалттай группын дэмжлэг"],
      ["12 video lessons", "Weekly exercises", "Private group support"],
      ["12개 영상 강의", "주간 연습", "비공개 그룹 지원"],
      ["12本の動画レッスン", "毎週のワーク", "限定グループのサポート"],
      ["12节视频课", "每周练习", "私密群组支持"]),
    outcomes: la(
      ["Далд ухамсрын суурь зарчмыг ойлгох", "Давтагдсан хэв маягийг таних", "Өдөр тутмын дасгал тогтворжуулах"],
      ["Understand the basics of the subconscious", "Recognize recurring patterns", "Build a steady daily practice"],
      ["잠재의식의 기초 이해", "반복 패턴 인식", "꾸준한 일상 연습 만들기"],
      ["潜在意識の基礎を理解", "繰り返すパターンに気づく", "毎日の練習を習慣化"],
      ["理解潜意识基础", "识别反复模式", "建立稳定的日常练习"]),
  },
  {
    id: "c2", slug: "energi-medeelliin-anhan", glyph: "✷", tone: "jade", price: 240000, lessons: 10, featured: true,
    title: l("Энерги-мэдээллийн анхан шат", "Energy-information basics", "에너지-정보 기초", "エネルギー情報の基礎", "能量信息入门"),
    short: l("Энергийн талбай, урсгалын тухай ойлголтыг практикаар эхлүүлэх.", "Begin understanding energy fields and flow through practice.", "에너지장과 흐름에 대한 이해를 실습으로 시작합니다.", "エネルギー場と流れの理解を実践で始めます。", "通过实践开始理解能量场与流动。"),
    description: l(
      "Энерги-мэдээллийн суурь ойлголт, биеийн энергийн талбайг мэдрэх, ажиглах энгийн арга техникийг алхам алхмаар эзэмшинэ. Онол, практикийг тэнцвэртэй хослуулсан эхлэгчдэд ээлтэй хөтөлбөр.",
      "Step by step, learn the basics of energy-information and simple techniques to sense and observe the body's energy field. A beginner-friendly program balancing theory and practice.",
      "에너지-정보의 기초와 신체 에너지장을 느끼고 관찰하는 간단한 기법을 단계별로 익힙니다. 이론과 실습을 균형 있게 다룬 입문자 친화 프로그램입니다.",
      "エネルギー情報の基礎と、身体のエネルギー場を感じ観察する簡単な技法を段階的に学びます。理論と実践をバランスよく扱う初心者向けプログラムです。",
      "循序渐进地学习能量信息的基础，以及感知与观察身体能量场的简单技巧。理论与实践兼顾，适合初学者。"),
    level: l("Анхан шат", "Beginner", "입문", "初級", "入门"),
    duration: l("5 долоо хоног", "5 weeks", "5주", "5週間", "5周"),
    format: l("Онлайн, бичлэгээр", "Online, on-demand", "온라인 녹화", "オンライン録画", "在线录播"),
    category: l("Энерги", "Energy", "에너지", "エネルギー", "能量"),
    highlights: la(
      ["10 видео хичээл", "Практик дасгалууд", "Гэрчилгээ олгоно"],
      ["10 video lessons", "Practical exercises", "Certificate of completion"],
      ["10개 영상 강의", "실습 연습", "수료증 발급"],
      ["10本の動画レッスン", "実践ワーク", "修了証を発行"],
      ["10节视频课", "实践练习", "颁发结业证书"]),
    outcomes: la(
      ["Энергийн талбайг мэдрэх", "Суурь арга техник эзэмших", "Өөртөө хэрэглэх дадал бий болгох"],
      ["Sense the energy field", "Master basic techniques", "Build a habit of self-practice"],
      ["에너지장 감지", "기본 기법 습득", "자기 연습 습관 만들기"],
      ["エネルギー場を感じる", "基本技法の習得", "自分で実践する習慣作り"],
      ["感知能量场", "掌握基础技巧", "养成自我练习习惯"]),
  },
  {
    id: "c3", slug: "meditatsiin-21-hutulbur", glyph: "☾", tone: "sky", price: 149000, lessons: 21,
    title: l("Медитацийн 21 өдрийн хөтөлбөр", "21-day meditation program", "21일 명상 프로그램", "21日間瞑想プログラム", "21天冥想计划"),
    short: l("Өдөр бүрийн богино дасгалаар медитацийг зуршил болгох.", "Make meditation a habit with short daily practices.", "매일의 짧은 연습으로 명상을 습관으로 만듭니다.", "毎日の短い練習で瞑想を習慣にします。", "通过每日短练习，让冥想成为习惯。"),
    description: l(
      "21 өдрийн турш өдөр бүр 10–15 минутын удирдамжтай дасгал хийснээр медитацийг тогтвортой зуршил болгоход чиглэнэ. Богино, ойлгомжтой хичээлүүд завгүй хуваарьтай хүмүүст ч тохиромжтой.",
      "Over 21 days, daily 10–15 minute guided practices help make meditation a steady habit. Short, clear lessons suit even a busy schedule.",
      "21일 동안 매일 10–15분의 가이드 연습으로 명상을 꾸준한 습관으로 만듭니다. 짧고 명확한 강의는 바쁜 일정에도 적합합니다.",
      "21日間、毎日10〜15分のガイド付き練習で瞑想を確かな習慣にします。短く分かりやすいレッスンは忙しい人にも最適です。",
      "在21天里，每天进行10–15分钟的引导练习，让冥想成为稳定的习惯。简短清晰的课程也适合忙碌的日程。"),
    level: l("Бүх түвшин", "All levels", "모든 레벨", "全レベル", "所有级别"),
    duration: l("3 долоо хоног", "3 weeks", "3주", "3週間", "3周"),
    format: l("Онлайн, аудио+видео", "Online, audio + video", "온라인 오디오+비디오", "オンライン 音声＋動画", "在线音频+视频"),
    category: l("Медитаци", "Meditation", "명상", "瞑想", "冥想"),
    highlights: la(
      ["21 өдрийн дасгал", "Аудио удирдамж", "Явцын хяналтын хуудас"],
      ["21 days of practice", "Audio guidance", "Progress tracker"],
      ["21일 연습", "오디오 가이드", "진행 체크 시트"],
      ["21日間の練習", "音声ガイド", "進捗トラッカー"],
      ["21天练习", "音频引导", "进度跟踪表"]),
    outcomes: la(
      ["Тогтвортой зуршил бий болгох", "Стресс зохицуулах", "Анхаарал төвлөрөл сайжруулах"],
      ["Build a steady habit", "Manage stress", "Improve focus"],
      ["꾸준한 습관 만들기", "스트레스 관리", "집중력 향상"],
      ["確かな習慣作り", "ストレス管理", "集中力の向上"],
      ["建立稳定习惯", "管理压力", "提升专注力"]),
  },
  {
    id: "c4", slug: "bioenergi-zasal-mergejil", glyph: "❂", tone: "gold", price: 390000, lessons: 18,
    title: l("Биоэнерги засал — мэргэжлийн хөтөлбөр", "Bioenergy healing — professional", "바이오에너지 힐링 — 전문 과정", "バイオエネルギー・ヒーリング — プロ向け", "生物能量疗愈——专业课程"),
    short: l("Бусдад тусламж үзүүлэх түвшинд биоэнерги заслын арга барил эзэмших.", "Master bioenergy healing methods to a level that helps others.", "타인을 도울 수 있는 수준의 바이오에너지 힐링 기법을 익힙니다.", "他者を支援できるレベルのバイオエネルギー技法を習得します。", "掌握可帮助他人的生物能量疗愈方法。"),
    description: l(
      "Биоэнерги заслын онол, ёс зүй, аюулгүй ажиллагаа болон практик арга техникийг гүнзгийрүүлэн судлах ахисан түвшний хөтөлбөр. Дадлагын даалгавар, багштай ярилцлагатай бөгөөд төгсгөлд гэрчилгээ олгоно.",
      "An advanced program covering the theory, ethics, safety and practical techniques of bioenergy healing in depth. It includes practice assignments and instructor sessions, with a certificate at the end.",
      "바이오에너지 힐링의 이론, 윤리, 안전, 실전 기법을 심도 있게 다루는 심화 과정입니다. 실습 과제와 강사 면담이 포함되며 수료 시 인증서를 드립니다.",
      "バイオエネルギー・ヒーリングの理論・倫理・安全・実践技法を深く扱う上級プログラムです。実習課題と講師面談を含み、修了時に認定証を発行します。",
      "深入讲解生物能量疗愈的理论、伦理、安全与实操技法的进阶课程。包含实践作业与导师交流，结业颁发证书。"),
    level: l("Ахисан шат", "Advanced", "심화", "上級", "进阶"),
    duration: l("9 долоо хоног", "9 weeks", "9주", "9週間", "9周"),
    format: l("Онлайн + дадлага", "Online + practicum", "온라인 + 실습", "オンライン＋実習", "在线+实习"),
    category: l("Засал", "Healing", "힐링", "ヒーリング", "疗愈"),
    highlights: la(
      ["18 гүнзгийрүүлсэн хичээл", "Дадлагын даалгавар", "Мэргэжлийн гэрчилгээ"],
      ["18 in-depth lessons", "Practice assignments", "Professional certificate"],
      ["18개 심화 강의", "실습 과제", "전문 인증서"],
      ["18本の詳細レッスン", "実習課題", "プロ認定証"],
      ["18节深度课程", "实践作业", "专业证书"]),
    outcomes: la(
      ["Заслын арга техник эзэмших", "Ёс зүй, аюулгүй ажиллагаа", "Практик дадлага хийх"],
      ["Master healing techniques", "Ethics and safety", "Hands-on practice"],
      ["힐링 기법 습득", "윤리와 안전", "실전 연습"],
      ["ヒーリング技法の習得", "倫理と安全", "実践練習"],
      ["掌握疗愈技法", "伦理与安全", "动手实践"]),
  },
  {
    id: "c5", slug: "zuudnii-ukhamsar", glyph: "☼", tone: "violet", price: 199000, lessons: 8,
    title: l("Зүүдний ухамсар ба нийлэг зүүд", "Dream awareness & lucid dreaming", "꿈 인식과 자각몽", "夢の意識と明晰夢", "梦境觉知与清醒梦"),
    short: l("Зүүдээ тэмдэглэх, ухамсартай зүүдлэх арга техникийг сурах.", "Learn to record dreams and practice lucid dreaming.", "꿈을 기록하고 자각몽을 연습하는 법을 배웁니다.", "夢を記録し、明晰夢を練習する方法を学びます。", "学习记录梦境并练习清醒梦的方法。"),
    description: l(
      "Зүүдний агуулгыг ажиглах, тэмдэглэх болон ухамсартай зүүдлэх суурь арга техникийг судлах сонирхолтой хөтөлбөр. Дотоод ертөнцтэйгээ ойртож, унтлагын чанарт анхаарах практик зөвлөмжтэй.",
      "An engaging program to observe and record dream content and learn the basics of lucid dreaming. It includes practical tips to connect with your inner world and care for sleep quality.",
      "꿈의 내용을 관찰·기록하고 자각몽의 기초를 배우는 흥미로운 프로그램입니다. 내면과 가까워지고 수면의 질을 돌보는 실용적 조언을 담았습니다.",
      "夢の内容を観察・記録し、明晰夢の基礎を学ぶ興味深いプログラムです。内なる世界とつながり、睡眠の質を整える実用的なヒントも含みます。",
      "一个有趣的课程，带你观察与记录梦境内容，并学习清醒梦的基础。包含贴近内在世界、关注睡眠质量的实用建议。"),
    level: l("Дунд шат", "Intermediate", "중급", "中級", "中级"),
    duration: l("4 долоо хоног", "4 weeks", "4주", "4週間", "4周"),
    format: l("Онлайн, бичлэгээр", "Online, on-demand", "온라인 녹화", "オンライン録画", "在线录播"),
    category: l("Ухамсар", "Consciousness", "의식", "意識", "意识"),
    highlights: la(
      ["8 видео хичээл", "Зүүдний тэмдэглэлийн арга", "Практик дасгал"],
      ["8 video lessons", "Dream journaling method", "Practical exercises"],
      ["8개 영상 강의", "꿈 일기 방법", "실습 연습"],
      ["8本の動画レッスン", "夢日記の方法", "実践ワーク"],
      ["8节视频课", "梦境日记方法", "实践练习"]),
    outcomes: la(
      ["Зүүдээ тэмдэглэх дадал", "Ухамсартай зүүдлэх техник", "Унтлагын чанар сайжруулах"],
      ["A dream-journaling habit", "Lucid dreaming techniques", "Better sleep quality"],
      ["꿈 기록 습관", "자각몽 기법", "수면의 질 향상"],
      ["夢を記録する習慣", "明晰夢の技法", "睡眠の質の向上"],
      ["记录梦境的习惯", "清醒梦技巧", "改善睡眠质量"]),
  },
  {
    id: "c6", slug: "uuriig-hugjuuleh-master", glyph: "❖", tone: "rose", price: 320000, lessons: 14, featured: true,
    title: l("Өөрийгөө хөгжүүлэх мастер класс", "Self-development master class", "자기계발 마스터 클래스", "自己成長マスタークラス", "自我成长大师课"),
    short: l("Ухамсар, энерги, зорилго төлөвлөлтийг нэгтгэсэн цогц хөтөлбөр.", "A complete program uniting consciousness, energy and goal-setting.", "의식, 에너지, 목표 설정을 통합한 종합 프로그램.", "意識・エネルギー・目標設定を統合した総合プログラム。", "融合意识、能量与目标规划的综合课程。"),
    description: l(
      "Дотоод хөгжлийн чухал чиглэлүүдийг нэг дор багтаасан цогц мастер класс. Ухамсрын дасгал, энергийн менежмент, зорилго төлөвлөлт болон зуршил бүрдүүлэх хэрэгслүүдийг алхам алхмаар эзэмшинэ.",
      "A complete master class that brings together the key areas of inner development. Step by step you'll master consciousness practices, energy management, goal-setting and habit-building tools.",
      "내적 성장의 핵심 영역을 한데 모은 종합 마스터 클래스입니다. 의식 연습, 에너지 관리, 목표 설정, 습관 형성 도구를 단계별로 익힙니다.",
      "内面の成長の重要分野を一つにまとめた総合マスタークラスです。意識のワーク、エネルギー管理、目標設定、習慣化のツールを段階的に習得します。",
      "一门汇集内在成长关键领域的综合大师课。你将循序渐进地掌握意识练习、能量管理、目标规划与习惯养成工具。"),
    level: l("Бүх түвшин", "All levels", "모든 레벨", "全レベル", "所有级别"),
    duration: l("7 долоо хоног", "7 weeks", "7주", "7週間", "7周"),
    format: l("Онлайн + амьд уулзалт", "Online + live sessions", "온라인 + 라이브", "オンライン＋ライブ", "在线+直播"),
    category: l("Хөгжил", "Growth", "성장", "成長", "成长"),
    highlights: la(
      ["14 хичээл", "Амьд Q&A уулзалт", "Ажлын дэвтэр (PDF)"],
      ["14 lessons", "Live Q&A sessions", "Workbook (PDF)"],
      ["14개 강의", "라이브 Q&A", "워크북 (PDF)"],
      ["14のレッスン", "ライブQ&A", "ワークブック (PDF)"],
      ["14节课", "直播问答", "练习手册 (PDF)"]),
    outcomes: la(
      ["Цогц дасгалын систем", "Зорилго төлөвлөх ур чадвар", "Тогтвортой зуршил бүрдүүлэх"],
      ["A complete practice system", "Goal-planning skills", "Building steady habits"],
      ["종합 연습 시스템", "목표 계획 능력", "꾸준한 습관 형성"],
      ["総合的な練習システム", "目標計画スキル", "確かな習慣形成"],
      ["完整的练习体系", "目标规划能力", "建立稳定习惯"]),
  },
];

export const products: Product[] = [
  {
    id: "p1", slug: "meditatsiin-aiyalguu", glyph: "♫", tone: "sky", price: 45000, inStock: true, featured: true,
    title: l("Медитацийн ая дууны цуглуулга", "Meditation audio collection", "명상 음원 컬렉션", "瞑想音源コレクション", "冥想音频合集"),
    short: l("Амралт, төвлөрөлд зориулсан 12 бүтээлийн дижитал цуглуулга.", "A digital collection of 12 tracks for relaxation and focus.", "휴식과 집중을 위한 12곡 디지털 컬렉션.", "リラックスと集中のための12曲のデジタル集。", "用于放松与专注的12首数字合集。"),
    description: l(
      "Гүн амралт, медитаци, унтахын өмнөх төвлөрөлд зориулан бүтээсэн 12 аялгууны дижитал цуглуулга. Татаж аваад офлайн сонсох боломжтой, өндөр чанарын аудиотай.",
      "A digital collection of 12 tracks crafted for deep relaxation, meditation and pre-sleep focus. Downloadable for offline listening, in high-quality audio.",
      "깊은 휴식, 명상, 잠들기 전 집중을 위해 만든 12곡 디지털 컬렉션입니다. 다운로드하여 오프라인으로 들을 수 있으며 고음질입니다.",
      "深いリラックス、瞑想、就寝前の集中のために作られた12曲のデジタル集です。ダウンロードしてオフライン再生でき、高音質です。",
      "为深度放松、冥想与睡前专注而制作的12首数字合集。可下载离线聆听，音质优良。"),
    category: l("Дижитал", "Digital", "디지털", "デジタル", "数字"),
    badge: l("Дижитал", "Digital", "디지털", "デジタル", "数字"),
  },
  {
    id: "p2", slug: "nom-dald-ukhamsriin-tulhuur", glyph: "❧", tone: "violet", price: 35000, inStock: true, featured: true,
    title: l("Ном: Далд ухамсрын түлхүүр", "Book: The Key to the Subconscious", "책: 잠재의식의 열쇠", "書籍：潜在意識の鍵", "书籍：潜意识之钥"),
    short: l("Өөрийгөө танихуйн практик дасгал бүхий цахим ном (PDF + EPUB).", "An e-book with practical self-discovery exercises (PDF + EPUB).", "자기 발견 실습이 담긴 전자책 (PDF + EPUB).", "自己探求の実践ワーク付き電子書籍 (PDF + EPUB)。", "含自我探索练习的电子书 (PDF + EPUB)。"),
    description: l(
      "Далд ухамсрын суурь зарчим, өдөр тутам хэрэглэх дасгалуудыг багтаасан практик цахим ном. PDF болон EPUB форматтай, худалдан авмагц шууд татаж авна.",
      "A practical e-book covering the basics of the subconscious and daily exercises. Available in PDF and EPUB, with instant download after purchase.",
      "잠재의식의 기초 원리와 매일 할 수 있는 연습을 담은 실용 전자책입니다. PDF와 EPUB 형식이며 구매 즉시 다운로드됩니다.",
      "潜在意識の基礎と毎日できるワークをまとめた実用的な電子書籍です。PDFとEPUB形式で、購入後すぐにダウンロードできます。",
      "一本涵盖潜意识基础与每日练习的实用电子书。提供 PDF 和 EPUB 格式，购买后即可下载。"),
    category: l("Дижитал", "Digital", "디지털", "デジタル", "数字"),
    badge: l("Цахим ном", "E-book", "전자책", "電子書籍", "电子书"),
  },
  {
    id: "p3", slug: "aromaterapi-tos", glyph: "❀", tone: "jade", price: 65000, oldPrice: 80000, inStock: true,
    title: l("Аромотерапийн эфирийн тос", "Aromatherapy essential oil", "아로마테라피 에센셜 오일", "アロマテラピー精油", "芳香疗法精油"),
    short: l("Тайвшрал, төвлөрөлд тустай байгалийн гаралтай эфирийн тос.", "A natural essential oil for relaxation and focus.", "휴식과 집중에 좋은 천연 에센셜 오일.", "リラックスと集中に役立つ天然精油。", "有助放松与专注的天然精油。"),
    description: l(
      "Амралт, медитацийн орчныг бүрдүүлэхэд тохиромжтой байгалийн гаралтай эфирийн тосны хольц. Диффузер болон массажид хэрэглэхэд тохиромжтой, 30мл шилэн саванд.",
      "A natural essential-oil blend ideal for creating a relaxing, meditative atmosphere. Suitable for diffusers and massage, in a 30ml glass bottle.",
      "휴식과 명상 분위기를 만드는 데 좋은 천연 에센셜 오일 블렌드입니다. 디퓨저와 마사지에 적합하며 30ml 유리병에 담겨 있습니다.",
      "リラックスや瞑想の雰囲気づくりに最適な天然精油ブレンドです。ディフューザーやマッサージに適し、30mlのガラス瓶入り。",
      "适合营造放松、冥想氛围的天然精油配方。适用于香薰机与按摩，30毫升玻璃瓶装。"),
    category: l("Тос & лаа", "Oils & candles", "오일 & 캔들", "オイル＆キャンドル", "精油与蜡烛"),
    badge: l("Хямдрал", "Sale", "세일", "セール", "促销"),
  },
  {
    id: "p4", slug: "kvarts-bolor", glyph: "◈", tone: "sky", price: 90000, inStock: true,
    title: l("Тунгалаг кварц болор", "Clear quartz crystal", "투명 수정", "クリアクォーツ", "透明石英晶体"),
    short: l("Энергийн дасгал, гоёл чимэглэлд тохиромжтой байгалийн болор.", "A natural crystal for energy practice and decoration.", "에너지 연습과 장식에 좋은 천연 수정.", "エネルギーワークや装飾に適した天然クリスタル。", "适合能量练习与装饰的天然晶体。"),
    description: l(
      "Байгалийн гаралтай тунгалаг кварц болор. Медитаци, энергийн дасгал хийх болон ажлын ширээний гоёл чимэглэлд тохиромжтой. Хэмжээ, хэлбэр бүр өвөрмөц.",
      "A natural clear quartz crystal. Ideal for meditation, energy practice and as a desk decoration. Each piece is unique in size and shape.",
      "천연 투명 수정입니다. 명상, 에너지 연습, 책상 장식에 적합합니다. 크기와 모양은 각각 고유합니다.",
      "天然のクリアクォーツです。瞑想やエネルギーワーク、デスクの装飾に適しています。サイズと形は一つひとつ異なります。",
      "天然透明石英晶体。适合冥想、能量练习与桌面装饰。每件的大小与形状均独一无二。"),
    category: l("Болор чулуу", "Crystals", "크리스털", "クリスタル", "晶石"),
  },
  {
    id: "p5", slug: "energiin-zuult", glyph: "✧", tone: "gold", price: 120000, inStock: true,
    title: l("Энергийн зүүлт (амулет)", "Energy pendant (amulet)", "에너지 펜던트 (부적)", "エネルギーペンダント（お守り）", "能量吊坠（护身符）"),
    short: l("Өдөр тутам зүүх боломжтой гар хийцийн бэлгэдэлт зүүлт.", "A handmade symbolic pendant for everyday wear.", "매일 착용할 수 있는 수공예 상징 펜던트.", "毎日身につけられる手作りの象徴ペンダント。", "可日常佩戴的手工象征吊坠。"),
    description: l(
      "Гар хийцийн, нямбай урласан бэлгэдэлт зүүлт. Өдөр тутам зүүх боломжтой, бэлэг дурсгалд тохиромжтой. Тохируулга бүхий уяатай.",
      "A handmade, carefully crafted symbolic pendant. Great for everyday wear or as a gift, with an adjustable cord.",
      "정성껏 만든 수공예 상징 펜던트입니다. 매일 착용하거나 선물로 좋으며 길이 조절이 가능한 끈이 있습니다.",
      "丁寧に作られた手作りの象徴ペンダントです。普段使いや贈り物に最適で、長さ調整可能なコード付き。",
      "精心制作的手工象征吊坠。适合日常佩戴或作为礼物，配有可调节绳带。"),
    category: l("Гоёл", "Accessories", "액세서리", "アクセサリー", "饰品"),
  },
  {
    id: "p6", slug: "orakl-kart", glyph: "✦", tone: "rose", price: 75000, inStock: false,
    title: l("Зөн билгийн оракл карт", "Intuition oracle cards", "직관 오라클 카드", "直感オラクルカード", "直觉神谕卡"),
    short: l("Өдөр тутмын эргэцүүлэл, дотоод яриаг дэмжих 44 картын багц.", "A 44-card deck to support daily reflection and inner dialogue.", "매일의 성찰과 내면 대화를 돕는 44장 카드 세트.", "日々の内省と内なる対話を支える44枚のカード。", "支持每日反思与内在对话的44张卡牌。"),
    description: l(
      "Өдөр тутмын эргэцүүлэл, дотоод яриаг дэмжих зорилготой 44 картын багц. Хайрцаг болон монгол хэл дээрх удирдамжийн товхимолтой.",
      "A 44-card deck designed to support daily reflection and inner dialogue. Comes in a box with a guidebook.",
      "매일의 성찰과 내면 대화를 돕기 위한 44장 카드 세트입니다. 박스와 가이드북이 함께 제공됩니다.",
      "日々の内省と内なる対話を支えるために作られた44枚のカードセットです。ボックスとガイドブック付き。",
      "为支持每日反思与内在对话而设计的44张卡牌套装。附带包装盒与指南手册。"),
    category: l("Карт", "Cards", "카드", "カード", "卡牌"),
  },
];

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
