const BASE = "https://db.basketball.nl/db/json";
export const CLB_ID = 53;

export interface NbbTeam {
  id: number;
  naam: string;
  sportlink: number;
  comp_id: number;
  helft: string;
  soort: string;
  club_id: number;
}

export interface TeamGroup {
  id: number;
  naam: string;
  sportlink: number;
  comp_ids: { comp_id: number; helft: string }[];
}

export interface NbbWedstrijd {
  id: number;
  datum: string;
  thuis_ploeg: string;
  uit_ploeg: string;
  score_thuis: number | null;
  score_uit: number | null;
  score_thuis_rust: number | null;
  score_uit_rust: number | null;
  loc_naam: string;
  loc_plaats: string;
  thuis_club_id: number;
  uit_club_id: number;
  thuis_ploeg_id: number;
  uit_ploeg_id: number;
  cmp_id: number;
  logo_thuis: string;
  logo_uit: string;
  nr: string;
}

export interface NbbStand {
  positie: string;
  rang: string;
  team: string;
  afko: string;
  gespeeld: number;
  punten: number;
  eigenscore: number;
  tegenscore: number;
  saldo: number;
  percentage: string;
  logo: string;
  clb_id: number;
  ID: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchJson(url: string): Promise<any> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function getTeams(): Promise<NbbTeam[]> {
  const data = await fetchJson(`${BASE}/team.pl?clb_ID=${CLB_ID}&seizoen=2025-2026`);
  return data.teams ?? [];
}

// Groepeert teams op uniek id, combineert comp_ids
export async function getTeamGroups(): Promise<TeamGroup[]> {
  const teams = await getTeams();
  const map = new Map<number, TeamGroup>();
  for (const t of teams) {
    if (!map.has(t.id)) {
      map.set(t.id, { id: t.id, naam: t.naam, sportlink: t.sportlink, comp_ids: [] });
    }
    map.get(t.id)!.comp_ids.push({ comp_id: t.comp_id, helft: t.helft });
  }
  return Array.from(map.values());
}

export async function getWedstrijden(plg_ID: number): Promise<NbbWedstrijd[]> {
  const data = await fetchJson(`${BASE}/wedstrijd.pl?plg_ID=${plg_ID}&szn_Naam=huidig`);
  return data.wedstrijden ?? [];
}

export async function getStand(cmp_ID: number): Promise<NbbStand[]> {
  const data = await fetchJson(`${BASE}/stand.pl?cmp_ID=${cmp_ID}&szn_Naam=huidig`);
  return data.stand ?? [];
}

// Categoriseert teams op naam
export function categorizeTeam(naam: string): string {
  const n = naam.toLowerCase();
  if (n.includes("gemengd")) return "Jeugd";
  if (n.includes("heren")) return "Heren";
  if (n.includes("dames") || n.includes("vrouwen") || n.includes("vse") || n.includes("vsd")) return "Dames";
  if (n.includes("u10") || n.includes("u12") || n.includes("u14") || n.includes("u16") || n.includes("u18") || n.includes("u20") || n.includes("u22")) return "Jeugd";
  return "Overig";
}

export function formatDatum(datum: string): string {
  const d = new Date(datum);
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

export function formatTijd(datum: string): string {
  const d = new Date(datum);
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

export function isBinnenland(club_id: number): boolean {
  return club_id === CLB_ID;
}
