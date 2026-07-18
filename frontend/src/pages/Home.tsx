import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24 relative">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-accent-secondary rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-gutter">
          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-6 -rotate-2 relative z-10 pl-4 md:pl-12">
            <div className="absolute -top-6 -left-6 bg-accent-secondary/20 w-16 h-16 rounded-full mix-blend-multiply opacity-80 blob-mask-1"></div>
            <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter text-text-primary" style={{ fontWeight: 900 }}>
              Your One-Stop<br /><span className="text-accent">Dog Shop.</span>
            </h1>
            <p className="font-sans text-base text-text-secondary max-w-md bg-secondary p-4 border-2 border-text-primary blob-mask-2">
              Find your next furry best friend, premium dog food, playful toys, and stylish dog outfits. Everything your dog needs, all in one place!
            </p>
            <Link to="/paws">
              <button className="organic-brutalism-btn bg-accent text-text-primary font-display text-lg font-black px-8 py-4 blob-mask-1 mt-4 cursor-pointer">
                Adopt & Shop Now
              </button>
            </Link>
          </div>

          {/* Right Column: Dog Image & Sticker */}
          <div className="w-full md:w-1/2 relative flex justify-center mt-12 md:mt-0">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-accent-secondary/40 blob-mask-1 absolute -z-10 rotate-12 opacity-80 border-4 border-text-primary shadow-[8px_8px_0px_0px_#8B9A46]"></div>
            <div className="w-64 h-64 md:w-80 md:h-80 bg-accent overflow-hidden blob-mask-2 border-4 border-text-primary relative group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt="A portrait of a highly expressive, goofy-looking dog"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Tk318lcuiTYh6EY8Pf1kfqm0yy-m2-IQ4y6_agiyuMDK17jTzzXzFqxauAQSWze_Z-HOZgBKQA8m9a4qhnosVScinGAuJ4jluL2hpPxclmsSWKFNu0N5gn--RwHLXmU-L58hl3OrtI7xvRwlgDenEan4erntDeZ1qKDAKCRF1uySxPcvYxHFFE9HXO3JunSEF8McF1Fb_UjxVOJz2uQgmlB7lw8bKjvNcxVVZmfOoTaKJOwrQshZ5Yi06A-ugDKa0Awc3iLRORY" />
            </div>
            {/* Sticker Tag */}
            <div className="absolute -bottom-4 right-8 bg-secondary font-mono text-xs px-4 py-2 border-2 border-text-primary blob-mask-1 rotate-12 font-bold shadow">
              Ngáo Level: Max
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES (ROTATED STRIP) ─────────────────────── */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 bg-secondary rounded-[40px] border-y-4 border-text-primary transform -rotate-1 mx-2 md:mx-12 my-12 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className="font-display text-3xl md:text-4xl text-center font-black uppercase mb-12 transform rotate-1 text-text-primary">Pick Your Peculiarity</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-gutter transform rotate-1 justify-items-center">
          
          {/* Category 1 */}
          <Link className="flex flex-col items-center gap-4 group text-decoration-none" to="/paws">
            <div className="w-32 h-32 bg-card border-3 border-text-primary blob-mask-1 flex items-center justify-center organic-brutalism-card shadow-[6px_6px_0px_0px_#FF6B35]">
              <span className="material-symbols-outlined text-[64px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            </div>
            <span className="font-display text-sm font-black text-center bg-accent-soft text-text-primary px-3 py-1 border-2 border-text-primary -rotate-2 uppercase">Adopt a Dog</span>
          </Link>

          {/* Category 2 */}
          <Link className="flex flex-col items-center gap-4 group mt-8 md:mt-0 text-decoration-none" to="/bones">
            <div className="w-32 h-32 bg-card border-3 border-text-primary blob-mask-2 flex items-center justify-center organic-brutalism-card shadow-[6px_6px_0px_0px_#8B9A46]">
              <span className="material-symbols-outlined text-[64px] text-accent-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            </div>
            <span className="font-display text-sm font-black text-center bg-accent-soft text-text-primary px-3 py-1 border-2 border-text-primary rotate-3 uppercase">Dog Food</span>
          </Link>

          {/* Category 3 */}
          <Link className="flex flex-col items-center gap-4 group text-decoration-none" to="/toys">
            <div className="w-32 h-32 bg-card border-3 border-text-primary blob-mask-1 flex items-center justify-center organic-brutalism-card shadow-[6px_6px_0px_0px_#FF6B35]">
              <span className="material-symbols-outlined text-[64px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>sports_baseball</span>
            </div>
            <span className="font-display text-sm font-black text-center bg-accent-soft text-text-primary px-3 py-1 border-2 border-text-primary -rotate-1 uppercase">Dog Toys</span>
          </Link>

          {/* Category 4 */}
          <Link className="flex flex-col items-center gap-4 group mt-8 md:mt-0 text-decoration-none" to="/clothes">
            <div className="w-32 h-32 bg-card border-3 border-text-primary blob-mask-2 flex items-center justify-center organic-brutalism-card shadow-[6px_6px_0px_0px_#8B9A46]">
              <span className="material-symbols-outlined text-[64px] text-accent-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>checkroom</span>
            </div>
            <span className="font-display text-sm font-black text-center bg-accent-soft text-text-primary px-3 py-1 border-2 border-text-primary rotate-2 uppercase">Dog Clothes</span>
          </Link>

        </div>
      </section>

      {/* ── STORYTELLING SECTION ─────────────────────────────────────── */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          {/* Left Text */}
          <div className="w-full md:w-1/2 flex flex-col items-end text-right gap-6 rotate-1 relative z-10 pr-4 md:pr-12">
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase leading-tight text-text-primary">
              We Care For <br />
              <span className="text-accent-secondary bg-accent-soft px-2 blob-mask-2 border-2 border-text-primary" style={{ display: 'inline-block' }}>
                Every Pup
              </span>
            </h2>
            <p className="font-sans text-base text-text-secondary max-w-md bg-secondary p-6 border-4 border-text-primary rounded-[10px_40px_20px_30px] shadow-[-6px_8px_0px_0px_#8B9A46]">
              Whether you are looking to adopt a new family member, feed them healthy food, or find the perfect toys and clothing, we make it easy to find high-quality products tailored for your loyal companion.
            </p>
            <Link to="/faq" className="font-display text-lg text-accent flex items-center gap-2 hover:gap-4 transition-all wavy-line-divider font-bold text-decoration-none">
              Have Questions? Check FAQ <span style={{ fontSize: 20 }}>➔</span>
            </Link>
          </div>

          {/* Right Masonry Gallery */}
          <div className="w-full md:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4 auto-rows-[150px]">
              <div className="col-span-1 row-span-2 bg-secondary border-4 border-text-primary blob-mask-1 overflow-hidden organic-brutalism-card">
                <img className="w-full h-full object-cover" alt="Goofy dog shaking" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfQu_F6xF79ldDndLmXLRsv4AKM4FfmUCusu9x_-bCQzt6yLNXt3U7VtFGH7gLFUpGo7LS9yBd98PEyI_CEM7e-Ame1FCGE5tfP1V4o5Vx907XhbXljPq7O7PjUO2iKPz-DFkfKMdis1p5hf9knbA03zluDi8rixPRMluqZJGSZAnfpuUWBv0Nz-LqG75cY7xWy5yzaveOVEihDizgncvIkHq2oEm_JoYZ8Uq3A0PU6c0TRl7BtSKiVh48foiFvy6RhdgbDgqNGZs" />
              </div>
              <div className="col-span-1 row-span-1 bg-secondary border-4 border-text-primary blob-mask-2 overflow-hidden organic-brutalism-card mt-8">
                <img className="w-full h-full object-cover" alt="Grumpy face cat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjDmUpEdqnazLbimV12rxB43CEhnNo41LRE0MKMVMh01zc0Jh6OppJlNqJWifnJdMX9coif7uuOm7ZxVWtWraXY4-frT_7J6IN3Q0YZppHmU3R2hqyKzTk31MRoZKPAm_UpTYkIscwiewbADbBDZllPgJ1sYxXhJno-QuGqPp1mFjbG0Tjq8isk1jUr9Rss7_0zwsC7e2l4OhBwtF9WVhP5HqIJeMivpuwiWxBGYmHY9iBjLMUSuTGwvFkvlca_cdpmJv1vLivvTE" />
              </div>
              <div className="col-span-1 row-span-2 bg-secondary border-4 border-text-primary blob-mask-1 overflow-hidden organic-brutalism-card -mt-8">
                <img className="w-full h-full object-cover" alt="Playful dog on back" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ehdUKb2EuVAqeu9RkihtyrYI3QsJqKjxiU6yQai2qHlK34m94w8eQpn1zUbFGQJmdGVbezmf2Ki1CWcDUoh3jd16XN7UnuZ146Z6sNiCtN_rxx_H1MgOZ1fYLCGF_RenpKk-fBsst6vzi5Rzkdwf5t89KlXaB3yOfRsb3qETo8cM47nhN3iSM3YeIERDTg17AMHFMtO2EnGO53gjeV1PfmDXj2tdGXjwnNL9aJEdjLbXy2rcx5BwfxfUi1lAF69Ljlvf3LuQ-Fk" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;