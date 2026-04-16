'use client';
import { useState } from 'react';
import type { MatchResult } from '@/lib/wedstrijden';
import { isBinnenland, shortName } from '@/lib/wedstrijden';

export default function Results3({ results }: { results: MatchResult[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? results : results.slice(0, 5);

  return (
    <div>
      <div className="space-y-1">
        {visible.map(w => (
          <div
            key={w.id}
            className="group flex flex-col sm:flex-row sm:items-center gap-3 border-l-2 border-transparent hover:border-[#D31F30] bg-[#0a1f55]/50 hover:bg-[#0a1f55] px-5 py-4 transition-all"
          >
            <div className="text-[#8fa3c7] text-xs w-28 shrink-0">{w.datum}</div>
            <div className="flex-1 flex items-center gap-4">
              <span className={`flex-1 text-sm text-right font-semibold ${isBinnenland(w.thuis) ? "text-white" : "text-[#8fa3c7]"}`}>
                {shortName(w.thuis)}
              </span>
              <span className="bg-[#D31F30] text-white font-black text-lg px-3 py-1 min-w-[64px] text-center">
                {w.score}
              </span>
              <span className={`flex-1 text-sm font-semibold ${isBinnenland(w.uit) ? "text-white" : "text-[#8fa3c7]"}`}>
                {shortName(w.uit)}
              </span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${w.win ? "text-green-400" : "text-[#D31F30]"}`}>
              {w.win ? "● W" : "● L"}
            </span>
          </div>
        ))}
      </div>
      {results.length > 5 && (
        <button
          onClick={() => setShowAll(s => !s)}
          className="mt-3 w-full py-3 border border-white/15 hover:border-[#D31F30]/60 text-[#8fa3c7] hover:text-[#D31F30] text-xs font-black uppercase tracking-[0.2em] transition-colors"
        >
          {showAll ? "↑ MINDER TONEN" : `MEER — ${results.length - 5} WEDSTRIJDEN`}
        </button>
      )}
    </div>
  );
}
