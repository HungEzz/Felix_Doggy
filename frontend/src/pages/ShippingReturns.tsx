import React from 'react';

const ShippingReturns: React.FC = () => {
  return (
    <div className="flex-grow text-primary bg-primary">
      <section className="pt-20 pb-16 px-6 text-center border-b border-token">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-4 block">Store Policies</span>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-[0.1em] font-display text-primary">Shipping & Returns</h1>
      </section>

      <div className="max-w-[900px] mx-auto py-16 px-6 space-y-12">
        <div className="bg-card border border-token rounded-3xl p-10 shadow-sm text-primary">
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 text-primary">Shipping</h2>
          <p className="text-sm text-secondary leading-relaxed mb-4">
            We ship nationwide using reliable shipping partners. Delivery time is typically 2 - 5 business days depending on the area.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-sm text-secondary">
            <li>Free shipping for orders from 1,000,000 VND.</li>
            <li>Shipping fee for orders under 1,000,000 VND is automatically calculated at checkout.</li>
            <li>Order tracking details will be sent via email or SMS.</li>
          </ul>
        </div>

        <div className="bg-card border border-token rounded-3xl p-10 shadow-sm text-primary">
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 text-primary">Returns</h2>
          <p className="text-sm text-secondary leading-relaxed mb-4">
            If the product is defective or not as described, you can request a return or exchange within 7 days of receiving the item.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-sm text-secondary">
            <li>Keep the product in its original condition and packaging.</li>
            <li>Contact customer support before returning the item.</li>
            <li>Return shipping costs are covered by the store if the return is due to a manufacturer defect.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
