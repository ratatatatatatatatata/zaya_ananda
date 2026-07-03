import { redirect } from "next/navigation";

/** Холбоо барих нь "Бидний тухай" хуудсанд нэгтгэгдсэн. */
export default function ContactPage() {
  redirect("/about#contact");
}
