import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState('');
  const [subject, setSubject] = useState('Order issue');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill out all required fields.');
      return;
    }
    toast.success('Signal sent! We will bark back soon.', {
      style: {
        borderRadius: '8px',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '3px solid var(--text-primary)',
      },
    });
    setName('');
    setEmail('');
    setOrder('');
    setMessage('');
  };

  return (
    <div className="bg-[#F5EDE0] min-h-screen py-12 px-6">
      <style>{`
        .brutalist-border {
            border: 3px solid #8B9A46;
        }
        .brutalist-shadow {
            box-shadow: 6px 6px 0px 0px #8B9A46;
        }
        .brutalist-shadow-hover {
            transition: all 0.2s ease;
        }
        .brutalist-shadow-hover:hover {
            box-shadow: 8px 8px 0px 0px #FF6B35;
            transform: translate(-2px, -2px);
        }
        .blob-mask {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-container {
            border-radius: 2% 5% 3% 4% / 3% 4% 5% 2%;
        }
        .rounded-blob {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        .rounded-blob-alt {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
      `}</style>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:items-start w-full">
        {/* Contact Form (Left) */}
        <div className="w-full md:w-1/2 bg-[#F9F4E8] blob-container brutalist-border brutalist-shadow p-8 relative">
          <h1 className="font-sans text-4xl md:text-5xl font-black text-[#ab3500] mb-6 transform -rotate-2">
            Send the Signal
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label 
                className="font-mono text-xs font-bold text-[#1e1b14] uppercase inline-block bg-[#daeb8d]/40 px-3 py-1 rounded-full border-2 border-[#1e1b14] w-max rotate-1" 
                htmlFor="name"
              >
                Your Name
              </label>
              <input 
                className="border-3 border-[#8B9A46] bg-[#F5EDE0] p-3 font-sans text-base text-[#1e1b14] focus:outline-none focus:border-[#ab3500] transition-colors rounded-sm" 
                id="name" 
                placeholder="Weirdo #1" 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label 
                className="font-mono text-xs font-bold text-[#1e1b14] uppercase inline-block bg-[#daeb8d]/40 px-3 py-1 rounded-full border-2 border-[#1e1b14] w-max -rotate-1" 
                htmlFor="email"
              >
                Email
              </label>
              <input 
                className="border-3 border-[#8B9A46] bg-[#F5EDE0] p-3 font-sans text-base text-[#1e1b14] focus:outline-none focus:border-[#ab3500] transition-colors rounded-sm" 
                id="email" 
                placeholder="woof@example.com" 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label 
                className="font-mono text-xs font-bold text-[#1e1b14] uppercase inline-block bg-[#daeb8d]/40 px-3 py-1 rounded-full border-2 border-[#1e1b14] w-max rotate-1" 
                htmlFor="order"
              >
                Order # (Optional)
              </label>
              <input 
                className="border-3 border-[#8B9A46] bg-[#F5EDE0] p-3 font-sans text-base text-[#1e1b14] focus:outline-none focus:border-[#ab3500] transition-colors rounded-sm" 
                id="order" 
                placeholder="PW-12345" 
                type="text"
                value={order}
                onChange={e => setOrder(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label 
                className="font-mono text-xs font-bold text-[#1e1b14] uppercase inline-block bg-[#daeb8d]/40 px-3 py-1 rounded-full border-2 border-[#1e1b14] w-max -rotate-2" 
                htmlFor="subject"
              >
                Subject
              </label>
              <select 
                className="border-3 border-[#8B9A46] bg-[#F5EDE0] p-3 font-sans text-base text-[#1e1b14] focus:outline-none focus:border-[#ab3500] transition-colors rounded-sm cursor-pointer" 
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              >
                <option>Order issue</option>
                <option>Product question</option>
                <option>Partnership</option>
                <option>Other Weirdness</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label 
                className="font-mono text-xs font-bold text-[#1e1b14] uppercase inline-block bg-[#daeb8d]/40 px-3 py-1 rounded-full border-2 border-[#1e1b14] w-max rotate-1" 
                htmlFor="message"
              >
                Message
              </label>
              <textarea 
                className="border-3 border-[#8B9A46] bg-[#F5EDE0] p-3 font-sans text-base text-[#1e1b14] focus:outline-none focus:border-[#ab3500] transition-colors resize-none rounded-sm" 
                id="message" 
                placeholder="Tell us what's up..." 
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="mt-4 bg-[#ab3500] text-white font-sans text-xl font-black py-4 px-8 border-3 border-[#1e1b14] brutalist-shadow brutalist-shadow-hover transition-all duration-200 transform hover:-rotate-1 w-full md:w-auto self-start blob-mask cursor-pointer"
            >
              Send the Signal
            </button>
          </form>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#576415] rounded-full border-3 border-[#1e1b14] -z-10"></div>
        </div>

        {/* Illustration & Info (Right) */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 items-center md:items-start pt-12 md:pt-0">
          <div className="relative w-full max-w-md mx-auto md:mx-0">
            {/* Speech Bubble */}
            <div className="absolute -top-12 left-4 md:left-24 bg-[#F5EDE0] px-6 py-4 border-3 border-[#1e1b14] rounded-blob shadow-[4px_4px_0px_0px_#8B9A46] transform rotate-3 z-10">
              <p className="font-sans text-xl font-extrabold text-[#ab3500]">Bark at us!</p>
              <div className="absolute bottom-[-10px] left-10 w-4 h-4 bg-[#F5EDE0] border-3 border-[#1e1b14] border-t-0 border-r-0 transform rotate-45"></div>
            </div>
            {/* Mascot Image */}
            <div className="w-full aspect-square border-3 border-[#1e1b14] rounded-blob overflow-hidden brutalist-shadow transform -rotate-1 bg-[#F9F4E8]">
              <img 
                className="w-full h-full object-cover mix-blend-multiply" 
                alt="Quirky dog mascot" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATAbpR3nfUqhgOeI0c0lvNYggeF8XxcLfFG36Eyed_I-vLnK9QqEqKtdUBBH7pUpwIOH3FHwaBtyiEtf1LIfWICzPckXkX0rg9yDDIRb_ez3uFfvTuZC8ZXymR5bbsZ259Drt8EWhMe8NWEB9NIc52_WI3-0tufsjgtxMQO_J2GYR6Gbi0cCZ--2ZIdx_OMCzYgR05izw6nLyFY1Lat37OtIERONScJ0YWXVWF5KqQ4o9mXTthG9eRVYgZL2tO3La8rT6HxxFMZUQ" 
              />
            </div>
          </div>

          <div className="bg-[#576415]/20 w-full p-6 border-3 border-[#1e1b14] brutalist-shadow transform rotate-1 rounded-blob-alt mt-8">
            <h2 className="font-sans text-xl font-extrabold mb-4 text-[#1e1b14]">Contact Info</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ab3500] text-[28px]">mail</span>
                <p className="font-sans text-base font-bold text-[#1e1b14]">support@felixdoggy.com</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ab3500] text-[28px]">timer</span>
                <p className="font-sans text-sm text-[#594139] font-semibold">We usually reply within 1 business day, weirdly fast.</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button type="button" className="w-12 h-12 bg-[#F5EDE0] border-2 border-[#1e1b14] rounded-blob flex items-center justify-center hover:bg-[#ab3500] hover:text-white hover:scale-110 transition-transform cursor-pointer">
                <span className="material-symbols-outlined">alternate_email</span>
              </button>
              <button type="button" className="w-12 h-12 bg-[#F5EDE0] border-2 border-[#1e1b14] rounded-blob-alt flex items-center justify-center hover:bg-[#ab3500] hover:text-white hover:scale-110 transition-transform cursor-pointer">
                <span className="material-symbols-outlined">tag</span>
              </button>
              <button type="button" className="w-12 h-12 bg-[#F5EDE0] border-2 border-[#1e1b14] rounded-blob flex items-center justify-center hover:bg-[#ab3500] hover:text-white hover:scale-110 transition-transform cursor-pointer">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
