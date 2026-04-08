import Image from "next/image";

interface Wedstrijd {
  id: string;
  datum: string;
  tijd: string;
  thuis: string;
  uit: string;
  locatie: string;
  score: string;
}

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
  const recenteUitslagen = binnenlandWedstrijden.filter(w => w.score).slice(-4).reverse();
  const laasteUitslag = recenteUitslagen[0];

  const [thuisScore, uitScore] = laasteUitslag
    ? laasteUitslag.score.split("-").map(s => parseInt(s.trim(), 10))
    : [0, 0];
  const gewonnen = laasteUitslag
    ? (isBinnenland(laasteUitslag.thuis) && thuisScore > uitScore) ||
      (isBinnenland(laasteUitslag.uit) && uitScore > thuisScore)
    : null;

  const gespeeld = binnenlandWedstrijden.filter(w => w.score).length;
  const gewonnenCount = binnenlandWedstrijden.filter(w => {
    if (!w.score) return false;
    const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
    return (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t);
  }).length;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>

      {/* Scorebalk */}
      {laasteUitslag && (
        <div className="bg-[#8B2020] text-white text-xs py-2 px-4 flex items-center justify-center gap-4">
          <span className="opacity-60 uppercase tracking-widest font-semibold hidden sm:inline">Laatste uitslag</span>
          <span className="font-bold">{shortName(laasteUitslag.thuis)} <span className="text-white/60 mx-1">vs</span> {shortName(laasteUitslag.uit)}</span>
          <span className="font-black bg-white/20 px-2 py-0.5 rounded">{laasteUitslag.score}</span>
          <span className={`font-black px-2 py-0.5 rounded text-xs ${gewonnen ? "bg-green-700" : "bg-black/30"}`}>
            {gewonnen ? "GEWONNEN" : "VERLOREN"}
          </span>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section className="relative h-[55vh] min-h-[320px] max-h-[520px] flex items-center overflow-hidden">
        <Image
          src="/fotos/20221105201834_IMG_9964.JPG"
          alt="Binnenland in actie"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <div className="inline-flex items-center gap-2 bg-[#8B2020]/40 border border-[#8B2020]/60 text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Dames Eredivisie
          </div>
          <h1 className="text-4xl sm:text-6xl font-black leading-none tracking-tight mb-1">
            <span className="text-white">BINNEN</span><span className="text-[#E87722]">LAND</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-semibold tracking-[0.25em] uppercase mb-5">Barendrecht</p>
          <div className="flex flex-wrap gap-3">
            <a href="#uitslagen" className="px-5 py-2.5 bg-[#E87722] hover:bg-[#d06b1a] text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-orange-900/40">
              Uitslagen
            </a>
            <a href="#speelschema" className="px-5 py-2.5 border-2 border-white/20 hover:border-white/50 text-white font-bold text-sm rounded-full transition-all">
              Speelschema
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS BALK ═══ */}
      <section className="bg-[#8B2020]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: gespeeld, label: "Gespeeld" },
            { value: gewonnenCount, label: "Gewonnen" },
            { value: gespeeld - gewonnenCount, label: "Verloren" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-red-200 text-xs uppercase tracking-widest mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ACTIE SECTIE ═══ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden group">
          <Image
            src="/fotos/20221105194236_IMG_9869.JPG"
            alt="Actie"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a]/60 to-transparent" />
          {/* Oranje accent balk */}
          <div className="absolute bottom-0 left-0 w-1.5 h-full bg-[#E87722]" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-[#E87722] text-xs font-black uppercase tracking-widest">Het team</div>
          <h2 className="text-4xl font-black leading-tight">
            Spelen met <span className="text-[#E87722]">passie</span> voor Barendrecht
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Binnenland Barendrecht staat voor aanvallend basketball, teamspirit en een sterke club uit het hart van Barendrecht. Onze dames strijden elk seizoen in de Eredivisie voor de hoogste eer.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { label: "Opgericht", value: "1974" },
              { label: "Competitie", value: "Eredivisie" },
              { label: "Stad", value: "Barendrecht" },
              { label: "Thuishal", value: "De Binnenlandse" },
            ].map(item => (
              <div key={item.label} className="bg-[#1A1A2E] rounded-xl px-4 py-3 border border-white/5">
                <div className="text-[#E87722] text-xs uppercase tracking-wider mb-1">{item.label}</div>
                <div className="font-bold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UITSLAGEN ═══ */}
      <section id="uitslagen" className="bg-[#1A1A2E] py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Resultaten</div>
              <h2 className="text-3xl font-black">Recente uitslagen</h2>
            </div>
            <a href="/uitslagen" className="text-gray-400 hover:text-white text-sm transition-colors">Alles bekijken →</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recenteUitslagen.map(w => {
              const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
              const win = (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t);
              return (
                <div key={w.id} className="bg-[#0f0f1a] rounded-2xl p-5 border border-white/5 hover:border-[#E87722]/40 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500">{w.datum}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${win ? "bg-green-900/50 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {win ? "W" : "V"}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{shortName(w.thuis)}</div>
                    <div className="text-3xl font-black text-[#E87722] my-2">{w.score}</div>
                    <div className="text-xs text-gray-500">{shortName(w.uit)}</div>
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-3 truncate">📍 {w.locatie}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TEAM BANNER ═══ */}
      <section id="team" className="relative h-48 sm:h-64 overflow-hidden">
        <Image
          src="/fotos/20230125_214959.jpg"
          alt="Team Binnenland"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/60 to-[#0f0f1a]" />
        <div className="absolute inset-0 bg-[#8B2020]/20" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <div className="text-2xl sm:text-4xl font-black mb-2 px-4">EÉN TEAM. ÉÉN DOEL.</div>
            <div className="text-[#E87722] font-bold tracking-widest uppercase text-sm">Binnenland Barendrecht</div>
          </div>
        </div>
      </section>

      {/* ═══ FOTO GRID ═══ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Sfeer</div>
        <h2 className="text-3xl font-black mb-6">In de zaal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {[
            { src: "/fotos/20230114_184155.jpg", alt: "Overzicht zaal", className: "col-span-2 h-44 sm:h-64" },
            { src: "/fotos/IMG_0569.JPG", alt: "Actie onder de ring", className: "h-44 sm:h-64" },
            { src: "/fotos/IMG_0580.JPG", alt: "Verdedigen", className: "h-44 sm:h-64" },
            { src: "/fotos/20221105194236_IMG_9869.JPG", alt: "Shot omhoog", className: "h-44 sm:h-64" },
          ].map(foto => (
            <div key={foto.src} className={`relative rounded-2xl overflow-hidden group ${foto.className}`}>
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SPEELSCHEMA ═══ */}
      <section id="speelschema" className="bg-[#1A1A2E] py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Kalender</div>
          <h2 className="text-3xl font-black mb-10">Speelschema</h2>
          <div className="space-y-2">
            {alleWedstrijden.slice(0, 10).map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#0f0f1a] border border-white/5 rounded-xl px-5 py-3.5 hover:border-[#E87722]/30 transition-colors">
                <div className="text-gray-500 text-xs w-32 shrink-0">{w.datum} · {w.tijd}</div>
                <div className="flex-1 flex items-center gap-3">
                  <span className={`flex-1 text-sm font-semibold text-right ${isBinnenland(w.thuis) ? "text-[#E87722]" : "text-white"}`}>
                    {shortName(w.thuis)}
                  </span>
                  <span className="bg-[#1A1A2E] border border-white/10 text-white font-bold text-xs px-3 py-1.5 rounded-lg min-w-[64px] text-center shrink-0">
                    {w.score || "–"}
                  </span>
                  <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-[#E87722]" : "text-white"}`}>
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
              <div className="text-gray-600 text-xs">Dames Eredivisie Basketball</div>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#uitslagen" className="hover:text-white transition-colors">Uitslagen</a>
            <a href="#speelschema" className="hover:text-white transition-colors">Speelschema</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
          </div>
          <div className="text-gray-700 text-xs">
            © {new Date().getFullYear()} Binnenland Barendrecht · Data: basketballstats.nl
          </div>
        </div>
      </footer>
    </div>
  );
}
