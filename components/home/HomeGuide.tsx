"use client";

import { useI18n } from "@/lib/i18n";

const steps = [
  ["Танилцах", "Нээлттэй подкаст, зөвлөмж, бясалгалын бичлэгүүдээс эхлээрэй.", "#gift"],
  ["Чиглэлээ сонгох", "Сургалт, аялал, үйлчилгээний мэдээлэлтэй танилцаарай.", "#courses"],
  ["Дэлгэрэнгүй үзэх", "Хөтөлбөр, багш, үнэ болон оролцох нөхцөлийг хараарай.", "#services"],
  ["Бүртгүүлэх", "Сонгосон хөтөлбөрийн дэлгэрэнгүй хэсгээс бүртгэлээ үргэлжлүүлээрэй.", "#courses"],
  ["Холбогдох", "Тодруулах зүйл байвал манай багтай холбогдоорой.", "/about#contact"],
];
const questions = [
  ["Хаанаас эхлэх вэ?", "Гэгээн бэлэг хэсэгт бүртгэлгүй үзэх нээлттэй бичлэгүүд бий. Өөрт тохирох сэдвээ сонгож эхлээрэй."],
  ["Сургалтын мэдээллийг хаанаас харах вэ?", "Ариусахуйн үйл хэсгээс түвшнээ сонгоод сургалтын дэлгэрэнгүй мэдээлэл, багш, үнэ болон хөтөлбөрийг харна."],
  ["Үйлчилгээний цаг хэрхэн захиалах вэ?", "Энергийн засал хэсгээс үйлчилгээгээ сонгож, дэлгэрэнгүй мэдээллийг нээгээд цаг захиалах үйлдлээр үргэлжлүүлнэ."],
  ["Аяллын хөтөлбөрийг үзэж болох уу?", "Сүнслэг аялал хэсэгт аялал бүрийн дэлгэрэнгүй хөтөлбөр, хамт явах баг болон бүртгэлийн мэдээлэл байна."],
];

export function HomeGuide() {
  const { tl } = useI18n();
  return <section className="editorial-guide section" aria-labelledby="guide-title">
    <div className="container-px">
      <p className="discovery-kicker">{tl("ТАНЫ ЭХНИЙ АЛХАМ")}</p>
      <h2 id="guide-title">{tl("Өөртэйгөө ойртох")}<strong>{tl("алхам алхмаар")}</strong></h2>
      <p className="editorial-lead">{tl("Өөрийн хэмнэлээр танилцаж, танд тохирох чиглэлээ сонгоорой.")}</p>
      <ol className="editorial-steps">{steps.map(([title,description,href],i)=><li key={href+title}>
        <a href={href}><span className="editorial-step-number">{String(i+1).padStart(2,"0")}</span><h3>{tl(title)}</h3></a><p>{tl(description)}</p>
      </li>)}</ol>
      <div className="editorial-faq">
        <div><p className="discovery-kicker">{tl("ТҮГЭЭМЭЛ АСУУЛТ")}</p><h2>{tl("Танд туслах")}<strong>{tl("хариултууд")}</strong></h2><a href="/about#contact" className="btn btn-outline">{tl("Холбоо барих")}</a></div>
        <div>{questions.map(([question,answer])=><details key={question} name="home-questions"><summary>{tl(question)}<span aria-hidden="true">+</span></summary><p>{tl(answer)}</p></details>)}</div>
      </div>
    </div>
  </section>;
}
