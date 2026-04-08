import Image from "next/image";
import Link from "next/link";
import { getTeamGroups, categorizeTeam, type TeamGroup } from "@/lib/nbb";

const CATEGORIE_VOLGORDE = ["Dames", "Heren", "Jeugd", "Overig"];

export default async function Navbar() {
  const teams = await getTeamGroups();

  const gegroepeerd = CATEGORIE_VOLGORDE.reduce<Record<string, TeamGroup[]>>((acc, cat) => {
    acc[cat] = teams.filter(t => categorizeTeam(t.naam) === cat);
    return acc;
  }, {});

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f1a]/95 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo + naam */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-black text-sm tracking-tight text-white">BINNENLAND</div>
            <div className="text-[10px] text-[#E87722] font-bold tracking-widest uppercase">Barendrecht</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-400">
          <Link href="/#uitslagen" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Uitslagen
          </Link>
          <Link href="/#speelschema" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Speelschema
          </Link>

          {/* Teams dropdown */}
          <div className="relative group">
            <Link
              href="/teams"
              className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1"
            >
              Teams
              <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown panel */}
            <div className="absolute top-full left-0 mt-1 w-[520px] bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 p-4">
              <div className="grid grid-cols-3 gap-4">
                {CATEGORIE_VOLGORDE.filter(cat => gegroepeerd[cat]?.length > 0).map(cat => (
                  <div key={cat}>
                    <div className="text-[#E87722] text-[10px] font-black uppercase tracking-widest mb-2 px-1">{cat}</div>
                    <div className="flex flex-col gap-0.5">
                      {gegroepeerd[cat].map(team => (
                        <Link
                          key={team.id}
                          href={`/teams/${team.id}`}
                          className="text-gray-300 hover:text-white hover:bg-white/5 text-xs px-2 py-1.5 rounded-lg transition-colors truncate"
                        >
                          {team.naam}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 mt-3 pt-3">
                <Link href="/teams" className="text-[#E87722] text-xs font-semibold hover:underline">
                  Alle teams bekijken →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobiel: compacte links */}
        <div className="flex md:hidden items-center gap-3 text-xs text-gray-400">
          <Link href="/#uitslagen" className="hover:text-white transition-colors">Scores</Link>
          <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        </div>

        <Link
          href="/#uitslagen"
          className="bg-[#E87722] hover:bg-[#d06b1a] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition-colors shrink-0"
        >
          Live scores
        </Link>
      </div>
    </nav>
  );
}
