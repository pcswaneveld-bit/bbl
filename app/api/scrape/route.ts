export async function GET() {
  const url =
    "https://www.basketballstats.nl/db/wedstrijd/uitslag.pl?cmp_ID=429&szn_Naam=huidig&tonen=1";

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8",
        Referer: "https://www.basketballstats.nl/",
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: `HTTP ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const html = await res.text();

    // Parse wedstrijden uit de HTML
    const wedstrijden = parseWedstrijden(html);

    return Response.json({ wedstrijden, raw: html.slice(0, 2000) });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

function parseWedstrijden(html: string) {
  // Zoek naar tabel-rijen met wedstrijddata
  const rows: Record<string, string>[] = [];

  // Eenvoudige regex voor tabelcellen
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let tdMatch;
    const tdContent = trMatch[1];
    const localTd = new RegExp(tdRegex.source, "gi");
    while ((tdMatch = localTd.exec(tdContent)) !== null) {
      // Strip HTML tags
      const text = tdMatch[1].replace(/<[^>]+>/g, "").trim();
      cells.push(text);
    }
    if (cells.length >= 3) {
      rows.push({ cells: cells.join(" | ") } as Record<string, string>);
    }
  }

  return rows;
}
