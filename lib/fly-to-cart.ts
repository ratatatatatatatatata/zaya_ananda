/** Сагс руу нисэх хөдөлгөөн — ЖИНХЭНЭ сагсны үйлдэл амжилттай болсны ДАРАА л дуудна.
 *  Тайзны зургаас жижиг хуулбар үүсгэж сагсны булан руу нисгэнэ.
 *  Reduced-motion үед юу ч хийхгүй. */
export function flyToCart() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const stage = document.querySelector<HTMLElement>("[data-stage-img] img");
  const from = stage?.getBoundingClientRect();
  if (!from || !stage) return;

  const clone = document.createElement("img");
  clone.src = (stage as HTMLImageElement).src;
  clone.alt = "";
  clone.setAttribute("aria-hidden", "true");
  Object.assign(clone.style, {
    position: "fixed",
    left: `${from.left + from.width / 2 - 36}px`,
    top: `${from.top + from.height / 2 - 36}px`,
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "9999px",
    zIndex: "9999",
    pointerEvents: "none",
    boxShadow: "0 8px 30px -8px rgba(43,200,187,0.6)",
  } as CSSStyleDeclaration);
  document.body.appendChild(clone);

  // Сагсны айкон ихэвчлэн баруун дээд буланд байрладаг
  const toX = window.innerWidth - 70;
  const toY = 26;
  const anim = clone.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${toX - (from.left + from.width / 2 - 36)}px, ${toY - (from.top + from.height / 2 - 36)}px) scale(0.25)`, opacity: 0.3 },
    ],
    { duration: 700, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
  );
  anim.onfinish = () => clone.remove();
  setTimeout(() => clone.remove(), 900); // хамгаалалт
}
