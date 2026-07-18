import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="bg-[#F5EDE0] text-[#1e1b14] min-h-screen flex flex-col font-sans overflow-x-hidden">
      <style>{`
        .blob-frame {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            animation: morph 8s ease-in-out infinite;
            border: 3px solid #1e1b14;
        }
        .blob-frame-static-1 { border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%; }
        .blob-frame-static-2 { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        .blob-frame-static-3 { border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%; }
        
        @keyframes morph {
            0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
            34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
            67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
        }
        
        .jiggle-hover:hover {
            animation: jiggle 0.3s ease-in-out;
            transform: scale(1.02) rotate(1deg);
        }
        
        @keyframes jiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(2deg); }
            50% { transform: rotate(-2deg); }
            75% { transform: rotate(1deg); }
            100% { transform: rotate(0deg); }
        }

        .hard-shadow {
            box-shadow: 6px 6px 0px 0px rgba(30,27,20,1);
        }
        
        .hard-shadow-hover {
            transition: all 0.2s ease;
        }
        .hard-shadow-hover:hover {
            box-shadow: 8px 8px 0px 0px rgba(30,27,20,1);
            transform: translate(-2px, -2px);
        }
        
        .bg-wavy-line {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20, 50 10 T 100 10' fill='none' stroke='%231e1b14' stroke-width='2'/%3E%3C/svg%3E");
            background-repeat: repeat-x;
            background-position: center;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 min-h-[600px]">
          <div className="w-full md:w-1/2 z-10 md:pr-10">
            <h1 className="font-sans text-4xl md:text-5xl font-black text-[#1e1b14] mb-6 leading-tight uppercase tracking-tight">
              We Love Dogs. <br />
              <span className="text-[#FF6B35] relative inline-block">
                So Do You.
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-[#8B9A46]/40 -z-10 rounded-full rotate-2"></span>
              </span>
            </h1>
            <p className="font-sans text-lg text-[#594139] max-w-md font-semibold leading-relaxed">
              Welcome to Felix Doggy! We are dedicated to providing everything your dog needs, from adoption services to premium food, toys, and outfits.
            </p>
            <Link 
              to="/bones" 
              className="mt-8 bg-[#FF6B35] text-white font-mono text-xs font-bold py-4 px-8 border-2 border-[#1e1b14] rounded-full hard-shadow hard-shadow-hover jiggle-hover uppercase tracking-widest inline-flex items-center gap-2 no-underline cursor-pointer"
            >
              Shop Now
              <span className="material-symbols-outlined text-white text-sm font-bold">arrow_forward</span>
            </Link>
          </div>
          
          <div className="w-full md:w-1/2 relative mt-12 md:mt-0 flex justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 relative">
              <div className="absolute inset-0 bg-[#8B9A46] blob-frame translate-x-4 translate-y-4"></div>
              <div className="w-full h-full blob-frame overflow-hidden relative z-10 bg-[#f5ede0]">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Funny cat" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChg7O-zdy_lLvt103ITYnmFsqZNXSC0YLxtLr8EfVOea4MO0FpYKaJzDprYk3iU7qLZfsUZDCaJ4zbz16ruGvDGkaxRdArZEk2GusMVLC3qUUXA_7jLcQmvURsaGUMRLV9FPlWaigdu1PYFaVSUZ5RMfmSjIQ77Im6nuJ1nVaxC60KdLSB9PMcaQUKlmhvNDPm__-K0pWnxL-ltkAc8b2_MCgdi4Z21DrLQmumPV-sS8k96rmes2ogYJw-HJbKWKAN_ZKiH6KikCU" 
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -top-6 -right-6 bg-[#fff8f0] border-2 border-[#1e1b14] px-4 py-1 rounded-full font-mono text-xs font-bold rotate-12 shadow-[4px_4px_0px_0px_rgba(30,27,20,1)] text-[#FF6B35]">
                100% Certified Weird
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-[#efe7da]/30 px-6 md:px-12 py-24 border-y-4 border-[#1e1b14]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-5/12 flex justify-center order-2 md:order-1">
              <div className="w-64 h-72 relative">
                <div className="absolute inset-0 bg-[#FF6B35] blob-frame-static-2 translate-x-3 translate-y-6"></div>
                <div className="w-full h-full blob-frame-static-1 overflow-hidden relative z-10 border-3 border-[#1e1b14] bg-white">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Founder hug dog" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD14kyqMo8B2kwwX6qHTQnKsFl154OS00dtLKLrDer2BHcZ-uy8n-7szvU5F3iDtqT_wXhhhRmB1ABj0SIZtp2GsmyLXZaZ13pmxkT62jR3ZtK5CKXZsaybvz-ifrEdV7Uf7qeUo8u6gfw75W8AuA1BFyDUDRdjPfs-wJzh8yj7a6Xur1q1Ziwk4sf_DvIjDWBxOXvIon7qrW3TOvXPseKIYleBXO6Q-4Qn_V82RD75ZU6MTo_bbRNuTi1LJ-24BXbRxb0FX37FsFo" 
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-7/12 order-1 md:order-2">
              <h2 className="font-sans text-3xl font-black text-[#1e1b14] uppercase mb-6 inline-block relative tracking-tight">
                Our Wobbly Story
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#8B9A46]/40 -z-10 -rotate-1"></span>
              </h2>
              <div className="space-y-6 font-sans text-base text-[#594139] font-semibold leading-relaxed">
                <p>It started with a pug named Barnaby who snorted more than he breathed, and a cat named Sir Reginald who exclusively walked sideways.</p>
                <p>We looked at the pet industry and saw a sea of sleek, perfect, pedigreed animals. But our living rooms? They were filled with beautiful disasters.</p>
                <p>We created Felix Doggy for the snaggleteeth, the clumsy ones, the oddly-shaped rescues, and the pets that make you ask, "Is it supposed to do that?"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Bento Grid */}
        <section className="px-6 md:px-12 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-sans text-3xl font-black text-[#1e1b14] uppercase tracking-tight">What We Stand For</h2>
              <div className="w-24 h-6 bg-wavy-line mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-[#fff8f0] border-3 border-[#1e1b14] rounded-3xl p-8 hard-shadow hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B35] rounded-bl-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-16 h-16 bg-[#8B9A46] rounded-full border-2 border-[#1e1b14] flex items-center justify-center mb-6 hard-shadow -rotate-6">
                  <span className="material-symbols-outlined text-[#1e1b14] text-3xl">pets</span>
                </div>
                <h3 className="font-sans text-xl font-black text-[#1e1b14] uppercase mb-4">No Pedigree Perfection</h3>
                <p className="font-sans text-sm text-[#594139] leading-relaxed font-semibold">Papers? We don't need no stinking papers. We celebrate the mutts, the mixes, and the glorious unknowns.</p>
              </div>

              {/* Value 2 */}
              <div className="bg-[#f5ede0] border-3 border-[#1e1b14] rounded-3xl p-8 hard-shadow hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden mt-0 md:mt-12">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF6B35] rounded-tr-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-16 h-16 bg-[#FF6B35] rounded-full border-2 border-[#1e1b14] flex items-center justify-center mb-6 hard-shadow rotate-3">
                  <span className="material-symbols-outlined text-[#1e1b14] text-3xl">mood_bad</span>
                </div>
                <h3 className="font-sans text-xl font-black text-[#1e1b14] uppercase mb-4">Real Weirdos Welcome</h3>
                <p className="font-sans text-sm text-[#594139] leading-relaxed font-semibold">Anxiety? Strange eating habits? Fear of balloons? Bring it on. We make things for pets with personality.</p>
              </div>

              {/* Value 3 */}
              <div className="bg-[#fff8f0] border-3 border-[#1e1b14] rounded-[40px_10px_40px_10px] p-8 hard-shadow hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden">
                <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-[#8B9A46] rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 -translate-y-1/2 translate-x-1/2"></div>
                <div className="w-16 h-16 bg-[#daeb8d] rounded-full border-2 border-[#1e1b14] flex items-center justify-center mb-6 hard-shadow -rotate-12">
                  <span className="material-symbols-outlined text-[#1e1b14] text-3xl">weekend</span>
                </div>
                <h3 className="font-sans text-xl font-black text-[#1e1b14] uppercase mb-4">Comfort Over Conformity</h3>
                <p className="font-sans text-sm text-[#594139] leading-relaxed font-semibold">Our gear isn't designed to look good on a runway; it's designed to feel good during a 3 AM zoomie session.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Gallery */}
        <section className="bg-[#EDE7D8] px-6 md:px-12 py-24 border-t-4 border-[#1e1b14]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-sans text-3xl font-black text-[#1e1b14] uppercase tracking-tight mb-2">Join the Felix Doggy Club</h2>
                <p className="font-sans text-sm text-[#594139] font-bold">Tag your glorious disasters with #FelixDoggy</p>
              </div>
              <div className="bg-white px-4 py-2 border-2 border-[#1e1b14] rounded-full font-mono text-xs font-black inline-block rotate-2 shadow-[2px_2px_0px_0px_rgba(30,27,20,1)]">
                @felixdoggy
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="aspect-square relative group">
                <div className="absolute inset-0 bg-[#FF6B35] blob-frame-static-1 translate-x-2 translate-y-2 opacity-50"></div>
                <div className="w-full h-full blob-frame-static-2 overflow-hidden border-2 border-[#1e1b14] relative z-10 transition-all duration-300 group-hover:scale-105">
                  <img className="w-full h-full object-cover" alt="Bewildered greyhound" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGm2Y28qwvSwEjt2P-kVmP0u-MUPgfXoto21kfOp8eU6ePgSQcdxNKZMy1iZiAJ-dx1auSVn6AciZE3n8B3O6y9oi8P7m7Aosu9o8Q1F1bgJxqSCJw3TsJNh4HII4nnc5VZkILDJBXaoVjgMNkv88xhhamOuz0NK3p2KnrH4Ogudd-GcoHg7EbzIanBnyRyohWJICsofxN6h5G77pWIf2JwTHKyi0oc2z0VT7u5R0RgSYpQ8SczqcTfj4R5c2aiUNF8T5xmnk3T1A" />
                </div>
              </div>
              
              <div className="aspect-[4/5] relative group mt-8">
                <div className="absolute inset-0 bg-[#8B9A46] blob-frame-static-3 -translate-x-2 translate-y-3 opacity-50"></div>
                <div className="w-full h-full blob-frame-static-1 overflow-hidden border-2 border-[#1e1b14] relative z-10 transition-all duration-300 group-hover:scale-105">
                  <img className="w-full h-full object-cover" alt="Grumpy hamster" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lcaAsrD7HVkmbKHFMsxVW4R4ez5ln4Hd3VuGtHKMRp6LoOwP9EMBXgtlnZqIMACl-THlNhioEcK2ZzP1QjFMl6pT2X5KCuReoMxhfVGwY4f2-iAcwfjzaVjES-02mFWfP0KEBvOx7TeOvMRDqqadlXlJ33vGnNM77kM15R4Oj-yzJ9tl1ZjBMQX-FrJKhitbCO-tAhD10cJRjtZbAbX3XGCxDZBUsj-ECAu9IGE-IdXq1dipGuqnbMmqXMK_Z0mbG4CQlRa-imA" />
                </div>
              </div>
              
              <div className="aspect-square relative group">
                <div className="absolute inset-0 bg-[#e1bfb5] blob-frame-static-2 translate-x-3 -translate-y-2 opacity-50"></div>
                <div className="w-full h-full blob-frame-static-3 overflow-hidden border-2 border-[#1e1b14] relative z-10 transition-all duration-300 group-hover:scale-105">
                  <img className="w-full h-full object-cover" alt="Wet shaking dog" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBor5cCiFXRfOEpOcMRg9LxLWSzVIghj22jjbFSqG8hn7Bhir32T9E-CCbNhg29eF1Tmsvd8J0mHxX2u4TX4QAuSzS-dlhScs6YDZnKiHxxuWPMGLJOwbL3FrxO35GQpSKNaHcMF_fc3ZeKSTUkfLextc72bXMDW79YZK_kEzOkDC5gnXUoSV2eWArkNYvbYKQckHwstWxki-w4vFXDe0wBYYJPzUAqXiJmXIn1qXpzOnnYePNcck-5v-xdV04G78XDMVaPGRjzbE8" />
                </div>
              </div>
              
              <div className="aspect-[3/4] relative group mt-12">
                <div className="absolute inset-0 bg-[#FF6B35] blob-frame-static-1 translate-x-2 translate-y-4 opacity-50"></div>
                <div className="w-full h-full blob-frame-static-2 overflow-hidden border-2 border-[#1e1b14] relative z-10 transition-all duration-300 group-hover:scale-105">
                  <img className="w-full h-full object-cover" alt="Sphynx cat in sweater" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlosF1pUuexmLCFEZqhkKSueQf6c_UX68ZjdHYVq3I9JMHR4qtJwotIl16n8hlVpTtBeIl5eqoUcib15JYoU4p6iZwiRMDAsDL_FfrielMr1C-7foAMLH_DCdA6NmXdvgrWP1lLoTrgCG2jLrVvh3tsC_mVGt-VEDyiLngNwmM-_K2ZZWBBXZeYdOOWSJnbrRAqvHK74-LAANp0MP0ToOM1d95ooDjGlm3ANRi-coZSGJlLQHZrK2k_sgzcN2EpeePAzNzf1BKAdo" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
