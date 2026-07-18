import React from 'react';
import toast from 'react-hot-toast';

const Privacy: React.FC = () => {
  const handleAcceptCrumbs = () => {
    toast.success('Omnomnom! All cookie crumbs accepted.', {
      style: {
        borderRadius: '8px',
        background: '#daeb8d',
        color: '#1e1b14',
        border: '3px solid #1e1b14',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <div className="bg-[#f5ede0] text-[#1e1b14] min-h-screen py-12 px-6 font-sans relative overflow-hidden">
      <style>{`
        .organic-border {
            border: 4px solid #1e1b14;
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .organic-border-alt {
            border: 4px solid #1e1b14;
            border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
        }
        .blob-shadow {
            box-shadow: 6px 6px 0px 0px rgba(171, 53, 0, 1);
        }
        .blob-shadow-olive {
            box-shadow: 6px 6px 0px 0px rgba(87, 100, 21, 1);
        }
        .blob-shadow-dark {
            box-shadow: 6px 6px 0px 0px rgba(30, 27, 20, 1);
        }
        .wiggle-hover {
            transition: all 0.2s ease;
        }
        .wiggle-hover:hover {
            animation: wiggle 0.5s ease-in-out infinite;
        }
        @keyframes wiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
        }
      `}</style>

      {/* Main Content Canvas */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16 flex flex-col items-center justify-center relative z-10">
          <div className="bg-[#daeb8d] organic-border blob-shadow p-8 md:p-12 -rotate-1 w-full max-w-4xl text-center relative overflow-hidden">
            <h1 className="font-sans text-4xl md:text-5xl font-black text-[#1e1b14] relative z-10 uppercase tracking-tight leading-none">
              Your Secrets are Safe <br />
              <span className="text-[#ff6b35] italic font-display text-2xl md:text-3xl font-extrabold">(Mostly)</span>
            </h1>
            <p className="mt-4 font-sans text-base md:text-lg text-[#594139] relative z-10 font-bold">
              The fine print, translated from dog barks and cat yowls.
            </p>
            {/* Quirky Mascot */}
            <div className="absolute -bottom-6 -right-4 w-40 h-40 rotate-12 z-0 opacity-80 mix-blend-multiply hidden sm:block">
              <img 
                className="w-full h-full object-contain" 
                alt="Detective dog mascot" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBorWsJF5sD-csdlSfc0gFlhNJZ_mk0N5M4MF_eH9mpfO0vsh8fX0fbQoYZaxrn634gzeVHe0C4HmMwOso8Pr7VvYlSTvh_RjQ58quparOsRxIgr0w8P2edCEqSDlGdrLozPIvtZW7LegvP4UKx7zcrVY3vnhcN9BrtO_uFUd4Lq1bWoODiO54-JhAeR8CptcGAz7ZTEmMq0a_YjW9aqvX9685Xp8Z6mt-RU2D6GRngMVYw4RwgdrFLZMPeF-WX2GkGZs6C-2zqPas" 
              />
            </div>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-12 items-start relative">
          {/* Sticky TOC */}
          <aside className="hidden md:block w-1/4 sticky top-32">
            <div className="bg-white organic-border-alt blob-shadow-olive p-6">
              <h2 className="font-sans text-lg font-black text-[#1e1b14] mb-6 border-b-2 border-[#ff6b35] pb-2 uppercase">The Map</h2>
              <ul className="space-y-4 list-none p-0 m-0">
                <li>
                  <a className="group flex items-center gap-2 font-mono text-xs font-bold text-[#594139] hover:text-[#ff6b35] transition-colors no-underline" href="#data-collection">
                    <span className="w-3 h-3 rounded-full bg-[#576415] block group-hover:scale-150 group-hover:bg-[#ff6b35] transition-all"></span>
                    What We Sniff Out
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 font-mono text-xs font-bold text-[#594139] hover:text-[#ff6b35] transition-colors no-underline" href="#data-usage">
                    <span className="w-3 h-3 rounded-full bg-[#576415] block group-hover:scale-150 group-hover:bg-[#ff6b35] transition-all"></span>
                    How We Use Your Bark
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 font-mono text-xs font-bold text-[#594139] hover:text-[#ff6b35] transition-colors no-underline" href="#sharing">
                    <span className="w-3 h-3 rounded-full bg-[#576415] block group-hover:scale-150 group-hover:bg-[#ff6b35] transition-all"></span>
                    Sharing with the Pack
                  </a>
                </li>
                <li>
                  <a className="group flex items-center gap-2 font-mono text-xs font-bold text-[#594139] hover:text-[#ff6b35] transition-colors no-underline" href="#cookies">
                    <span className="w-3 h-3 rounded-full bg-[#576415] block group-hover:scale-150 group-hover:bg-[#ff6b35] transition-all"></span>
                    Cookie Crumbs
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Content Sections */}
          <div className="w-full md:w-3/4 space-y-16">
            {/* Section 1 */}
            <section className="bg-white organic-border blob-shadow p-8 md:p-12 relative rotate-1" id="data-collection">
              <div className="absolute -top-4 -left-4 bg-[#ff6b35] text-white font-mono text-xs font-bold px-4 py-1 organic-border rotate-[-5deg] uppercase">Section 1</div>
              <h2 className="font-sans text-xl md:text-2xl font-black text-[#ff6b35] mb-6 flex items-center gap-3 uppercase">
                <span className="material-symbols-outlined text-3xl">pets</span>
                What We Sniff Out (Data Collection)
              </h2>
              <div className="space-y-4 font-sans text-base text-[#1e1b14] font-semibold leading-relaxed">
                <p>We don't collect everything, just the good smells. When you roam around Felix Doggy, we might gather:</p>
                <ul className="list-none space-y-3 pl-4 m-0 p-0">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#576415] mt-1 text-lg">check_circle</span>
                    <span><strong>Your Identity Scent:</strong> Basic stuff like your name, email, and shipping address when you buy weird things.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#576415] mt-1 text-lg">check_circle</span>
                    <span><strong>Digital Footprints:</strong> How you navigate our site, what you click on, and how long you stare at the ugly-cute mascots.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#576415] mt-1 text-lg">check_circle</span>
                    <span><strong>Device Sniffs:</strong> IP address, browser type, and whether you're using a fancy phone or a dusty old laptop.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-[#efe7da]/50 organic-border-alt blob-shadow-dark p-8 md:p-12 relative -rotate-1 ml-0 md:ml-8" id="data-usage">
              <div className="absolute -top-4 -right-4 bg-[#576415] text-white font-mono text-xs font-bold px-4 py-1 organic-border rotate-[5deg] uppercase">Section 2</div>
              <h2 className="font-sans text-xl md:text-2xl font-black text-[#ff6b35] mb-6 flex items-center gap-3 uppercase">
                <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                How We Use Your Bark
              </h2>
              <div className="space-y-4 font-sans text-base text-[#1e1b14] font-semibold leading-relaxed">
                <p>We use your data to make things better, not creepier. Specifically:</p>
                <p className="pl-6 border-l-4 border-[#8d7168] italic text-[#594139] my-6 font-bold text-lg">
                  "To send you the weird stuff you actually paid for."
                </p>
                <p>Also, we use it to improve the website, send you newsletters (only if you begged for them), and to figure out why everyone keeps abandoning their carts when they see the shipping costs.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white organic-border blob-shadow-olive p-8 md:p-12 relative rotate-1" id="sharing">
              <div className="absolute -bottom-4 -left-4 bg-[#8d7168] text-white font-mono text-xs font-bold px-4 py-1 organic-border rotate-[-3deg] uppercase">Section 3</div>
              <h2 className="font-sans text-xl md:text-2xl font-black text-[#ff6b35] mb-6 flex items-center gap-3 uppercase">
                <span className="material-symbols-outlined text-3xl">hub</span>
                Sharing with the Pack
              </h2>
              <div className="space-y-4 font-sans text-base text-[#1e1b14] font-semibold leading-relaxed">
                <p>We are a loyal pack. We do <strong>NOT</strong> sell your data to random strangers in dark alleys. We only share it with trusted partners who help us run this circus:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#f5ede0] border-2 border-[#1e1b14] p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform rounded-md">
                    <span className="material-symbols-outlined text-[#ab3500] text-3xl">local_shipping</span>
                    <span className="font-mono text-xs font-bold">Delivery Hounds</span>
                  </div>
                  <div className="bg-[#f5ede0] border-2 border-[#1e1b14] p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform rounded-md">
                    <span className="material-symbols-outlined text-[#ab3500] text-3xl">payments</span>
                    <span className="font-mono text-xs font-bold">Payment Processing Pups</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-[#daeb8d] organic-border-alt blob-shadow p-8 md:p-12 relative -rotate-1 ml-0 md:-ml-8" id="cookies">
              <h2 className="font-sans text-xl md:text-2xl font-black text-[#1e1b14] mb-6 flex items-center gap-3 uppercase">
                <span className="material-symbols-outlined text-3xl text-[#ab3500]">cookie</span>
                Cookie Crumbs
              </h2>
              <div className="space-y-4 font-sans text-base text-[#594139] font-semibold leading-relaxed">
                <p>Yes, we use cookies. Not the delicious peanut butter ones, unfortunately. These digital crumbs help our site remember who you are and what you like.</p>
                <p>You can tell your browser to reject them, but then the site might act weird. Weirder than usual, we mean.</p>
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleAcceptCrumbs}
                    className="bg-[#ab3500] text-white font-mono text-xs font-bold px-8 py-4 organic-border blob-shadow-dark wiggle-hover transition-all cursor-pointer"
                  >
                    ACCEPT ALL CRUMBS
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
