import React from 'react';
import { Shield, Award, RotateCcw, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Shield, title: 'BIS Hallmarked', desc: 'Every piece of gold jewellery is Bureau of Indian Standards certified for purity.' },
  { icon: Award, title: 'Certified Diamonds', desc: 'All diamond jewellery comes with IGI/GIA certification.' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '15-day hassle-free return & exchange on all products.' },
  { icon: Banknote, title: 'EMI Available', desc: 'Flexible EMI options available on all major credit cards.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-4xl font-semibold mb-3">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Trust, quality, and craftsmanship in every piece
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 sm:p-8 rounded-sm bg-background shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}