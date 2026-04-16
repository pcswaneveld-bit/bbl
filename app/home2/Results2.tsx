'use client';
import { useState } from 'react';
import type { MatchResult } from '@/lib/wedstrijden';
import { isBinnenland, shortName } from '@/lib/wedstrijden';

export default function Results2({ results }: { results: MatchResult[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? results : results.slice(0, 5);

  return (
    <div>
      <div className="divide-y divide-white/10">
        {visible.map(w => (
          <div key={w.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5 hover:bg-white/5 transition-colors px-3 -mx-3 rounded">
            <span className="text-white/40 text-xs w-28 shrink-0">{w.datum}</span>
            <div className="flex-1 flex items-center gap-4">
              <span className={`flex-1 text-sm text-right font-semibold ${isBinnenland(w.thuis) ? "text-white font-bold" : "text-white/70"}`}>
                {shortName(w.thuis)}
              </span>
              <span className="bg-white text-[#0D2566] font-black text-sm px-3 py-1.5 rounded min-w-[64px] text-center">
                {w.score}
              </span>
              <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-white font-bold" : "text-white/70"}`}>
                {shortName(w.uit)}
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded shrink-0 ${w.win ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-[#D31F30]/20 text-red-300 border border-[#D31F30]/30"}`}>
              {w.win ? "Gewonnen" : "Verloren"}
            </span>
          </div>
        ))}
      </div>
      {results.length > 5 && (
        <button
          onClick={() => setShowAll(s => !s)}
          className="mt-4 w-full py-2.5 border border-white/20 hover:border-white text-white/50 hover:text-white text-sm font-bold rounded transition-colors"
        >
          {showAll ? "Minder tonen ↑" : `Meer... (${results.length - 5} wedstrijden)`}
        </button>
      )}
    </div>
  );
}
