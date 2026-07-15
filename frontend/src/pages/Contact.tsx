import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="flex-grow text-primary bg-primary">
      <section className="pt-20 pb-16 px-6 text-center border-b border-token">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-4 block">Customer Support</span>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-[0.1em] font-display text-primary">Contact</h1>
      </section>

      <div className="max-w-[1200px] mx-auto py-16 px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-[280px] md:h-[420px] rounded-[32px] overflow-hidden border border-token shadow-sm">
            <iframe
              title="HCM City Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.688%2C10.788%2C106.714%2C10.816&layer=mapnik&marker=10.802%2C106.701"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="bg-card border border-token rounded-3xl p-10 shadow-sm text-primary">
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 text-primary">Need assistance?</h2>
            <p className="text-sm text-secondary leading-relaxed mb-8">
              If you have questions about your order, products, policies, or any other issues, please contact us. We will respond within 24 working hours.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Email</p>
                <p className="text-base font-semibold text-primary">support@recordstore.vn</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Phone</p>
                <p className="text-base font-semibold text-primary">+84 123 456 789</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Working Hours</p>
                <p className="text-base font-semibold text-primary">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Address</p>
                <p className="text-base font-semibold text-primary">123 Music Street, District 1, Ho Chi Minh City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
