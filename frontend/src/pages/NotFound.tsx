import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="bg-[#F5EDE0] min-h-screen flex flex-col font-sans text-[#1e1b14]">
      <style>{`
        .blob-frame {
            border-radius: 43% 57% 70% 30% / 30% 64% 36% 70%;
            animation: blob-morph 8s ease-in-out infinite alternate;
        }
        
        .blob-button {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transition: all 0.3s ease;
        }
        
        .blob-button:hover {
            border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
        }

        @keyframes blob-morph {
            0% { border-radius: 43% 57% 70% 30% / 30% 64% 36% 70%; }
            50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }

        .wobbly-text {
            display: inline-block;
            transform: rotate(-2deg);
        }

        .paw-print {
            opacity: 0.2;
            transform: rotate(15deg);
        }
        
        .hard-shadow {
            box-shadow: 4px 4px 0px 0px #576415;
        }
        
        .hard-shadow-hover:hover {
            box-shadow: 6px 6px 0px 0px #576415;
            transform: translate(-2px, -2px) rotate(1deg);
        }
      `}</style>
      
      {/* TopNavBar */}
      <header className="bg-[#F5EDE0] border-b border-[#576415] px-6 md:px-12 py-4 flex items-center justify-between z-50">
        <Link to="/" className="font-sans text-[#ab3500] text-2xl font-black wobbly-text no-underline flex items-center gap-2">
          <img src="/image.png" alt="Felix Doggy Logo" className="h-9 w-auto rounded" />
          Felix Doggy
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link className="text-[#1e1b14] hover:text-[#ab3500] font-bold no-underline" to="/bones">Shop Weird</Link>
          <Link className="text-[#1e1b14] hover:text-[#ab3500] font-bold no-underline" to="/paws">Adopt a Pal</Link>
          <Link className="text-[#1e1b14] hover:text-[#ab3500] font-bold no-underline" to="/toys">Treats</Link>
          <Link className="text-[#1e1b14] hover:text-[#ab3500] font-bold no-underline" to="/contact">About Us</Link>
        </nav>
        <div className="flex items-center gap-4 text-[#1e1b14]">
          <Link to="/cart" className="hover:text-[#ab3500] flex"><span className="material-symbols-outlined">shopping_cart</span></Link>
          <Link to="/account" className="hover:text-[#ab3500] flex"><span className="material-symbols-outlined">person</span></Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Decorative Background Paws */}
        <div className="absolute bottom-10 right-10 paw-print text-[#594139]/20 pointer-events-none"><span className="material-symbols-outlined text-4xl">pets</span></div>
        <div className="absolute bottom-24 right-20 paw-print text-[#594139]/20 pointer-events-none"><span className="material-symbols-outlined text-3xl">pets</span></div>
        <div className="absolute bottom-32 right-8 paw-print text-[#594139]/20 pointer-events-none"><span className="material-symbols-outlined text-4xl">pets</span></div>

        {/* Centerpiece Content */}
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-8 z-10 my-12">
          {/* Mascot Image in Organic Blob */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <div className="absolute inset-0 bg-[#576415] blob-frame opacity-20 transform translate-x-4 translate-y-4"></div>
            <div className="absolute inset-0 border-4 border-[#1e1b14] blob-frame overflow-hidden bg-white flex items-center justify-center p-4">
              <img alt="Confused mascot holding a map upside down" className="w-full h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByK2rGfMi11nLNFKfRkycvQPvMAcWLIyyuZcyRGqaTj9MKmubnGDdN04TArOYn7M8Cu53GY178VJvx27ff84dLoNIDUTr8f7HjRx84DRDxh8Gyaj2O2pjsVyqU-QIvdUOTvMPR7c2ugD6d1iopmI8qjWUAeRTIcr1xEdfAJOXeDEenIbDPWFI-9QyZYDPIpfZnyKf8YSOoHZtqju3Y2q6zKWVA3ef285vWEdEQGlV9q_FWB1EVANjLh9fk8f03D8PndtmuiRg5s8M" />
            </div>
          </div>

          {/* Headings */}
          <div className="flex flex-col gap-4 max-w-xl mx-auto mt-4">
            <h1 className="font-sans text-4xl md:text-5xl font-black text-[#1e1b14] wobbly-text leading-tight">
              404: Even We're Confused
            </h1>
            <p className="font-sans text-lg text-[#594139] px-4 font-semibold">
              This page wandered off somewhere weird and never came back. Let's find you something less lost.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 mt-6 justify-center items-center w-full">
            {/* Primary Action */}
            <Link className="blob-button bg-[#ab3500] hover:bg-[#ff6b35] text-white border-2 border-[#1e1b14] px-8 py-4 font-sans text-lg font-black hard-shadow hard-shadow-hover flex items-center gap-2 no-underline cursor-pointer" to="/">
              Back to the Den
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            </Link>
            {/* Secondary Action */}
            <Link className="blob-button bg-[#F5EDE0] hover:bg-[#efe7da] border-2 border-[#1e1b14] text-[#1e1b14] px-8 py-4 font-sans text-lg font-black hard-shadow hard-shadow-hover flex items-center gap-2 no-underline cursor-pointer" to="/bones">
              Browse the Weird Shop
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
          </div>

          <div className="mt-12 font-mono text-xs text-[#594139] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">bug_report</span>
            Error code: WEIRD-404
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#efe7da] border-t border-[#1e1b14] px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <Link to="/" className="font-sans text-[#ab3500] text-2xl font-black wobbly-text md:justify-self-start no-underline flex items-center gap-2 justify-center md:justify-start">
            <img src="/image.png" alt="Felix Doggy Logo" className="h-9 w-auto rounded" />
            Felix Doggy
          </Link>
          <div className="flex flex-wrap justify-center gap-6 font-sans text-sm font-semibold text-[#1e1b14]">
            <Link className="hover:text-[#ab3500] no-underline" to="/shipping-returns">Privacy</Link>
            <Link className="hover:text-[#ab3500] no-underline" to="/shipping-returns">Terms</Link>
            <Link className="hover:text-[#ab3500] no-underline" to="/faq">Mascot Club</Link>
            <Link className="hover:text-[#ab3500] no-underline" to="/contact">Contact</Link>
          </div>
          <div className="font-sans text-xs text-[#594139] md:text-right md:justify-self-end font-semibold">
            &copy; 2024 Felix Doggy - Stay Strange!
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
