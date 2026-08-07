import { MergeToorog } from "@/components/MergeToorog";

export const metadata = {
  title: "Мэргэ төөрөг — төрсөн огноогоор тайлагдах хувь заяа",
  description:
    "Астрологи, тоон судлал, хувь тавилангийн матрикс, Human Design — дөрвөн системийг нэгтгэсэн мэргэ төөрөг. Төрсөн он, сар, өдрөө оруулаад өдөр тутмын тайлал, сар, жилийн зураглалаа аваарай.",
};

export default function MergePage() {
  return (
    <div className="container-px py-12 sm:py-16">
      <MergeToorog />
    </div>
  );
}
