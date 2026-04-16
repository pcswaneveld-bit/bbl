export interface Wedstrijd {
  id: string;
  datum: string;
  tijd: string;
  thuis: string;
  uit: string;
  locatie: string;
  score: string;
}

export interface MatchResult extends Wedstrijd {
  win: boolean;
}

export const PLAYERS = [
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

export async function getWedstrijden(): Promise<Wedstrijd[]> {
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

export async function getStand(cmp_ID: number): Promise<NbbStand[]> {
  try {
    const res = await fetch(
      `https://db.basketball.nl/db/json/stand.pl?cmp_ID=${cmp_ID}&szn_Naam=huidig`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.stand ?? [];
  } catch {
    return [];
  }
}

export function isBinnenland(naam: string): boolean {
  return naam.toLowerCase().includes("binnenland");
}

export function shortName(naam: string): string {
  return naam.replace(" Vrouwen Senioren 1", "").replace(" Dames 1", "");
}

export function computeStats(wedstrijden: Wedstrijd[]) {
  const binnenland = wedstrijden.filter(w => isBinnenland(w.thuis) || isBinnenland(w.uit));
  const gespeeld = binnenland.filter(w => !!w.score);
  const laatste = [...gespeeld].reverse()[0] ?? null;

  const [thuisScore, uitScore] = laatste
    ? laatste.score.split("-").map(s => parseInt(s.trim(), 10))
    : [0, 0];

  const gewonnen = laatste
    ? (isBinnenland(laatste.thuis) && thuisScore > uitScore) ||
      (isBinnenland(laatste.uit) && uitScore > thuisScore)
    : null;

  const gespeeldCount = gespeeld.length;
  const gewonnenCount = gespeeld.filter(w => {
    const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
    return (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t);
  }).length;

  const recenteUitslagen: MatchResult[] = [...gespeeld].reverse().slice(0, 10).map(w => {
    const [t, u] = w.score.split("-").map(s => parseInt(s.trim(), 10));
    return { ...w, win: (isBinnenland(w.thuis) && t > u) || (isBinnenland(w.uit) && u > t) };
  });

  return {
    binnenland,
    laatste,
    gewonnen,
    gespeeld: gespeeldCount,
    gewonnenCount,
    verloren: gespeeldCount - gewonnenCount,
    recenteUitslagen,
  };
}
