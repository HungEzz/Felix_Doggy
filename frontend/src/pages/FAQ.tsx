import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="flex-grow text-primary bg-primary">
      <section className="pt-20 pb-16 px-6 text-center border-b border-token">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-4 block">Common Information</span>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-[0.1em] font-display text-primary">Frequently Asked Questions</h1>
      </section>

      <div className="max-w-[900px] mx-auto py-16 px-6 space-y-8">
        <div className="bg-card border border-token rounded-3xl p-10 shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-4 text-primary">1. How do I track my order?</h2>
          <p className="text-sm text-secondary leading-relaxed">
            After placing an order, you will receive a confirmation email and tracking details from our shipping partner. If you need further assistance, please contact customer support.
          </p>
        </div>

        <div className="bg-card border border-token rounded-3xl p-10 shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-4 text-primary">2. Can I cancel my order?</h2>
          <p className="text-sm text-secondary leading-relaxed">
            You can cancel your order before the product is packaged and shipped. Please contact us immediately to check your order status.
          </p>
        </div>

        <div className="bg-card border border-token rounded-3xl p-10 shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-4 text-primary">3. Do the products have a warranty?</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Basic toys and merchandise are not covered by a warranty. Bent Bones and Paw treats can be returned or exchanged if they are defective or not as described.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
