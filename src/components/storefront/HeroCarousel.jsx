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

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
  }),
};

const contentVariants = {
  enter: {
    opacity: 0,
    y: 24,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -16,
  },
};

export default function HeroCarousel() {
  const [[current, direction], setCurrent] = useState([0, 1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(([prev]) => [(prev + 1) % slides.length, 1]);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    if (index === current) return;

    const nextDirection = index > current ? 1 : -1;
    setCurrent([index, nextDirection]);
  };

  const prev = () => {
    setCurrent(([prevIndex]) => [
      (prevIndex - 1 + slides.length) % slides.length,
      -1,
    ]);
  };

  const next = () => {
    setCurrent(([prevIndex]) => [(prevIndex + 1) % slides.length, 1]);
  };

  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-muted sm:h-[75vh] lg:h-[85vh]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.90,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          {heroImages?.[current] ? (
            <img
              src={heroImages[current]}
              alt={slides[current].title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-accent/20" />
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.45,
                delay: 0.15,
              }}
              className="max-w-lg"
            >
              <h1 className="mb-4 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                {slides[current].title}
              </h1>

              <p className="mb-8 font-body text-base text-white/70 sm:text-lg">
                {slides[current].subtitle}
              </p>

              <Link to={slides[current].link}>
                <Button className="rounded-none bg-primary px-8 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                  {slides[current].cta}
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}