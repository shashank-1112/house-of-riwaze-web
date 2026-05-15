import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { name: 'Priya Sharma', location: 'Mumbai', text: 'The bridal set I purchased was absolutely stunning. The craftsmanship and attention to detail is unmatched. Truly a heirloom piece.', rating: 5 },
  { name: 'Anjali Mehta', location: 'Delhi', text: 'I have been a loyal customer for 3 years now. The quality of gold and the hallmark certification gives me complete peace of mind.', rating: 4 },
  { name: 'Rekha Patel', location: 'Ahmedabad', text: 'Beautiful diamond earrings with proper IGI certification. The making charges are very reasonable compared to other jewellers.', rating: 5 },
  { name: 'Sneha Reddy', location: 'Hyderabad', text: 'Ordered a 22K gold chain for my mother. The purity and finish exceeded our expectations. Will definitely shop again!', rating: 3 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading text-2xl sm:text-4xl font-semibold mb-12">
          What Our Customers Say
        </h2>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="font-heading text-xl sm:text-2xl italic leading-relaxed text-foreground/80 mb-6">
                "{testimonials[current].text}"
              </p>
              <div>
                <p className="font-medium text-sm">{testimonials[current].name}</p>
                <p className="text-xs text-muted-foreground">{testimonials[current].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-border'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent(p => (p + 1) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}