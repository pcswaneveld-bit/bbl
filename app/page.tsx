import Image from "next/image";
import ResultsSection from "./components/ResultsSection";
import VariantNav from "./components/VariantNav";

interface Wedstrijd {
  id: string;
  datum: string;
  tijd: string;
  thuis: string;
  uit: string;
  locatie: string;
  score: string;
}

const PLAYERS = [
  { naam: "Emma de Vries", nummer: 7, positie: "Guard" },
  { naam: "Lisa Bakker", nummer: 12, positie: "Forward" },
  { naam: "Sophie Janssen", nummer: 4, positie: "Center" },
  { naam: "Mila van den Berg", nummer: 23, positie: "Guard" },
  { naam: "Anna Smit", nummer: 15, positie: "Forward" },
  { naam: "Noor de Jong", nummer: 9, positie: "Guard" },
  { naam: "Fleur Willems", nummer: 11, positie: "Forward" },
  { naam: "Laura Peters", nummer: 3, positie: "Center" },
  { naam: "Rosa Hendriks", nummer: 21, positie: "Guard" },
  { naam: "Amber Mulder", nummer: 18, positie: "Forward" },
  { naam: "Iris Visser", nummer: 6, positie: "Center" },
  { naam: "Zoë Meijer", nummer: 14, positie: "Guard" },
];

async function getWedstrijden(): Promise<Wedstrijd[]> {
  try {
    const res = await fetch(
      "https://www.basketballstats.nl/db/wedstrijd/uitslag.pl?cmp_ID=429&szn_Naam=huidig&tonen=1",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "nl-NL,nl;q=0.9",
          Referer: "https://www.basketballstats.nl/",
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const html = await res.text();
    return parseWedstrijden(html);
  } catch {
    return [];
  }
}

function parseWedstrijden(html: string): Wedstrijd[] {
  const results: Wedstrijd[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let tdMatch;
    const localTd = new RegExp(tdRegex.source, "gi");
    while ((tdMatch = localTd.exec(trMatch[1])) !== null) {
      cells.push(tdMatch[1].replace(/<[^>]+>/g, "").trim());
    }
    if (cells.length >= 7 && cells[0].includes("-")) {
      results.push({ id: cells[0], datum: cells[1], tijd: cells[2], thuis: cells[3], uit: cells[4], locatie: cells[5], score: cells[6] });
    }
  }
  return results;
}

function isBinnenland(naam: string) {
  return naam.toLowerCase().includes("binnenland");
}

function shortName(naam: string) {
  return naam.replace(" Vrouwen Senioren 1", "").replace(" Dames 1", "");
}

export default async function Home() {
  const alleWedstrijden = await getWedstrijden();
  const binnenlandWedstrijden = alleWedstrijden.filter(w => isBinnenland(w.thuis) || isBinnenland(w.uit));
  const gespeeldeWedstrijden = binnenlandWedstrijden.filter(w => w.score);

  const laasteUitslag = [...gespeeldeWedstrijden].reverse()[0];
  const [thuisScore, uitScore] = laasteUitslag
    ? laasteUitslag.score.split("-").map(s => parseInt(s.trim(), 10))
    : [0, 0];
  const gewonnen = laasteUitslag
    ? (isBinnenland(laasteUitslag.thuis) && thuisScore > uitScore) ||
      (isBinnenland(laasteUitslag.uit) && uitScore > thuisScore)
    : null;

  const gespeeld = gespeeldeWedstrijden.length;
  const gewonnenCount = gespeeldeWedstrijden.filter(w => {
    const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
    return (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t);
  }).length;

  const recenteUitslagen = [...gespeeldeWedstrijden].reverse().slice(0, 10).map(w => {
    const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
    return { ...w, win: (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t) };
  });

  return (
    <div className="min-h-screen bg-[#05060E] text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <VariantNav active="/" />

      {/* Scorebalk */}
      {laasteUitslag && (
        <div className="bg-gradient-to-r from-violet-900 to-blue-900 text-white text-xs py-2 px-4 flex items-center justify-center gap-4">
          <span className="opacity-60 uppercase tracking-widest font-semibold hidden sm:inline">Laatste uitslag</span>
          <span className="font-bold">
            {shortName(laasteUitslag.thuis)}
            <span className="text-white/50 mx-2">vs</span>
            {shortName(laasteUitslag.uit)}
          </span>
          <span className="font-black bg-white/20 px-2 py-0.5 rounded">{laasteUitslag.score}</span>
          <span className={`font-black px-2 py-0.5 rounded text-xs ${gewonnen ? "bg-green-700/80" : "bg-black/30"}`}>
            {gewonnen ? "GEWONNEN" : "VERLOREN"}
          </span>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#05060E] via-[#150d35] to-[#0a1628]" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-800/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-800/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-24">
          <div className="inline-flex items-center gap-2 bg-violet-900/40 border border-violet-700/50 text-violet-300 text-[10px] font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Dames Eredivisie · Seizoen 2025–2026
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 relative shrink-0 drop-shadow-2xl">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight">
                <span className="text-white">BINNEN</span><span className="text-violet-400">LAND</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-semibold tracking-[0.3em] uppercase mt-2">
                Barendrecht · Dames 1
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            Strijden met passie, winnen als één team.
          </p>

          {laasteUitslag && (
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-10">
              <span className="text-xs text-gray-500 uppercase tracking-wider shrink-0">Laatste</span>
              <span className="font-bold text-sm">{shortName(laasteUitslag.thuis)}</span>
              <span className={`font-black text-lg px-3 py-1 rounded-lg min-w-[72px] text-center ${gewonnen ? "bg-green-900/50 text-green-300" : "bg-red-900/30 text-red-300"}`}>
                {laasteUitslag.score}
              </span>
              <span className="font-bold text-sm">{shortName(laasteUitslag.uit)}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <a href="#uitslagen" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-violet-900/40">
              Bekijk uitslagen
            </a>
            <a href="#speelschema" className="px-6 py-3 border-2 border-white/20 hover:border-violet-500/60 text-white hover:text-violet-300 font-bold text-sm rounded-full transition-all">
              Speelschema
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-gradient-to-r from-violet-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: gespeeld, label: "Gespeeld" },
            { value: gewonnenCount, label: "Gewonnen" },
            { value: gespeeld - gewonnenCount, label: "Verloren" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-4xl sm:text-5xl font-black">{stat.value}</div>
              <div className="text-violet-200 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ UITSLAGEN ═══ */}
      <section id="uitslagen" className="bg-[#090A18] py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-8">
            <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-2">Resultaten</div>
            <h2 className="text-3xl font-black">Laatste wedstrijden</h2>
          </div>
          {recenteUitslagen.length > 0 ? (
            <ResultsSection results={recenteUitslagen} />
          ) : (
            <p className="text-gray-500 text-sm">Nog geen uitslagen beschikbaar.</p>
          )}
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section id="team" className="py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Intro */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-3">Het team</div>
              <h2 className="text-4xl font-black mb-5 leading-tight">
                Één groep.<br />Één <span className="text-violet-400">doel</span>.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Dames 1 van Binnenland Barendrecht is een team vol karakter. Elke week gaan deze vrouwen de strijd aan op het hoogste niveau — gedreven door teamspirit en de wil om te winnen voor Barendrecht.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Al meer dan vijftig jaar is Binnenland meer dan een club. Het is een thuis. Een plek waar talent bloeit, vriendschappen worden gesmeed en basketbal wordt beleefd zoals het hoort: met volle overgave.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Opgericht", value: "1974" },
                  { label: "Competitie", value: "Eredivisie" },
                  { label: "Thuisstad", value: "Barendrecht" },
                ].map(item => (
                  <div key={item.label} className="bg-[#0C0D1E] rounded-xl px-4 py-3 border border-white/5">
                    <div className="text-violet-400 text-[10px] uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-bold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 sm:h-[440px] rounded-2xl overflow-hidden">
              <Image
                src="https://picsum.photos/seed/bbl-team/800/600"
                alt="Team Binnenland"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060E]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-violet-500/20 rounded-2xl pointer-events-none" />
              <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-l-2xl" />
            </div>
          </div>

          {/* Selectie */}
          <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-6">De selectie</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {PLAYERS.map((player, i) => (
              <div key={player.naam} className="bg-[#0C0D1E] rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/40 transition-colors group">
                <div className="relative h-36">
                  <Image
                    src={`https://picsum.photos/seed/player${i + 1}/200/200`}
                    alt={player.naam}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D1E] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 bg-gradient-to-br from-violet-600 to-blue-600 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                    {player.nummer}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-xs leading-tight">{player.naam}</div>
                  <div className="text-violet-400 text-[10px] uppercase tracking-wider mt-1">{player.positie}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPEELSCHEMA ═══ */}
      <section id="speelschema" className="bg-[#090A18] py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-2">Kalender</div>
          <h2 className="text-3xl font-black mb-10">Speelschema</h2>
          <div className="space-y-2">
            {binnenlandWedstrijden.map(w => (
              <div
                key={w.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#0C0D1E] border border-white/5 rounded-xl px-5 py-3.5 hover:border-violet-500/30 transition-colors"
              >
                <div className="text-gray-500 text-xs w-40 shrink-0">{w.datum} · {w.tijd}</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className={`flex-1 text-sm font-semibold text-right ${isBinnenland(w.thuis) ? "text-violet-400" : "text-white"}`}>
                    {shortName(w.thuis)}
                  </span>
                  <span className="bg-[#070914] border border-white/10 text-white font-bold text-xs px-3 py-1.5 rounded-lg min-w-[64px] text-center shrink-0">
                    {w.score || "–"}
                  </span>
                  <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-violet-400" : "text-white"}`}>
                    {shortName(w.uit)}
                  </span>
                </div>
                <div className="text-gray-600 text-xs sm:text-right sm:w-44 shrink-0 truncate">📍 {w.locatie}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="font-black">Binnenland Barendrecht</div>
              <div className="text-gray-600 text-xs">Dames 1 · Eredivisie Basketball</div>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#uitslagen" className="hover:text-white transition-colors">Uitslagen</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
            <a href="#speelschema" className="hover:text-white transition-colors">Speelschema</a>
          </div>
          <div className="text-gray-700 text-xs">
            © {new Date().getFullYear()} Binnenland Barendrecht · Data: basketballstats.nl
          </div>
        </div>
      </footer>
    </div>
  );
}
