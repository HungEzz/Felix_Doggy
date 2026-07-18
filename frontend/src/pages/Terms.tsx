import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="bg-[#f5ede0] text-[#1e1b14] min-h-screen py-12 px-6 font-sans relative overflow-hidden">
      <style>{`
        /* Organic Brutalism Utilities */
        .blob-frame {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-frame-2 {
            border-radius: 60% 40% 30% 70% / 50% 40% 50% 60%;
        }
        .blob-card {
            border-radius: 20px 80px 30px 60px / 60px 30px 80px 20px;
        }
        .hard-shadow {
            box-shadow: 6px 6px 0px 0px rgba(89, 65, 57, 1);
        }
        .hard-shadow-olive {
            box-shadow: 6px 6px 0px 0px rgba(87, 100, 21, 1);
        }
        .hard-shadow-hover {
            transition: all 0.2s ease;
        }
        .hard-shadow-hover:hover {
            box-shadow: 8px 8px 0px 0px rgba(89, 65, 57, 1);
            transform: translate(-2px, -2px);
        }
        .jiggle:hover {
            animation: jiggle 0.3s ease-in-out infinite alternate;
        }
        @keyframes jiggle {
            0% { transform: rotate(-2deg) scale(1.02); }
            100% { transform: rotate(2deg) scale(1.05); }
        }
        .wobbly-border {
            border: 3px solid #1e1b14;
            border-radius: 2% 98% 3% 97% / 97% 2% 98% 3%;
        }
        .drawn-divider {
            height: 10px;
            background: repeating-linear-gradient(-45deg, transparent, transparent 4px, #594139 4px, #594139 6px);
        }
      `}</style>

      {/* Background decorative blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#daeb8d]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#ffb59d]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        {/* Header Section */}
        <section className="text-center flex flex-col items-center justify-center pt-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[#ff6b35] blob-frame transform translate-x-2 translate-y-3"></div>
            <div className="absolute inset-0 border-4 border-[#1e1b14] blob-frame-2 bg-white"></div>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-[#1e1b14] relative z-10 px-12 py-8 rotate-[-2deg] uppercase">
              Terms of Weirdness
            </h1>
          </div>
          <p className="font-sans text-base md:text-lg text-[#594139] max-w-2xl mt-8 bg-white/70 p-6 wobbly-border hard-shadow transform rotate-1 font-semibold leading-relaxed">
            Welcome to the strange and wonderful world of Felix Doggy. By interacting with our sentient toys, consuming our odd kibble, or just being here, you agree to the following mild absurdities.
          </p>
          <div className="mt-8 px-4 py-2 bg-[#576415] rounded-full inline-flex items-center gap-2 border-2 border-[#1e1b14] hard-shadow-olive transform -rotate-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Last updated: The 13th Hour</span>
            <span className="material-symbols-outlined text-white text-sm">schedule</span>
          </div>
        </section>

        <div className="drawn-divider w-full my-12"></div>

        {/* Content Masonry/Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Section 1 */}
          <article className="md:col-span-7 bg-white p-8 blob-card border-4 border-[#1e1b14] hard-shadow relative">
            <div className="absolute -top-6 -left-6 bg-[#ff6b35] w-16 h-16 rounded-full border-3 border-[#1e1b14] flex items-center justify-center shadow-[4px_4px_0px_0px_#1e1b14] transform -rotate-12">
              <span className="material-symbols-outlined text-white text-3xl">handshake</span>
            </div>
            <h2 className="font-sans text-xl font-black text-[#ab3500] mb-4 mt-4 ml-6 uppercase">1. Acceptance of Strange Terms</h2>
            <p className="font-sans text-sm text-[#594139] leading-relaxed mb-4 font-semibold">
              By using our services, you acknowledge that things might get a bit weird. You agree not to panic if your new plushie stares back at you or if the squeaker sounds vaguely like an ancient chant.
            </p>
            <p className="font-sans text-sm text-[#594139] leading-relaxed font-semibold">
              Continued use constitutes acceptance of all peculiar occurrences as "features" rather than "bugs."
            </p>
          </article>

          {/* Section 2 */}
          <article className="md:col-span-5 bg-[#daeb8d] p-8 wobbly-border hard-shadow-olive transform rotate-2 relative mt-12 md:mt-0">
            <div className="absolute -right-4 top-10 bg-white w-12 h-12 rounded-full border-2 border-[#1e1b14] flex items-center justify-center shadow-[3px_3px_0px_0px_#1e1b14] transform rotate-12">
              <span className="material-symbols-outlined text-[#ab3500] text-2xl">volume_up</span>
            </div>
            <h2 className="font-sans text-xl font-black text-[#181e00] mb-4 uppercase">2. The Squeak Warranty</h2>
            <p className="font-sans text-sm text-[#594139] leading-relaxed mb-4 font-semibold">
              We guarantee a minimum of 10,000 squeaks per toy. If the squeaker stops functioning, it has likely achieved enlightenment and chosen silence. We do not refund enlightened items.
            </p>
            <ul className="space-y-2 mt-4 font-mono text-xs font-bold text-[#5d6a1b] list-disc pl-5">
              <li>Valid only on non-cursed items.</li>
              <li>Void if chewed by an actual cryptid.</li>
            </ul>
          </article>

          {/* Section 3 */}
          <article className="md:col-span-6 bg-white/50 p-8 border-r-8 border-b-8 border-t-2 border-l-2 border-[#8d7168] rounded-tr-3xl rounded-bl-3xl relative">
            <div className="absolute -bottom-5 right-10 bg-[#ffdbd0] w-14 h-14 rounded-full border-2 border-[#1e1b14] flex items-center justify-center shadow-[3px_3px_0px_0px_#1e1b14] transform rotate-45">
              <span className="material-symbols-outlined text-[#ab3500] text-2xl">pest_control</span>
            </div>
            <h2 className="font-sans text-xl font-black text-[#1e1b14] mb-4 uppercase">3. Liability for Sentient Goods</h2>
            <p className="font-sans text-sm text-[#594139] leading-relaxed mb-4 font-semibold">
              Felix Doggy is not responsible for any existential crises experienced by your pets upon interacting with our products. 
            </p>
            <p className="font-sans text-sm text-[#594139] leading-relaxed font-semibold">
              If a product begins organizing other toys into a rudimentary society, please separate them and enforce nap time.
            </p>
          </article>

          {/* Section 4 */}
          <article className="md:col-span-6 bg-[#343027] p-8 blob-card border-4 border-[#ff6b35] hard-shadow-hover transition-all relative transform -rotate-1 mt-8 md:mt-16">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#ffdbd0] px-4 py-1 rounded-full border-2 border-[#1e1b14] shadow-[3px_3px_0px_0px_#1e1b14] text-[#390c00] font-mono text-xs font-black uppercase">
              Important
            </div>
            <h2 className="font-sans text-xl font-black text-[#ffb59d] mb-4 mt-2 uppercase">4. Governing Chaos</h2>
            <p className="font-sans text-sm text-[#efe7da] leading-relaxed mb-4 font-semibold">
              These terms are governed by the laws of whimsy and the local ordinances of whichever dimension you currently inhabit. 
            </p>
            <div className="p-4 border-2 border-dashed border-[#ffb59d] rounded-lg mt-4 bg-[#1e1b14]">
              <p className="font-mono text-xs font-bold text-[#efe7da] text-center">
                Any disputes will be settled by a staring contest with our mascot.
              </p>
            </div>
          </article>
        </div>

        <div className="drawn-divider w-full my-12"></div>

        {/* Contact CTA */}
        <div className="text-center pb-12 flex flex-col items-center">
          <p className="font-sans text-sm text-[#594139] leading-relaxed mb-6 max-w-md mx-auto font-bold">
            Still confused? Have a complaint from your dog about section 2? We're here to vaguely help.
          </p>
          <Link 
            to="/contact" 
            className="bg-[#ab3500] text-white font-sans text-lg font-black px-8 py-4 border-4 border-[#1e1b14] hard-shadow jiggle transition-all rounded-full flex items-center gap-3 no-underline cursor-pointer"
          >
            <span>Contact Support</span>
            <span className="material-symbols-outlined">send</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
