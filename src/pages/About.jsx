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
    title: "Born from Rivaaz",
    text: "Every Rivaazé piece begins with the spirit of Indian rituals, memories, celebrations, and the quiet beauty passed down through generations.",
    icon: Sparkles,
  },
  {
    year: "02",
    title: "Redefined by Design",
    text: "Traditional forms are reimagined with a contemporary eye, creating jewellery that feels rooted yet modern, regal yet wearable.",
    icon: Crown,
  },
  {
    year: "03",
    title: "Crafted in Detail",
    text: "Kundan, polki, intricate settings, and refined metalwork come together through careful hands and thoughtful finishing.",
    icon: Hammer,
  },
  {
    year: "04",
    title: "Worn as Legacy",
    text: "Each creation is designed to become part of a woman’s journey — worn today, cherished tomorrow, and passed on with meaning.",
    icon: Heart,
  },
];

const values = [
  {
    title: "Tradition Reimagined",
    description:
      "At Rivaazé, tradition is not simply followed. It is studied, respected, and reinterpreted for women who honour their roots while shaping their own story.",
    icon: Crown,
  },
  {
    title: "Craft with Emotion",
    description:
      "Every detail carries intention — from regal motifs and stonework to the way a piece feels when worn during life’s most meaningful moments.",
    icon: Heart,
  },
  {
    title: "Trust in Every Detail",
    description:
      "Jewellery should feel beautiful and honest. We value clarity in materials, craftsmanship, finish, and the story behind every creation.",
    icon: ShieldCheck,
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
            <Badge className="mb-5 h-6 bg-primary/90 text-primary hover:bg-primary/50">
              The Rivaazé Story
            </Badge>

            <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">
              Tradition reimagined as wearable art.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Rivaazé is born from tradition, redefined by design. Inspired by
              age-old Indian <span className="italic">rivaaz</span> — rituals,
              memories, and celebrations — and shaped with a contemporary soul,
              the brand celebrates jewellery as a symbol of heritage, emotion,
              and individuality.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Each Rivaazé creation blends traditional craftsmanship with modern
              aesthetics, creating pieces that feel timeless yet relevant.
              Designed for women who honour their roots while embracing their
              own journey, Rivaazé jewellery tells stories meant to be worn,
              cherished, and passed on.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button className="gap-2 rounded-full bg-primary px-6">
                  Explore Collections
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
              <p className="font-heading text-3xl font-semibold">Rivaazé</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Heritage with a modern soul
              </p>
            </div>

            <div className="absolute -right-2 top-10 hidden rounded-full border border-border bg-background/90 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground shadow-sm backdrop-blur sm:block">
              tradition reimagined
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
            At Rivaazé, tradition isn’t followed — it is reimagined.
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Our work sits between heritage and modernity. We draw from the old
            language of Indian jewellery — kundan, polki, regal detailing,
            bridal richness, and ceremonial elegance — and reinterpret it for
            today’s woman.
          </p>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The result is jewellery that carries the emotion of tradition, but
            moves with the confidence of contemporary design.
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
                alt="Traditional bangles"
                className="aspect-[3/4] rounded-3xl object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop"
                alt="Gold ring"
                className="aspect-square rounded-3xl object-cover"
              />
            </div>

            <div className="mt-10 space-y-3">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop"
                alt="Gold necklace"
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
              The Craft
            </p>

            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">
              Where ritual, artistry, and identity meet.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              The beauty of a Rivaazé piece is not only in its shine. It is in
              the patience behind the polish, the balance of shape and weight,
              the placement of every stone, and the detail that reveals itself
              slowly.
            </p>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Kundan, polki, and regal detailing are not used only as decoration.
              They become a language — one that speaks of celebration,
              inheritance, femininity, and self-expression.
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
            From rivaaz to remembrance
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Every piece begins with tradition, passes through design, and
            becomes part of a personal story.
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
                Jewellery that honours roots and celebrates individuality.
              </h2>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Rivaazé is for women who carry tradition with pride, but never
                lose their own voice. Every creation is designed to feel
                meaningful, personal, and timeless — a piece of heritage shaped
                for the present.
              </p>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                At Rivaazé, jewellery is not only worn. It is remembered.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products">
                  <Button className="gap-2 rounded-full bg-primary px-6">
                    Shop the Collection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
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