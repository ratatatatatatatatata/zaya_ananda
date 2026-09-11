// Default artwork supplied with the design brief. Admin hero media remains an override.
export const cinematicMedia = {
  hero: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4",
    poster: "/cinematic/hero.jpg",
  },
  capabilities: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4",
    poster: "/cinematic/capabilities.jpg",
  },
};

// All destinations use the existing application routes, not mock actions.
const paths = [
  { href: "/courses", titleKey: "nav.courses", icon: "learn", tags: ["Бясалгал", "Видео хичээл", "4 түвшин"], description: "Өөрийн хэмнэлээр суралцаж, дотоод ертөнцөө таних хичээлүүд. Худалдаж авсан сургалт тань хувийн буланд нээгдэнэ.", en: "Learn at your own pace. Explore meditation and self-discovery, with purchased lessons available in your personal space." },
  { href: "/services", titleKey: "nav.services", icon: "orbit", tags: ["Зөвлөгөө", "Багш", "Цаг захиалга"], description: "Өөрт тохирох үйлчилгээгээ сонгож, багшийн мэдээлэлтэй танилцаад боломжтой цагт захиалга өгөөрэй.", en: "Explore services, meet your practitioner and book an available appointment using our existing booking system." },
  { href: "/ayalal", titleKey: "nav.journey", icon: "journey", tags: ["Аяллын хөтөлбөр", "Хамт олон", "Бүртгэл"], description: "Шинэ орон зай, шинэ мэдрэмж. Өдөр өдрийн хөтөлбөр, хамт явах багтайгаа танилцаад аяллаа сонгоорой.", en: "New places and perspectives. Explore the daily itinerary and travelling team, then choose your journey." },
] as const;

const visuals = [
  { image: "/video/meditation.jpg", caption: "Өөрийгөө таних", captionEn: "Reconnect with yourself", tagsEn: ["Meditation", "Video lessons", "4 levels"] },
  { image: "/video/stream.jpg", caption: "Дотоод тэнцвэр", captionEn: "Find your balance", tagsEn: ["Consultation", "Practitioners", "Appointments"] },
  { image: "/video/temple.jpg", caption: "Шинэ орон зай", captionEn: "A new perspective", tagsEn: ["Itineraries", "Community", "Registration"] },
];
export const cinematicPaths = paths.map((path, i) => ({ ...path, ...visuals[i] }));

export const discoveryLinks = [
  { target: "#services", titleKey: "nav.services", image: "/video/stream.jpg", description: "Өөртөө цаг гаргаарай.", en: "Make time for yourself." },
  { target: "#capabilities", titleKey: "nav.courses", image: "/video/meditation.jpg", description: "Өөрийн хэмнэлээр суралцаарай.", en: "Learn at your own pace." },
  { target: "#ayalal", titleKey: "nav.journey", image: "/video/temple.jpg", description: "Шинэ мэдрэмжийг нээгээрэй.", en: "Discover a new perspective." },
  { target: "#shop", titleKey: "nav.shop", image: "/video/stones.jpg", description: "Өдөр тутмын жижиг сонголт.", en: "Small rituals for every day." },
] as const;
