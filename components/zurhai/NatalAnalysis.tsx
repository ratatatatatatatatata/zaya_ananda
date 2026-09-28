"use client";

import { signOf, type NatalChart as Chart, type PlanetKey } from "@/lib/astro";
import { natalAspects, chartClusters } from "@/lib/natal-analysis";
import { ASPECT_THEMES, HOUSE_THEMES, PLANET_THEMES, SIGN_THEMES } from "@/data/natal-interpretations";
import { useZurhaiRules } from "@/lib/zurhai-rules";

export function NatalAnalysis({ chart }: { chart: Chart }) {
  const rules = useZurhaiRules();
  const aspects = natalAspects(chart);
  const clusters = chartClusters(chart);
  const positions = [
    ...chart.planets.map(p => ({ ...p, title: PLANET_THEMES[p.key].title, domain: PLANET_THEMES[p.key].domain })),
    ...(chart.asc === null ? [] : [{ key: "asc" as const, name: "Мандах орд", glyph: "ASC", lon: chart.asc, house: 1, retro: false, title: "Анхны сэтгэгдэл ба хандлага", domain: "шинэ орчинд өөрийгөө илэрхийлэх, анхны алхмаа хийх" }]),
  ];
  const elementNames = { fire: "Гал", earth: "Шороо", air: "Агаар", water: "Ус" };
  const total = Object.values(chart.elements).reduce((a, b) => a + b, 0);

  return <section className="space-y-6" aria-label="Зурхайн дэлгэрэнгүй шинжилгээ">
    <div className="panel p-5 sm:p-7">
      <p className="eyebrow-line">Таны зураглалын тайлал</p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">Өөрийгөө олон өнцгөөс таних</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">Доорх нь тооцоолсон байрлалд тулгуурласан зурхайн бэлгэдлийн тайлбар юм. Өөрийгөө эргэцүүлэхэд ашиглаарай; зан чанар, ирээдүйг батлан тогтоох дүгнэлт биш.</p>
      {!chart.timeKnown && <p className="mt-3 text-sm text-muted">Төрсөн цаг тодорхойгүй тул Сарны орд, тайлал урьдчилсан байна. Мандах орд, гэрүүд болон Сар оролцсон өнцгийн тайллыг оруулаагүй.</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(chart.elements).map(([key, count]) => <div key={key} className="rounded-2xl bg-surface-2 p-4">
          <div className="flex justify-between gap-2 text-sm"><strong>{elementNames[key as keyof typeof elementNames]}</strong><span>{count} / {total}</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-primary-600" style={{ width: `${count / total * 100}%` }} /></div>
        </div>)}
      </div>
      <p className="mt-3 text-xs text-muted">Махбодын тархалт: 10 гариг болон цаг тодорхой үед мандах ордыг тус бүр нэгээр тоолсон. Энэ нь чанар, амжилтын оноо биш.</p>
      {clusters.map(group => <p key={group.sign.key} className="mt-4 rounded-xl border border-line p-4 text-sm leading-relaxed"><strong>{group.sign.name} ордын төвлөрөл: </strong>{group.planets.map(p => p.name).join(", ")}. Нэг ордод гурав буюу түүнээс олон гариг байрласан тул энэ ордын сэдэв зураглалд давтагдаж байна.</p>)}
    </div>

    <div className="grid items-start gap-4 md:grid-cols-2">
      {positions.map((p, i) => {
        const sign = signOf(p.lon), theme = SIGN_THEMES[sign.key];
        const custom = rules.get(`natal:${p.key}:${sign.key}`);
        return <details key={p.key} className="panel overflow-hidden" open={i < 2}>
          <summary className="cursor-pointer p-5 marker:text-primary-500">
            <span className="ml-1 font-semibold text-ink">{p.glyph} {p.name} · {sign.name}</span>
            <span className="mt-1 block text-sm text-muted">{p.title}</span>
          </summary>
          <div className="space-y-3 border-t border-line p-5 text-sm leading-7 text-muted">
            {custom ? <p className="whitespace-pre-line">{custom}</p> : <>
              <p><strong className="text-ink">Илэрхийлэх хандлага: </strong>{p.domain} сэдэвт {theme.style} хандлагыг бэлгэддэг.</p>
              <p><strong className="text-ink">Дэмжих чанар: </strong>{theme.strength}.</p>
              <p><strong className="text-ink">Эргэцүүлэх дасгал: </strong>{theme.practice}.</p>
            </>}
            {p.house !== null && <p><strong className="text-ink">{p.house}-р гэр · {HOUSE_THEMES[p.house - 1].title}. </strong>{HOUSE_THEMES[p.house - 1].text}</p>}
            {p.retro && <p>Ухрах хөдөлгөөн: Дэлхийгээс харахад гаригийн уртраг буурч байсан. Зурхайн уламжлалд энэ сэдвээ дотроо нягтлах, дахин эргэцүүлэх бэлгэдэл гэж тайлбарладаг.</p>}
            {(["uranus", "neptune", "pluto"] as string[]).includes(p.key) && <p className="text-xs">Удаан хөдөлдөг гаригийн орд олон хүний үед нийтлэг байдаг. Үүнийг хувийн онцлог гэж дангаар дүгнэхгүй.</p>}
          </div>
        </details>;
      })}
    </div>

    <div className="panel p-5 sm:p-7">
      <h3 className="text-xl font-semibold text-ink">Гаригуудын хоорондын холбоо</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">Тойрог дээрх хоёр гаригийн өнцгийг харьцуулж, үндсэн таван холбоог тооцлоо. Зөрүү бага байх тусам сонгосон өнцөгт ойр байна.</p>
      <p className="mt-2 text-xs text-muted">{ASPECT_THEMES.map(a => `${a.angle}° ±${a.orb}°`).join(" · ")}</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {aspects.map(a => <details key={`${a.a.key}-${a.b.key}`} className="rounded-2xl border border-line p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">{a.a.name} · {a.b.name}<span className="mt-1 block font-normal text-muted">{a.name} {a.angle}° · Зөрүү {a.deviation.toFixed(1)}°</span></summary>
          <p className="mt-3 text-sm leading-7 text-muted"><strong>{PLANET_THEMES[a.a.key as PlanetKey].title} / {PLANET_THEMES[a.b.key as PlanetKey].title}. </strong>{a.text}</p>
        </details>)}
      </div>
      {!aspects.length && <p className="mt-4 text-sm text-muted">Сонгосон өнцгийн хязгаарт тохирох холбоо олдсонгүй.</p>}
    </div>
    {chart.cusps && <div className="panel p-5 sm:p-7">
      <h3 className="text-xl font-semibold text-ink">12 гэрийн зураглал</h3>
      <p className="mt-2 text-sm text-muted">Гариггүй гэр нь тухайн амьдралын сэдэв байхгүй гэсэн үг биш.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {HOUSE_THEMES.map((house, index) => <div key={house.title} className="rounded-2xl border border-line p-4">
          <p className="text-xs text-muted">{index + 1}-р гэр · {signOf(chart.cusps![index]).name}</p>
          <h4 className="mt-1 font-semibold text-ink">{house.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">{house.text}</p>
          <p className="mt-3 text-sm font-medium text-ink">{chart.planets.filter(p => p.house === index + 1).map(p => `${p.glyph} ${p.name}`).join(" · ") || "Гариг байрлаагүй"}</p>
        </div>)}
      </div>
    </div>}
  </section>;
}
