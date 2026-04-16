import Image from "next/image";
import { getWedstrijden, computeStats, shortName, isBinnenland, PLAYERS } from "@/lib/wedstrijden";
import VariantNav from "@/app/components/VariantNav";
import Results3 from "./Results3";

export default async function Home3() {
  const all = await getWedstrijden();
  const { laatste, gewonnen, gespeeld, gewonnenCount, verloren, recenteUitslagen, binnenland } = computeStats(all);

  return (
    <div className="min-h-screen bg-[#0D2566] text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <VariantNav active="/home3" />

      {/* Top banner */}
      {laatste && (
        <div className="bg-[#D31F30] text-white px-6 py-2 flex items-center justify-center gap-5 text-xs">
          <span className="uppercase tracking-[0.25em] font-bold opacity-70 hidden sm:inline">Laatste uitslag</span>
          <span className="font-semibold">{shortName(laatste.thuis)}</span>
          <span className="font-black bg-black/20 px-2 py-0.5 rounded">{laatste.score}</span>
          <span className="font-semibold">{shortName(laatste.uit)}</span>
          <span className={`font-black px-2 py-0.5 rounded uppercase ${gewonnen ? "bg-green-700/80" : "bg-black/30"}`}>
            {gewonnen ? "GEWONNEN" : "VERLOREN"}
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-5">
          <Image src="/logo.png" alt="" fill className="object-contain object-right scale-150" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#D31F30]" />

        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 relative shrink-0 bg-white rounded-full p-1.5 shadow-2xl">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
            </div>
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.5em] mb-2">Dames Eredivisie</div>
              <h1 className="text-5xl sm:text-7xl font-black leading-none uppercase">
                BINNENLAND<br />
                <span className="text-[#D31F30]">BARENDRECHT</span>
              </h1>
            </div>
          </div>
          <p className="text-[#8fa3c7] text-lg sm:text-xl font-light tracking-widest mb-10">
            Trots. Passie. Barendrecht.
          </p>
          <div className="flex gap-3">
            <a href="#uitslagen" className="px-6 py-3 bg-[#D31F30] hover:bg-[#b01828] text-white font-black text-xs uppercase tracking-[0.25em] transition-colors">
              Uitslagen
            </a>
            <a href="#team" className="px-6 py-3 border-2 border-white/25 hover:border-white/60 text-white font-black text-xs uppercase tracking-[0.25em] transition-colors">
              Team
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-3">
          {[
            { value: gespeeld, label: "Gespeeld" },
            { value: gewonnenCount, label: "Gewonnen" },
            { value: verloren, label: "Verloren" },
          ].map((stat, i) => (
            <div key={stat.label} className={`py-10 text-center ${i < 2 ? "border-r border-white/10" : ""}`}>
              <div className="text-6xl sm:text-7xl font-black text-[#D31F30] leading-none">{stat.value}</div>
              <div className="text-[#8fa3c7] text-[10px] uppercase tracking-[0.35em] mt-2 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Uitslagen */}
      <section id="uitslagen" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-[#D31F30]" />
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.4em]">Resultaten</div>
              <h2 className="text-3xl font-black uppercase">Uitslagen</h2>
            </div>
          </div>
          {recenteUitslagen.length > 0 ? (
            <Results3 results={recenteUitslagen} />
          ) : (
            <p className="text-[#8fa3c7] text-sm">Nog geen uitslagen.</p>
          )}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 bg-[#0a1f55]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-[#D31F30]" />
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.4em]">Het team</div>
              <h2 className="text-3xl font-black uppercase">Dames 1</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <p className="text-[#8fa3c7] leading-relaxed mb-4 text-sm">
                Dames 1 vertegenwoordigt Binnenland Barendrecht op het allerhoogste niveau. Dit team is trots op zijn stad, zijn club en zijn speelstijl. Elke wedstrijd is een statement.
              </p>
              <p className="text-[#8fa3c7] leading-relaxed text-sm">
                Met meer dan vijftig jaar basketbalgeschiedenis in de benen gaat Dames 1 elke week de strijd aan met het beste van Nederland.
              </p>
              <div className="flex gap-4 mt-8">
                {[
                  { v: "1974", l: "Opgericht" },
                  { v: "D1", l: "Eredivisie" },
                  { v: "BBL", l: "Club" },
                ].map(x => (
                  <div key={x.l} className="border border-white/15 px-4 py-3 rounded">
                    <div className="text-[#D31F30] text-2xl font-black">{x.v}</div>
                    <div className="text-[#8fa3c7] text-[10px] uppercase tracking-wider">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://picsum.photos/seed/bbl-team2/800/500"
                alt="Team"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f55]/40 to-transparent" />
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#D31F30]" />
            </div>
          </div>

          <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.4em] mb-6">De selectie</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {PLAYERS.map((p, i) => (
              <div key={p.naam} className="group border border-white/10 hover:border-[#D31F30]/60 transition-colors overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={`https://picsum.photos/seed/player${i + 1}/200/220`}
                    alt={p.naam}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-95 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2566]/95 via-[#0D2566]/30 to-transparent" />
                  <div className="absolute top-0 left-0 bg-[#D31F30] text-white text-sm font-black px-2 py-1 leading-none">
                    #{p.nummer}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <div className="text-white text-xs font-bold leading-tight">{p.naam}</div>
                    <div className="text-[#D31F30] text-[10px] uppercase font-black tracking-wider">{p.positie}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speelschema */}
      <section id="speelschema" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-[#D31F30]" />
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.4em]">Kalender</div>
              <h2 className="text-3xl font-black uppercase">Speelschema</h2>
            </div>
          </div>
          <div className="space-y-1">
            {binnenland.map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#0a1f55]/50 border border-white/5 hover:border-[#D31F30]/30 px-5 py-3.5 transition-colors">
                <div className="text-[#8fa3c7] text-xs w-40 shrink-0">{w.datum} · {w.tijd}</div>
                <div className="flex-1 flex items-center gap-4">
                  <span className={`flex-1 text-sm text-right font-semibold ${isBinnenland(w.thuis) ? "text-white" : "text-[#8fa3c7]"}`}>
                    {shortName(w.thuis)}
                  </span>
                  <span className={`font-black text-sm px-3 py-1.5 min-w-[60px] text-center ${w.score ? "bg-[#D31F30] text-white" : "bg-white/5 text-[#8fa3c7]"}`}>
                    {w.score || "–"}
                  </span>
                  <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-white" : "text-[#8fa3c7]"}`}>
                    {shortName(w.uit)}
                  </span>
                </div>
                <div className="text-[#8fa3c7]/50 text-xs sm:w-44 shrink-0 truncate">{w.locatie}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="font-black text-sm">Binnenland Barendrecht</div>
              <div className="text-[#8fa3c7] text-xs">Dames 1 · Eredivisie</div>
            </div>
          </div>
          <div className="text-[#8fa3c7]/50 text-xs">© {new Date().getFullYear()} Binnenland Barendrecht</div>
        </div>
      </footer>
    </div>
  );
}
