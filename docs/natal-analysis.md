# Natal analysis

The existing natal chart now powers the astrology selector on both `/` and `/merge`.
Legacy wealth-reading cards are excluded at render time and from the admin editor/save;
stored historical settings are not destructively deleted. Numerology and Matrix remain.

## Scope

Inspired by AstroFormer's public birth-chart workflow, independently implemented.
This is **Western tropical natal analysis**, not AstroFormer's private API, Swiss Ephemeris,
Vedic calculations, AI chat, or its complete catalogue of tools.

Astronomy Engine 2.1.19 (MIT) calculates geocentric apparent ecliptic longitudes of date
for Sun, Moon and eight planets. Retrograde markers use a centred one-day difference.
Placidus cusps are calculated from apparent sidereal time and true obliquity;
Whole Sign and Equal are selectable. Polar/non-convergent Placidus uses Equal and
shows the fallback. Birth years 1800 through today are supported by the UI.

IANA time zones include historical DST. Invalid dates/zones and skipped local hours
are rejected. Repeated local hours require an explicit UTC offset validated against
the zone. A typed city must be chosen from results; manual coordinates/timezone work
when the external city search is unavailable. Open-Meteo receives only the city query;
birth date/time and the resulting reading are calculated in the browser, not sent to it.

Unknown time uses local noon and omits ascendant, houses and lunar aspects. Moon
placement is provisional. Symbolic interpretations are original rule-based text,
not AI-generated forecasts or scientific personality/financial predictions.
Admin overrides: `natal:sun:leo`, `natal:moon:cancer`, `natal:asc:libra`, etc.

Major aspects: conjunction/opposition ±8°, square/trine ±6°, sextile ±4°.
Element distribution gives every planet and known ascendant one count, not a score.

Run `node scripts/test-natal.cjs` and `npm run build` to verify.

Independent Swiss Ephemeris/Moshier fixtures cover five dates (1900–2020),
Mongolia, Northern/Southern hemispheres, all ten longitudes and twelve Placidus cusps.
Tolerance: 0.03 degrees. Swiss Ephemeris is used only to produce reference numbers,
not bundled as a runtime dependency.
