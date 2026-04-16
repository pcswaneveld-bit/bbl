'use client';
import { useState } from 'react';

interface MatchResult {
  id: string;
  datum: string;
  thuis: string;
  uit: string;
  score: string;
  win: boolean;
}

function shortName(naam: string) {
  return naam.replace(" Vrouwen Senioren 1", "").replace(" Dames 1", "");
}

function isBinnenland(naam: string) {
  return naam.toLowerCase().includes("binnenland");
}

export default function ResultsSection({ results }: { results: MatchResult[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? results : results.slice(0, 5);

  return (
    <div>
      <div className="space-y-2">
        {visible.map(w => (
          <div
            key={w.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#0C0D1E] border border-white/5 rounded-xl px-5 py-3.5 hover:border-violet-500/30 transition-colors"
          >
            <div className="text-gray-500 text-xs w-28 shrink-0">{w.datum}</div>
            <div className="flex-1 flex items-center gap-3">
              <span className={`flex-1 text-sm font-semibold text-right ${isBinnenland(w.thuis) ? "text-violet-400" : "text-white"}`}>
                {shortName(w.thuis)}
              </span>
              <span className="bg-[#070914] border border-white/10 text-white font-black text-sm px-3 py-1.5 rounded-lg min-w-[64px] text-center shrink-0">
                {w.score}
              </span>
              <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-violet-400" : "text-white"}`}>
                {shortName(w.uit)}
              </span>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${w.win ? "bg-green-900/50 text-green-400" : "bg-red-900/30 text-red-400"}`}>
              {w.win ? "GEWONNEN" : "VERLOREN"}
            </span>
          </div>
        ))}
      </div>
      {results.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-3 border border-white/10 hover:border-violet-500/50 text-gray-400 hover:text-violet-400 text-sm font-semibold rounded-xl transition-colors"
        >
          {showAll ? "↑ Minder tonen" : `Meer... (nog ${results.length - 5} wedstrijden)`}
        </button>
      )}
    </div>
  );
}
