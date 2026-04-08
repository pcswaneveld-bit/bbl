import Link from "next/link";
import { getTeamGroups, categorizeTeam, type TeamGroup } from "@/lib/nbb";

const VOLGORDE = ["Dames", "Heren", "Jeugd", "Overig"];

const CATEGORIE_KLEUR: Record<string, string> = {
  Dames: "text-pink-400 border-pink-400/30 bg-pink-400/10",
  Heren: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Jeugd: "text-green-400 border-green-400/30 bg-green-400/10",
  Overig: "text-gray-400 border-gray-400/30 bg-gray-400/10",
};

function TeamCard({ team, categorie }: { team: TeamGroup; categorie: string }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="bg-[#1A1A2E] border border-white/5 rounded-2xl p-5 hover:border-[#E87722]/50 hover:-translate-y-0.5 transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-white leading-tight">{team.naam}</h3>
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${CATEGORIE_KLEUR[categorie]}`}>
          {categorie}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        {team.comp_ids.length} competitie{team.comp_ids.length !== 1 ? "s" : ""}
      </div>
      <div className="text-[#E87722] text-xs font-semibold mt-auto">
        Bekijk team →
      </div>
    </Link>
  );
}

export default async function TeamsPage() {
  const teams = await getTeamGroups();

  const gegroepeerd = VOLGORDE.reduce<Record<string, TeamGroup[]>>((acc, cat) => {
    acc[cat] = teams.filter(t => categorizeTeam(t.naam) === cat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <div className="bg-[#1A1A2E] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">CBV Binnenland</div>
          <h1 className="text-4xl font-black">Onze teams</h1>
          <p className="text-gray-400 mt-2">Alle teams van Binnenland Barendrecht · Seizoen 2025-2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 space-y-12">
        {VOLGORDE.filter(cat => gegroepeerd[cat]?.length > 0).map(cat => (
          <section key={cat}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-black">{cat}</h2>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${CATEGORIE_KLEUR[cat]}`}>
                {gegroepeerd[cat].length} teams
              </span>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gegroepeerd[cat].map(team => (
                <TeamCard key={team.id} team={team} categorie={cat} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
