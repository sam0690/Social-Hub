import { Sparkles } from "lucide-react";
import { interests } from "./explore-data";

export function ExploreHeader() {
  return (
    <div className="overflow-x-hidden bg-white/60 dark:bg-black/55 backdrop-blur-lg py-4 rounded-full px-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {interests.map((item, index) => (
          <button
            key={item}
            type="button"
            className={
              index === 0
                ? "shrink-0 rounded-full border border-slate-500 dark:border-cyan-300/30 bg-blue-200 dark:bg-cyan-400/15 px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-cyan-100"
                : "shrink-0 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-300 transition hover:border-slate-400 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white"
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}