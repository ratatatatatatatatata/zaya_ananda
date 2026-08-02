/** Төхөөрөмжийн таних тэмдэг — гэрээний 3-р зүйлийн «төхөөрөмжийн хязгаарлалт»-д зориулсан.
 *  Хөтөч бүрд тогтвортой санамсаргүй ID үүсгэж хадгална (хувийн мэдээлэл цуглуулахгүй). */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "za_device_id";
  let id = "";
  try {
    id = localStorage.getItem(KEY) || "";
    if (!id) {
      id = "d_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(KEY, id);
    }
  } catch {
    id = "d_temp";
  }
  return id;
}
