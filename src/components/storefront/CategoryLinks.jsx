import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Gold Jewellery", param: "metal=Gold", icon: "✦" },
  { name: "Silver Jewellery", param: "metal=Silver", icon: "◆" },
  { name: "Diamond Jewellery", param: "metal=Diamond", icon: "◇" },
  { name: "Rings", param: "category=Rings", icon: "○" },
  { name: "Necklaces", param: "category=Necklaces", icon: "◎" },
  { name: "Earrings", param: "category=Earrings", icon: "❖" },
  { name: "Bracelets", param: "category=Bracelets", icon: "◈" },
  { name: "Bangles", param: "category=Bangles", icon: "◉" },
  { name: "Pendants", param: "category=Pendants", icon: "♦" },
];

export default function CategoryLinks() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-12 max-w-4xl text-center"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-primary/70">
            Rivaazé
          </p>

          <h2 className="mx-auto max-w-4xl font-heading text-[1.8rem] text-primary/70 font-normal italic leading-[1.35] tracking-tight text-foreground sm:text-4xl">
            Jewellery made to be worn with pride and passed on with love.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            A celebration of tradition, emotion, and modern Indian elegance.
          </p>

          <div className="mx-auto mt-6 h-px w-20 bg-primary/30" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
        <h2 className="mb-10 text-center font-heading text-2xl font-semibold sm:text-3xl">
          Shop by Category
        </h2>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6 lg:grid-cols-9">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?${cat.param}`}
                className="group flex flex-col items-center gap-2.5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-xl transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg sm:h-20 sm:w-20 sm:text-2xl">
                  {cat.icon}
                </div>

                <span className="text-center text-xs font-medium leading-tight text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
