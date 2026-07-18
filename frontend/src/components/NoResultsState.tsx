import React from 'react';

interface NoResultsStateProps {
  searchQuery: string;
  onClearFilters: () => void;
  onSelectSuggestion: (suggestion: string) => void;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchQuery,
  onClearFilters,
  onSelectSuggestion,
}) => {
  const suggestions = [
    'Sentient Kibble',
    'Cursed Cat Nip',
    'Existential Dread Bed',
    'Mystery Slime Toys',
  ];

  return (
    <div className="flex flex-col items-center text-center py-12 px-4 max-w-3xl mx-auto">
      <style>{`
        .blob-shape-mascot {
            border-radius: 41% 59% 36% 64% / 54% 47% 53% 46%;
        }
        .blob-shape-btn {
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .hard-shadow-btn {
            box-shadow: 6px 6px 0px 0px #576415;
            transition: all 0.2s ease;
        }
        .hard-shadow-btn:hover {
            box-shadow: 8px 8px 0px 0px #576415;
            transform: translate(-2px, -2px) rotate(-1deg);
        }
      `}</style>

      {/* Confused Mascot Illustration */}
      <div className="relative w-60 h-60 md:w-72 md:h-72 mb-8 blob-shape-mascot bg-white border-4 border-[#1e1b14] flex items-center justify-center shadow-[8px_8px_0px_0px_#ff6b35] hover:rotate-2 transition-transform duration-300 overflow-hidden shrink-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Confused dog mascot"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW1PbuxKfmh2oTgElX0ZGHwmphYDAyg4VR1rjG6p0YT2kVZhI-jMuywLI0u54XZPZBskJrH9MfreObuu5hGRsBLSCJ6hvnR-sDDVfBSSoG4O3Hp2MQGQxXEzyo1S7jkwhokZ5BqwnClYNuO4cPavRHhSyXaU2wGqgCrlDGun9Ka0dZVLQNaytmql_WqBZs0cKXV01LgA64N9yNbSr78g1MtrKR9HrfYGOc2RNYKXyQU8ySgX_DFc-dHOoVS1xaHDpW2Lp2a58jNiI"
        />
      </div>

      {/* Headline & Copy */}
      <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#1e1b14] mb-4 uppercase tracking-tight">
        No weird matches found.
        <br />
        <span className="text-[#ff6b35] italic">Even we're stumped.</span>
      </h2>
      
      <p className="font-sans text-sm md:text-base text-[#594139] mb-8 max-w-lg font-semibold leading-relaxed">
        We've searched under every sentient bed and inside every cursed cardboard box, but couldn't find anything for <span className="bg-[#ffdbd0] px-2 py-0.5 border border-[#1e1b14] rounded-md font-mono font-bold text-[#ab3500]">"{searchQuery || 'your filters'}"</span>.
      </p>

      {/* CTA */}
      <button 
        onClick={onClearFilters}
        className="inline-block bg-[#ff6b35] text-white font-sans text-lg font-black px-8 py-4 blob-shape-btn border-3 border-[#1e1b14] hard-shadow-btn cursor-pointer mb-12"
      >
        Clear all filters
      </button>

      {/* Suggested Weirdness */}
      <div className="w-full">
        <h3 className="font-mono text-xs text-[#576415] font-black uppercase tracking-widest mb-4">Suggested Weirdness</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSelectSuggestion(suggestion)}
              className="px-4 py-2.5 bg-white border-2 border-[#1e1b14] rounded-full font-mono text-xs font-bold text-[#1e1b14] hover:bg-[#daeb8d] hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_#1e1b14] cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoResultsState;
