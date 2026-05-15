import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Gem,
  Sparkles,
  Hammer,
  Heart,
  ShieldCheck,
  Crown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const journey = [
  {
    year: "01",
    title: "The First Sketch",
    text: "Every piece begins with a mood, a memory, and a hand-drawn idea shaped around timeless Indian elegance.",
    icon: Sparkles,
  },
  {
    year: "02",
    title: "Choosing the Metal",
    text: "We select gold, silver, platinum, and stones with care, balancing purity, weight, durability, and beauty.",
    icon: Gem,
  },
  {
    year: "03",
    title: "Crafted by Hands",
    text: "Our artisans refine each curve, setting, texture, and detail until the jewellery feels personal and alive.",
    icon: Hammer,
  },
  {
    year: "04",
    title: "Made for Moments",
    text: "From everyday grace to bridal celebration, each creation is designed to become part of someone’s story.",
    icon: Heart,
  },
];

const values = [
  {
    title: "Honest Craft",
    description:
      "We believe jewellery should be beautiful outside and trustworthy inside — clear details, fair weight, and transparent pricing.",
    icon: ShieldCheck,
  },
  {
    title: "Timeless Design",
    description:
      "Our collections blend traditional Indian artistry with refined modern silhouettes that stay relevant for years.",
    icon: Crown,
  },
  {
    title: "Personal Meaning",
    description:
      "A piece of jewellery is rarely just an accessory. It carries emotion, identity, celebration, and memory.",
    icon: Heart,
  },
];

export default function About() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop"
            alt="Fine jewellery background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-5 bg-primary/90 text-primary hover:bg-primary/50 h-6">
              The House of Riwaze Story
            </Badge>

            <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">
              Jewellery crafted like memory, worn like art.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              House of Riwaze was created for those who see jewellery as more
              than ornament. Every piece is a quiet expression of tradition,
              emotion, and craftsmanship — made to become part of life’s most
              meaningful moments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button className="gap-2 rounded-full bg-primary px-6">
                  Explore Collections
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* <Link to="/rates">
                <Button variant="outline" className="rounded-full px-6">
                  View Metal Rates
                </Button>
              </Link> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop"
                alt="Gold jewellery craft"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-2 hidden rounded-3xl border border-border bg-card/95 p-5 shadow-lg backdrop-blur sm:block">
              <p className="font-heading text-3xl font-semibold">Everyday</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Luxury with soul
              </p>
            </div>

            <div className="absolute -right-2 top-10 hidden rounded-full border border-border bg-background/90 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground shadow-sm backdrop-blur sm:block">
              handcrafted detail
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Our Philosophy
          </p>

          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">
            We design pieces that feel inherited before they are owned.
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Our work sits between heritage and modernity. We respect the old
            language of Indian jewellery — temple motifs, bridal richness,
            everyday gold, delicate detailing — and reinterpret it for today’s
            wearer.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full rounded-3xl border-border/80 bg-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-heading text-2xl font-semibold">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <img
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=900&auto=format&fit=crop"
                alt="Bangles"
                className="aspect-[3/4] rounded-3xl object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop"
                alt="Ring"
                className="aspect-square rounded-3xl object-cover"
              />
            </div>

            <div className="mt-10 space-y-3">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop"
                alt="Necklace"
                className="aspect-square rounded-3xl object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
                alt="Jewellery detail"
                className="aspect-[3/4] rounded-3xl object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              The Atelier
            </p>

            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">
              A quiet place where metal becomes emotion.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              The beauty of a piece is not only in its shine. It is in the
              patience behind the polish, the balance of weight, the placement
              of a stone, the curve that rests perfectly against skin, and the
              detail that only reveals itself when seen closely.
            </p>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              That is why we treat every design like a small artwork — created
              with discipline, finished with care, and made to carry meaning.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Our Journey
          </p>

          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">
            From imagination to heirloom
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            The journey of every piece is slow, deliberate, and deeply human.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-border md:block" />

          <div className="space-y-5">
            {journey.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative grid gap-4 md:grid-cols-[72px_1fr]"
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
                    <CardContent className="grid gap-4 p-6 sm:grid-cols-[110px_1fr] sm:items-start">
                      <div>
                        <p className="font-heading text-4xl font-semibold text-primary/70">
                          {item.year}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-heading text-2xl font-semibold">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <Badge className="mb-5 bg-primary/90 text-primary hover:bg-primary/50">
                Our Promise
              </Badge>

              <h2 className="font-heading text-3xl font-semibold sm:text-5xl">
                Jewellery that respects your trust.
              </h2>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                We believe luxury should feel clear, not confusing. From purity
                and weight to making charges and final price, House of Riwaze is
                built around transparency, craftsmanship, and lasting value.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products">
                  <Button className="gap-2 rounded-full bg-primary px-6">
                    Shop the Collection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                {/* <Link to="/rates">
                  <Button variant="outline" className="rounded-full px-6">
                    Check Today&apos;s Rates
                  </Button>
                </Link> */}
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop"
              alt="Jewellery display"
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}