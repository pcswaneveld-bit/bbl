import Image from "next/image";
import { getWedstrijden, computeStats, shortName, isBinnenland, PLAYERS } from "@/lib/wedstrijden";
import VariantNav from "@/app/components/VariantNav";
import Results1 from "./Results1";

export default async function Home1() {
  const all = await getWedstrijden();
  const { laatste, gewonnen, gespeeld, gewonnenCount, verloren, recenteUitslagen, binnenland } = computeStats(all);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <VariantNav active="/home1" />

      {/* Score ticker */}
      {laatste && (
        <div className="bg-[#D31F30] text-white px-6 py-2 flex items-center justify-center gap-6 text-xs">
          <span className="font-black uppercase tracking-[0.25em] opacity-70 hidden sm:inline">Latest Result</span>
          <span className="font-bold">{shortName(laatste.thuis)}</span>
          <span className="font-black text-lg bg-black/25 px-3 py-0.5 rounded">{laatste.score}</span>
          <span className="font-bold">{shortName(laatste.uit)}</span>
          <span className={`font-black uppercase tracking-widest px-2 py-0.5 rounded ${gewonnen ? "bg-green-600" : "bg-black/30"}`}>
            {gewonnen ? "W" : "L"}
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2566]/20 via-transparent to-transparent" />
        <div className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-[#D31F30]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          <div>
            <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              Dames Eredivisie · 2025–2026
            </div>
            <div className="flex items-end gap-5 mb-3">
              <div className="w-16 h-16 relative shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <h1 className="text-6xl sm:text-8xl font-black leading-none tracking-tighter uppercase">
                BINNENLAND
              </h1>
            </div>
            <div className="text-[#D31F30] text-2xl sm:text-4xl font-black uppercase tracking-[0.3em] mb-10">
              BARENDRECHT
            </div>
            <div className="flex gap-3">
              <a href="#uitslagen" className="px-6 py-3 bg-[#D31F30] hover:bg-[#b01828] text-white font-black text-xs uppercase tracking-[0.2em] transition-colors">
                Uitslagen
              </a>
              <a href="#speelschema" className="px-6 py-3 border border-white/20 hover:border-white/50 text-white font-black text-xs uppercase tracking-[0.2em] transition-colors">
                Schema
              </a>
            </div>
          </div>

          {laatste && (
            <div className="hidden lg:flex flex-col items-end shrink-0 gap-1">
              <div className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-bold">Laatste wedstrijd</div>
              <div className="text-gray-500 text-xs mb-2">{laatste.datum}</div>
              <div className="text-gray-400 text-sm">{shortName(laatste.thuis)}</div>
              <div className={`text-6xl font-black my-1 ${gewonnen ? "text-[#D31F30]" : "text-gray-600"}`}>
                {laatste.score}
              </div>
              <div className="text-gray-400 text-sm">{shortName(laatste.uit)}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest mt-3 ${gewonnen ? "text-green-400" : "text-gray-600"}`}>
                {gewonnen ? "● GEWONNEN" : "● VERLOREN"}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#D31F30]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-3">
          {[
            { value: gespeeld, label: "Gespeeld" },
            { value: gewonnenCount, label: "Gewonnen" },
            { value: verloren, label: "Verloren" },
          ].map((stat, i) => (
            <div key={stat.label} className={`py-8 px-6 text-center ${i < 2 ? "border-r border-red-400/30" : ""}`}>
              <div className="text-6xl sm:text-7xl font-black leading-none">{stat.value}</div>
              <div className="text-white/70 text-[10px] uppercase tracking-[0.35em] mt-2 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Uitslagen */}
      <section id="uitslagen" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-0.5 h-8 bg-[#D31F30]" />
            <h2 className="text-3xl font-black uppercase tracking-tight">Uitslagen</h2>
          </div>
          {recenteUitslagen.length > 0 ? (
            <Results1 results={recenteUitslagen} />
          ) : (
            <p className="text-gray-700 text-sm">Nog geen uitslagen.</p>
          )}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-0.5 h-8 bg-[#D31F30]" />
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.35em]">De selectie</div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Dames 1</h2>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-10 max-w-xl pl-4">
            Twaalf speelsters. Één missie. Alles geven voor Barendrecht.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {PLAYERS.map((p, i) => (
              <div key={p.naam} className="group relative bg-[#0A0A0A] border border-white/5 hover:border-[#D31F30]/50 transition-colors overflow-hidden">
                <div className="relative h-44">
                  <Image
                    src={`https://picsum.photos/seed/player${i + 1}/200/240`}
                    alt={p.naam}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-0 right-0 bg-[#D31F30] text-white font-black text-xl w-9 h-9 flex items-center justify-center">
                    {p.nummer}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="font-bold text-xs leading-tight">{p.naam}</div>
                    <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-wider mt-0.5">{p.positie}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#0A0A0A] border border-white/5 p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="relative h-48 md:w-64 w-full shrink-0 rounded overflow-hidden">
              <Image src="https://picsum.photos/seed/bbl-action/600/400" alt="Team" fill className="object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]" />
            </div>
            <div>
              <div className="text-[#D31F30] text-[10px] font-black uppercase tracking-[0.35em] mb-3">Over het team</div>
              <h3 className="text-2xl font-black uppercase mb-3">Meer dan een ploeg</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Dames 1 van Binnenland Barendrecht speelt al decennialang op het hoogste niveau. Met onvoorwaardelijke toewijding en een sterk team vormen zij het hart van de club.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speelschema */}
      <section id="speelschema" className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-0.5 h-8 bg-[#D31F30]" />
            <h2 className="text-3xl font-black uppercase tracking-tight">Speelschema</h2>
          </div>
          <div className="divide-y divide-white/5">
            {binnenland.map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="text-gray-700 text-xs font-mono w-40 shrink-0">{w.datum} {w.tijd}</div>
                <div className="flex-1 flex items-center gap-4">
                  <span className={`flex-1 text-sm text-right ${isBinnenland(w.thuis) ? "text-white font-bold" : "text-gray-500"}`}>
                    {shortName(w.thuis)}
                  </span>
                  <span className={`text-sm font-black px-3 py-1 min-w-[56px] text-center rounded ${w.score ? "bg-[#D31F30] text-white" : "bg-white/5 text-gray-700"}`}>
                    {w.score || "–"}
                  </span>
                  <span className={`flex-1 text-sm ${isBinnenland(w.uit) ? "text-white font-bold" : "text-gray-500"}`}>
                    {shortName(w.uit)}
                  </span>
                </div>
                <div className="text-gray-700 text-xs sm:w-44 shrink-0 truncate">{w.locatie}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div className="font-black uppercase text-sm tracking-wider">Binnenland Barendrecht</div>
          </div>
          <div className="text-gray-800 text-xs">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}
