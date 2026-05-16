import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Bridal Collection",
    subtitle: "Handcrafted masterpieces for your most precious day",
    cta: "Explore Bridal",
    link: "/products?occasion=Bridal",
    gradient: "from-amber-900/60 via-amber-900/30 to-transparent",
  },
  {
    title: "Everyday Gold",
    subtitle: "Effortless elegance for every moment",
    cta: "Shop Gold",
    link: "/products?metal=Gold",
    gradient: "from-stone-900/60 via-stone-900/30 to-transparent",
  },
  {
    title: "Diamonds Forever",
    subtitle: "Brilliance that transcends time",
    cta: "Discover Diamonds",
    link: "/products?metal=Diamond",
    gradient: "from-slate-900/60 via-slate-900/30 to-transparent",
  },
];

const heroImages = [
  "https://media.base44.com/images/public/6a00a40a19276e8c3d395c44/707f8ae54_generated_b09b4bf6.png",
  "https://media.base44.com/images/public/6a00a40a19276e8c3d395c44/bed2624bf_generated_48aa2522.png",
  "https://media.base44.com/images/public/6a00a40a19276e8c3d395c44/18f504922_generated_36cce095.png",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => setCurrent(i);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {heroImages?.[current] ? (
            <img
              src={heroImages[current]}
              alt={slides[current].title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-muted to-accent/20" />
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg"
            >
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-semibold text-white leading-tight mb-4">
                {slides[current].title}
              </h1>
              <p className="text-white/70 text-base sm:text-lg mb-8 font-body">
                {slides[current].subtitle}
              </p>
              <Link to={slides[current].link}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest font-medium rounded-none">
                  {slides[current].cta}
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={next}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm items-center justify-center text-white hover:bg-white/20 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
