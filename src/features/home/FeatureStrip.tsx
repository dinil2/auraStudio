import React from 'react';
import { Sparkles, Truck, MessageCircle, HeartHandshake } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'PREMIUM COMBED COTTON',
    desc: 'Heavyweight, breathable luxury knit tailored for Sri Lankan climate.',
  },
  {
    icon: HeartHandshake,
    title: 'FLATTERING DRAPE & CUT',
    desc: 'Tested cuts for women and men. Pre-washed for zero shrinkage.',
  },
  {
    icon: MessageCircle,
    title: 'EASY WHATSAPP CHECKOUT',
    desc: 'No credit card needed. Chat directly with our team to place your order.',
  },
  {
    icon: Truck,
    title: 'ISLANDWIDE CASH ON DELIVERY',
    desc: 'Fast doorstep courier across Colombo and all 25 districts.',
  },
];

export const FeatureStrip: React.FC = () => {
  return (
    <section className="bg-white border-y border-brand-border/70 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-brand-bg/60 border border-brand-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-brand-text">
                    {feat.title}
                  </h4>
                  <p className="text-[12px] text-brand-muted mt-0.5 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
