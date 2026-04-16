import Image from "next/image";
import {
  getWedstrijden, getStand, computeStats,
  shortName, isBinnenland, PLAYERS,
} from "@/lib/wedstrijden";
import VariantNav from "@/app/components/VariantNav";
import Results2 from "./Results2";

const TOP_SCORERS = [
  { naam: "Emma de Vries",    nummer: 7,  wed: 14, pts: 187, gem: 13.4 },
  { naam: "Noor de Jong",     nummer: 9,  wed: 14, pts: 165, gem: 11.8 },
  { naam: "Mila van den Berg",nummer: 23, wed: 13, pts: 142, gem: 10.9 },
  { naam: "Sophie Janssen",   nummer: 4,  wed: 14, pts:  98, gem:  7.0 },
  { naam: "Lisa Bakker",      nummer: 12, wed: 12, pts:  87, gem:  7.3 },
];

const BESTUUR = [
  { naam: "Hans van der Berg",  rol: "Voorzitter",           foto: "/spelers/player6.png" },
  { naam: "Marieke Visser",     rol: "Secretaris",           foto: "/spelers/player3.png" },
  { naam: "Rob Janssen",        rol: "Penningmeester",       foto: "/spelers/player7.png" },
  { naam: "Anja de Groot",      rol: "Wedstrijdsecretaris",  foto: "/spelers/player2.png" },
];

const STAF = [
  { naam: "Mark Konings",   rol: "Hoofdcoach",      foto: "/spelers/player4.png" },
  { naam: "Sarah de Vries", rol: "Assistent-coach", foto: "/spelers/player5.png" },
  { naam: "Tom Bakker",     rol: "Teammanager",     foto: "/spelers/player1.png" },
  { naam: "Linda Peters",   rol: "Fysiotherapeut",  foto: "/spelers/player7.png" },
];

const TRAININGEN = [
  { dag: "Maandag",    tijd: "20:00 – 22:00", locatie: "Sporthal De Aanloop, Barendrecht", type: "Techniek & Tactiek" },
  { dag: "Donderdag",  tijd: "20:00 – 22:00", locatie: "Sporthal De Aanloop, Barendrecht", type: "Conditie & Teamspel" },
  { dag: "Zaterdag",   tijd: "10:00 – 11:30", locatie: "Sporthal De Aanloop, Barendrecht", type: "Wedstrijdvoorbereiding (optioneel)" },
];

const SPONSORS = [
  { naam: "Rabobank Barendrecht",  tier: "Hoofdsponsor",  kleur: "#003D6E" },
  { naam: "Toyota Ridderkerk",     tier: "Goud",          kleur: "#C8922A" },
  { naam: "Jumbo Barendrecht",     tier: "Goud",          kleur: "#FDC400" },
  { naam: "Makelaardij Van Dijk",  tier: "Zilver",        kleur: "#6B6B6B" },
  { naam: "Sportcentrum Barendrecht", tier: "Zilver",     kleur: "#2C7A4B" },
  { naam: "Drukkerij de Zon",      tier: "Partner",       kleur: "#B03A2E" },
  { naam: "Fysiotherapie Oostzaan",tier: "Partner",       kleur: "#1A5276" },
  { naam: "Café De Hoek",          tier: "Partner",       kleur: "#784212" },
];


const CMP_ID = 429;

export default async function Home2() {
  const [all, stand] = await Promise.all([
    getWedstrijden(),
    getStand(CMP_ID),
  ]);
  const { laatste, gewonnen, gespeeld, gewonnenCount, verloren, recenteUitslagen, binnenland } = computeStats(all);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#111111]" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <VariantNav active="/home2" />

      {/* Scoreticker */}
      {laatste && (
        <div className="bg-[#0D2566] text-white text-xs py-2 px-6 flex items-center justify-center gap-4">
          <span className="uppercase tracking-widest font-bold opacity-60 hidden sm:inline">Laatste uitslag</span>
          <span className="font-semibold">{shortName(laatste.thuis)}</span>
          <span className="font-black bg-white/15 px-2 py-0.5 rounded">{laatste.score}</span>
          <span className="font-semibold">{shortName(laatste.uit)}</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${gewonnen ? "bg-green-600" : "bg-[#D31F30]"}`}>
            {gewonnen ? "Gewonnen" : "Verloren"}
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="bg-[#0D2566] text-white">
        <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-16 h-16 relative bg-white rounded-full p-1.5 shrink-0 shadow-xl">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-0.5" />
              </div>
              <div>
                <div className="text-[#a0b4d0] text-xs uppercase tracking-widest font-semibold mb-1">Dames Eredivisie · Dames 1</div>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                  Binnenland <span className="text-[#D31F30]">Barendrecht</span>
                </h1>
              </div>
            </div>
            <p className="text-[#b0c4dc] text-sm leading-relaxed max-w-md mb-6">
              Volg het complete seizoen van Dames 1 — uitslagen, stand, spelers, training en meer.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ["#team","Team"],["#uitslagen","Uitslagen"],["#scorers","Top Scorers"],
                ["#ranglijst","Ranglijst"],["#staf","Staf"],["#training","Training"],
                ["#speelschema","Schema"],["#sponsoren","Sponsors"],["#instagram","Instagram"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-0 shrink-0 border border-white/15 rounded overflow-hidden">
            {[
              { value: gespeeld, label: "Gespeeld" },
              { value: gewonnenCount, label: "Gewonnen" },
              { value: verloren, label: "Verloren" },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center px-8 py-6 ${i < 2 ? "border-r border-white/15" : ""}`}>
                <div className="text-5xl font-black text-[#D31F30]">{stat.value}</div>
                <div className="text-[#a0b4d0] text-[10px] uppercase tracking-widest mt-1 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-1 bg-[#D31F30]" />

      {/* ═══ TEAM ═══ */}
      <section id="team" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Het team" sub="Dames 1 Selectie" />
          <div className="grid md:grid-cols-5 gap-8 mb-10 bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="md:col-span-3 p-8">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                Dames 1 van Binnenland Barendrecht is al meer dan vijftig jaar een begrip in het Nederlandse vrouwenbasketbal. Met een trouwe achterban, een toegewijde technische staf en een hechte spelersgroep gaan ze elk seizoen voor de top.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                De ploeg staat bekend om haar snelle, aanvallende speelstijl en de sterke onderlinge band. Elke week geven deze speelsters het maximale voor hun club en hun stad.
              </p>
              <div className="flex gap-4 mt-6 flex-wrap">
                {[
                  { v: "1974", l: "Opgericht" },
                  { v: "Eredivisie", l: "Competitie" },
                  { v: "Barendrecht", l: "Thuisstad" },
                ].map(x => (
                  <div key={x.l} className="border-l-2 border-[#D31F30] pl-3">
                    <div className="font-black text-[#0D2566] text-sm">{x.v}</div>
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 relative min-h-[200px]">
              <Image src="/spelers/team.JPG" alt="Team" fill className="object-cover" />
            </div>
          </div>
          <h3 className="text-sm font-black text-[#0D2566] uppercase tracking-widest mb-5">Selectie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PLAYERS.map((p, i) => (
              <div key={p.naam} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative h-56">
                  <Image
                    src={`/spelers/player${(i % 7) + 1}.png`}
                    alt={p.naam}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#0D2566] text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow">
                    {p.nummer}
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100">
                  <div className="font-bold text-xs text-gray-900 leading-tight">{p.naam}</div>
                  <div className="text-[#D31F30] text-[10px] font-bold uppercase tracking-wider mt-0.5">{p.positie}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UITSLAGEN ═══ */}
      <section id="uitslagen" className="py-12 bg-[#0D2566]">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Uitslagen" sub="Laatste 10 wedstrijden" light />
          {recenteUitslagen.length > 0 ? (
            <Results2 results={recenteUitslagen} />
          ) : (
            <p className="text-white/50 text-sm">Nog geen uitslagen beschikbaar.</p>
          )}
        </div>
      </section>

      {/* ═══ TOP SCORERS ═══ */}
      <section id="scorers" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Top Scorers" sub="Dames 1 · Seizoen 2025–2026" note="*Placeholder statistieken" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#0D2566]">
                  {["#","Speler","Wedstrijden","Totaal punten","Gem. per wed."].map(h => (
                    <th key={h} className={`py-2 px-4 text-[10px] font-black uppercase tracking-widest text-[#0D2566] ${h === "Speler" ? "text-left" : "text-center"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_SCORERS.map((s, i) => (
                  <tr key={s.naam} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === 0 ? "bg-amber-50" : ""}`}>
                    <td className="py-3 px-4 text-center">
                      {i === 0
                        ? <span className="text-amber-500 font-black">🏆</span>
                        : <span className="text-gray-400 text-xs font-bold">{i + 1}</span>
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#0D2566] text-white text-xs font-black flex items-center justify-center shrink-0">
                          {s.nummer}
                        </div>
                        <span className="font-semibold">{s.naam}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{s.wed}</td>
                    <td className="py-3 px-4 text-center font-black text-[#0D2566]">{s.pts}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-black px-2 py-0.5 rounded text-sm ${i === 0 ? "bg-amber-100 text-amber-700" : "text-[#D31F30]"}`}>
                        {s.gem}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ RANGLIJST ═══ */}
      <section id="ranglijst" className="py-12 bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Ranglijst" sub="Eredivisie Dames · 2025–2026" />
          {stand.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#0D2566]">
                    <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] w-8">#</th>
                    <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566]">Team</th>
                    <th className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] text-center">Gespeeld</th>
                    <th className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] text-center">W</th>
                    <th className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] text-center">V</th>
                    <th className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] text-center">Punten</th>
                    <th className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-[#0D2566] text-center hidden sm:table-cell">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {stand.map((team) => {
                    const wins = team.punten - team.gespeeld;
                    const losses = 2 * team.gespeeld - team.punten;
                    const isOwn = team.clb_id === 53;
                    return (
                      <tr
                        key={team.ID}
                        className={`border-b border-gray-100 transition-colors ${isOwn ? "bg-[#0D2566]/5 font-bold" : "hover:bg-gray-50"}`}
                      >
                        <td className="py-3 px-3 text-gray-500 text-xs">{team.positie}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {isOwn && <div className="w-1.5 h-1.5 rounded-full bg-[#D31F30] shrink-0" />}
                            <span className={isOwn ? "text-[#0D2566]" : "text-gray-800"}>{team.team}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">{team.gespeeld}</td>
                        <td className="py-3 px-3 text-center text-green-700 font-semibold">{wins}</td>
                        <td className="py-3 px-3 text-center text-red-600 font-semibold">{losses}</td>
                        <td className={`py-3 px-3 text-center font-black ${isOwn ? "text-[#D31F30]" : "text-[#0D2566]"}`}>{team.punten}</td>
                        <td className="py-3 px-3 text-center text-gray-500 text-xs hidden sm:table-cell">{team.saldo > 0 ? `+${team.saldo}` : team.saldo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Ranglijst niet beschikbaar.</p>
          )}
        </div>
      </section>

      {/* ═══ BESTUUR & STAF ═══ */}
      <section id="staf" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Bestuur &amp; Staf" sub="De mensen achter de club" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0D2566] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#D31F30]" />Bestuur
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BESTUUR.map((p) => (
                  <div key={p.naam} className="bg-[#F0F2F5] rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="relative h-48">
                      <Image src={p.foto} alt={p.naam} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D2566]/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <div className="text-white text-xs font-bold leading-tight">{p.naam}</div>
                        <div className="text-[#a0b4d0] text-[10px] mt-0.5">{p.rol}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0D2566] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#D31F30]" />Technische staf
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {STAF.map((p) => (
                  <div key={p.naam} className="bg-[#F0F2F5] rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="relative h-48">
                      <Image src={p.foto} alt={p.naam} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D2566]/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <div className="text-white text-xs font-bold leading-tight">{p.naam}</div>
                        <div className="text-[#a0b4d0] text-[10px] mt-0.5">{p.rol}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRAININGSTIJDEN ═══ */}
      <section id="training" className="py-12 bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Trainingstijden" sub="Dames 1 · Seizoen 2025–2026" />
          <div className="grid sm:grid-cols-3 gap-4">
            {TRAININGEN.map((t) => (
              <div key={t.dag} className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-[#0D2566] hover:shadow-md transition-shadow">
                <div className="text-[#D31F30] text-xs font-black uppercase tracking-widest mb-3">{t.dag}</div>
                <div className="text-2xl font-black text-[#0D2566] mb-1">{t.tijd}</div>
                <div className="text-gray-600 text-sm mb-3">{t.type}</div>
                <div className="flex items-start gap-1.5 text-gray-400 text-xs">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D31F30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t.locatie}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#0D2566]/5 border border-[#0D2566]/20 rounded-lg p-4 text-sm text-gray-600">
            <strong className="text-[#0D2566]">Nieuw lid?</strong> Kom gerust een keer vrijblijvend meekijken of meedoen. Neem contact op via{" "}
            <a href="mailto:info@binnenlandbarendrecht.nl" className="text-[#D31F30] font-semibold hover:underline">
              info@binnenlandbarendrecht.nl
            </a>
          </div>
        </div>
      </section>

      {/* ═══ SPEELSCHEMA ═══ */}
      <section id="speelschema" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Speelschema" sub="Alle wedstrijden van Dames 1" />
          <div className="divide-y divide-gray-100">
            {binnenland.map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 hover:bg-gray-50 transition-colors px-2 -mx-2">
                <div className="text-gray-400 text-xs w-40 shrink-0">{w.datum} · {w.tijd}</div>
                <div className="flex-1 flex items-center gap-4">
                  <span className={`flex-1 text-sm text-right font-semibold ${isBinnenland(w.thuis) ? "text-[#0D2566]" : "text-gray-600"}`}>
                    {shortName(w.thuis)}
                  </span>
                  <span className={`text-sm font-bold px-3 py-1 rounded min-w-[56px] text-center ${w.score ? "bg-[#0D2566] text-white" : "bg-gray-100 text-gray-400"}`}>
                    {w.score || "–"}
                  </span>
                  <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-[#0D2566]" : "text-gray-600"}`}>
                    {shortName(w.uit)}
                  </span>
                </div>
                <div className="text-gray-400 text-xs sm:w-40 shrink-0 truncate">{w.locatie}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPONSOREN ═══ */}
      <section id="sponsoren" className="py-12 bg-[#0D2566] text-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Onze sponsoren" sub="Dankzij hun steun kunnen wij spelen" light />
          {/* Hoofdsponsor */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#a0b4d0] mb-3">Hoofdsponsor</div>
            {SPONSORS.filter(s => s.tier === "Hoofdsponsor").map(s => (
              <div key={s.naam} className="bg-white/10 border border-white/20 rounded-xl px-8 py-6 inline-flex items-center gap-4 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white" style={{ background: s.kleur }}>
                  {s.naam.charAt(0)}
                </div>
                <div className="text-xl font-black">{s.naam}</div>
              </div>
            ))}
          </div>
          {/* Goud */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#a0b4d0] mb-3">Goud</div>
            <div className="flex flex-wrap gap-3">
              {SPONSORS.filter(s => s.tier === "Goud").map(s => (
                <div key={s.naam} className="bg-white/10 border border-white/15 rounded-lg px-6 py-4 flex items-center gap-3 hover:bg-white/15 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0" style={{ background: s.kleur }}>
                    {s.naam.charAt(0)}
                  </div>
                  <span className="font-bold text-sm">{s.naam}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Zilver + Partner */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#a0b4d0] mb-3">Zilver &amp; Partners</div>
            <div className="flex flex-wrap gap-2">
              {SPONSORS.filter(s => s.tier === "Zilver" || s.tier === "Partner").map(s => (
                <div key={s.naam} className="bg-white/5 border border-white/10 rounded px-4 py-2.5 flex items-center gap-2 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0" style={{ background: s.kleur }}>
                    {s.naam.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-300">{s.naam}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[#a0b4d0] text-sm">
              Word ook sponsor?{" "}
              <a href="mailto:sponsor@binnenlandbarendrecht.nl" className="text-white font-bold hover:text-[#D31F30] transition-colors">
                Neem contact op →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM ═══ */}
      <section id="instagram" className="py-12 bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader title="Instagram" sub="Volg ons voor het laatste nieuws en sfeer" />
          <a
            href="https://www.instagram.com/binnenlandvrouwen"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-px">
              <div className="bg-white rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center gap-8 group-hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <svg className="w-9 h-9" fill="url(#ig-grad)" viewBox="0 0 24 24">
                      <defs>
                        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fcb045" />
                          <stop offset="50%" stopColor="#fd1d1d" />
                          <stop offset="100%" stopColor="#833ab4" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-2xl font-black text-gray-900 mb-1">@binnenlandvrouwen</div>
                  <div className="text-gray-500 text-sm mb-4">Volg ons op Instagram voor wedstrijdsfeer, trainingsbeelden en het laatste nieuws van Dames 1.</div>
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-sm px-5 py-2.5 rounded-full group-hover:opacity-90 transition-opacity">
                    Volgen op Instagram
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D2566] text-white py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative bg-white rounded-full p-0.5">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            <div>
              <div className="font-black">Binnenland Barendrecht</div>
              <div className="text-[#a0b4d0] text-xs">Dames 1 · Eredivisie Basketball</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#a0b4d0]">
            {[["#team","Team"],["#uitslagen","Uitslagen"],["#ranglijst","Ranglijst"],["#staf","Staf"],["#training","Training"],["#speelschema","Schema"],["#sponsoren","Sponsors"]].map(([h, l]) => (
              <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-[#a0b4d0] text-xs">© {new Date().getFullYear()} Binnenland Barendrecht</div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, sub, note, light }: { title: string; sub?: string; note?: string; light?: boolean }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className={`text-2xl font-black uppercase tracking-tight ${light ? "text-white" : "text-[#0D2566]"}`}>{title}</h2>
        {sub && <div className={`text-xs mt-0.5 ${light ? "text-[#a0b4d0]" : "text-gray-400"}`}>{sub}</div>}
        {note && <div className="text-xs text-gray-400 mt-0.5 italic">{note}</div>}
      </div>
      <div className={`h-0.5 flex-1 mx-6 ${light ? "bg-white/15" : "bg-gray-200"}`} />
      <div className="w-6 h-0.5 bg-[#D31F30] shrink-0" />
    </div>
  );
}
