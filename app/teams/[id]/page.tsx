import Image from "next/image";
import Link from "next/link";
import {
  getTeamGroups, getWedstrijden, getStand,
  isBinnenland, formatDatum, formatTijd,
  type NbbWedstrijd, type NbbStand,
} from "@/lib/nbb";

interface Props {
  params: Promise<{ id: string }>;
}

function scoreDisplay(w: NbbWedstrijd) {
  if (w.score_thuis === null || w.score_uit === null) return null;
  return `${w.score_thuis} - ${w.score_uit}`;
}

function isGewonnen(w: NbbWedstrijd): boolean | null {
  if (w.score_thuis === null || w.score_uit === null) return null;
  return (isBinnenland(w.thuis_club_id) && w.score_thuis > w.score_uit) ||
    (isBinnenland(w.uit_club_id) && w.score_uit > w.score_thuis);
}

function WedstrijdRij({ w }: { w: NbbWedstrijd }) {
  const score = scoreDisplay(w);
  const gewonnen = isGewonnen(w);
  const isThuis = isBinnenland(w.thuis_club_id);

  return (
    <div className="flex items-center gap-3 bg-[#0f0f1a] border border-white/5 rounded-xl px-4 py-3 hover:border-[#E87722]/30 transition-colors">
      <div className="text-gray-500 text-xs w-28 shrink-0">
        <div>{formatDatum(w.datum)}</div>
        <div>{formatTijd(w.datum)}</div>
      </div>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        {/* Thuis logo */}
        <div className="w-6 h-6 relative shrink-0">
          <Image src={w.logo_thuis} alt="" fill className="object-contain" unoptimized />
        </div>
        <span className={`text-sm font-semibold flex-1 text-right truncate ${isThuis ? "text-[#E87722]" : "text-white"}`}>
          {w.thuis_ploeg}
        </span>

        {/* Score */}
        <div className="shrink-0 min-w-[72px] text-center">
          {score ? (
            <span className={`font-black text-sm px-2.5 py-1 rounded-lg ${
              gewonnen === true ? "bg-green-900/40 text-green-400" :
              gewonnen === false ? "bg-red-900/30 text-red-400" :
              "bg-white/5 text-white"
            }`}>
              {score}
            </span>
          ) : (
            <span className="text-gray-600 text-sm">vs</span>
          )}
        </div>

        <span className={`text-sm font-semibold flex-1 truncate ${!isThuis ? "text-[#E87722]" : "text-white"}`}>
          {w.uit_ploeg}
        </span>
        {/* Uit logo */}
        <div className="w-6 h-6 relative shrink-0">
          <Image src={w.logo_uit} alt="" fill className="object-contain" unoptimized />
        </div>
      </div>

      <div className="text-gray-600 text-xs w-36 text-right shrink-0 truncate hidden sm:block">
        {w.loc_naam}
      </div>
    </div>
  );
}

function StandTabel({ stand, plg_ID }: { stand: NbbStand[]; plg_ID: number }) {
  if (stand.length === 0) return <p className="text-gray-500 text-sm">Geen stand beschikbaar.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
            <th className="text-left pb-3 w-6">#</th>
            <th className="text-left pb-3">Team</th>
            <th className="text-center pb-3 w-10">G</th>
            <th className="text-center pb-3 w-10">W</th>
            <th className="text-center pb-3 w-10">V</th>
            <th className="text-center pb-3 w-16 hidden sm:table-cell">Saldo</th>
            <th className="text-center pb-3 w-12">Pnt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {stand.map(rij => {
            const isEigenTeam = rij.ID === plg_ID;
            const gespeeld = rij.gespeeld;
            const gewonnen = Math.round((parseFloat(rij.percentage) / 100) * gespeeld);
            const verloren = gespeeld - gewonnen;

            return (
              <tr
                key={rij.ID}
                className={`transition-colors ${isEigenTeam ? "bg-[#E87722]/10 text-white" : "text-gray-300 hover:bg-white/3"}`}
              >
                <td className="py-3 pr-2">
                  <span className={`font-black text-xs ${isEigenTeam ? "text-[#E87722]" : "text-gray-500"}`}>
                    {rij.positie}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative shrink-0">
                      <Image src={rij.logo} alt="" fill className="object-contain" unoptimized />
                    </div>
                    <span className={`font-medium ${isEigenTeam ? "text-[#E87722]" : ""}`}>
                      {rij.afko}
                    </span>
                    {isEigenTeam && <span className="text-[10px] bg-[#E87722] text-white px-1.5 py-0.5 rounded font-black">JIJ</span>}
                  </div>
                </td>
                <td className="py-3 text-center text-gray-400">{gespeeld}</td>
                <td className="py-3 text-center text-green-400">{gewonnen}</td>
                <td className="py-3 text-center text-red-400">{verloren}</td>
                <td className="py-3 text-center text-gray-400 hidden sm:table-cell">{rij.saldo > 0 ? `+${rij.saldo}` : rij.saldo}</td>
                <td className="py-3 text-center font-black">{rij.punten}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params;
  const plg_ID = parseInt(id, 10);

  const [alleTeams, wedstrijden] = await Promise.all([
    getTeamGroups(),
    getWedstrijden(plg_ID),
  ]);

  const team = alleTeams.find(t => t.id === plg_ID);
  if (!team) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏀</div>
          <h1 className="text-2xl font-black mb-2">Team niet gevonden</h1>
          <Link href="/teams" className="text-[#E87722] hover:underline">← Terug naar teams</Link>
        </div>
      </div>
    );
  }

  // Haal standen op voor alle competities van dit team
  const standenPerComp = await Promise.all(
    team.comp_ids.map(async c => ({
      helft: c.helft,
      comp_id: c.comp_id,
      stand: await getStand(c.comp_id),
    }))
  );

  const gespeeld = wedstrijden.filter(w => w.score_thuis !== null);
  const gepland = wedstrijden.filter(w => w.score_thuis === null);
  const gewonnen = gespeeld.filter(w => isGewonnen(w) === true).length;
  const verloren = gespeeld.filter(w => isGewonnen(w) === false).length;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <div className="bg-[#1A1A2E] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <Link href="/teams" className="text-gray-500 text-xs hover:text-white transition-colors mb-4 inline-block">
            ← Alle teams
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="text-[#E87722] text-xs font-black uppercase tracking-widest">CBV Binnenland</div>
              <h1 className="text-3xl sm:text-4xl font-black">{team.naam}</h1>
            </div>
          </div>

          {/* Stats */}
          {gespeeld.length > 0 && (
            <div className="flex gap-6 mt-6 text-center">
              {[
                { label: "Gespeeld", value: gespeeld.length },
                { label: "Gewonnen", value: gewonnen, kleur: "text-green-400" },
                { label: "Verloren", value: verloren, kleur: "text-red-400" },
              ].map(s => (
                <div key={s.label}>
                  <div className={`text-2xl font-black ${s.kleur ?? "text-white"}`}>{s.value}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-12">

        {/* Stand(en) */}
        <section>
          <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Competitie</div>
          <h2 className="text-2xl font-black mb-6">Stand</h2>
          <div className={standenPerComp.length > 1 ? "grid md:grid-cols-2 gap-6" : ""}>
            {standenPerComp.map(c => (
              <div key={c.comp_id} className="bg-[#1A1A2E] rounded-2xl p-5 border border-white/5">
                {standenPerComp.length > 1 && (
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">{c.helft} helft</div>
                )}
                <StandTabel stand={c.stand} plg_ID={plg_ID} />
              </div>
            ))}
          </div>
        </section>

        {/* Uitslagen */}
        {gespeeld.length > 0 && (
          <section>
            <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Resultaten</div>
            <h2 className="text-2xl font-black mb-6">Uitslagen</h2>
            <div className="space-y-2">
              {gespeeld.slice().reverse().map(w => (
                <WedstrijdRij key={w.id} w={w} />
              ))}
            </div>
          </section>
        )}

        {/* Speelschema */}
        {gepland.length > 0 && (
          <section>
            <div className="text-[#E87722] text-xs font-black uppercase tracking-widest mb-2">Kalender</div>
            <h2 className="text-2xl font-black mb-6">Speelschema</h2>
            <div className="space-y-2">
              {gepland.map(w => (
                <WedstrijdRij key={w.id} w={w} />
              ))}
            </div>
          </section>
        )}

        {wedstrijden.length === 0 && (
          <p className="text-gray-500">Nog geen wedstrijden beschikbaar voor dit team.</p>
        )}
      </div>
    </div>
  );
}
