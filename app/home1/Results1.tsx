'use client';
import { useState } from 'react';
import type { MatchResult } from '@/lib/wedstrijden';
import { isBinnenland, shortName } from '@/lib/wedstrijden';

export default function Results1({ results }: { results: MatchResult[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? results : results.slice(0, 5);

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-2">
        {visible.map(w => (
          <div
            key={w.id}
            className={`border-l-4 ${w.win ? "border-green-500" : "border-gray-700"} bg-[#111111] p-4 hover:bg-[#181818] transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-xs font-mono">{w.datum}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${w.win ? "text-green-400" : "text-gray-600"}`}>
                {w.win ? "GEWONNEN" : "VERLOREN"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex-1 text-sm text-right font-semibold ${isBinnenland(w.thuis) ? "text-white" : "text-gray-500"}`}>
                {shortName(w.thuis)}
              </span>
              <span className="text-2xl font-black text-[#D31F30] min-w-[64px] text-center">{w.score}</span>
              <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-white" : "text-gray-500"}`}>
                {shortName(w.uit)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {results.length > 5 && (
        <button
          onClick={() => setShowAll(s => !s)}
          className="mt-3 w-full py-3 border border-white/10 hover:border-[#D31F30]/50 text-gray-600 hover:text-[#D31F30] text-xs font-black uppercase tracking-[0.2em] transition-colors"
        >
          {showAll ? "↑ MINDER" : `MEER — ${results.length - 5} WEDSTRIJDEN`}
        </button>
      )}
    </div>
  );
}
