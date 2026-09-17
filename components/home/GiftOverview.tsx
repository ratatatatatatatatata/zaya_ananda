import Image from "next/image";
import Link from "next/link";
import styles from "./GiftMedia.module.css";

const gifts = [
  { title: "Podcast", description: "Ярилцлагаас шинэ өнцөг, урам аваарай.", image: "/video/temple.jpg" },
  { title: "Бясалгал дасгал", description: "Өөртөө цаг гаргаж, дотоод тайвшралаа олоорой.", image: "/video/meditation.jpg" },
  { title: "Зөвлөмж", description: "Өдөр тутамдаа хэрэгжүүлэх энгийн зөвлөмжүүд.", image: "/video/stream.jpg" },
];

export function GiftOverview() {
  return <div className={styles.overview}>
    {gifts.map((gift, index) => <Link key={gift.title} href="/gift" className={`${styles.category} focus-ring`}>
      <div className={styles.categoryImage}>
        <Image src={gift.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" />
        <span className={styles.number} aria-hidden="true">0{index + 1}</span>
      </div>
      <div className={styles.categoryCopy}>
        <h3>{gift.title}</h3>
        <p>{gift.description}</p>
        <span className={styles.more}>Бүх агуулгыг үзэх <span aria-hidden="true">↗</span></span>
      </div>
    </Link>)}
  </div>;
}
