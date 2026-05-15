import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Gold Jewellery', param: 'metal=Gold', icon: '✦' },
  { name: 'Silver Jewellery', param: 'metal=Silver', icon: '◆' },
  { name: 'Diamond Jewellery', param: 'metal=Diamond', icon: '◇' },
  { name: 'Rings', param: 'category=Rings', icon: '○' },
  { name: 'Necklaces', param: 'category=Necklaces', icon: '◎' },
  { name: 'Earrings', param: 'category=Earrings', icon: '❖' },
  { name: 'Bracelets', param: 'category=Bracelets', icon: '◈' },
  { name: 'Bangles', param: 'category=Bangles', icon: '◉' },
  { name: 'Pendants', param: 'category=Pendants', icon: '♦' },
];

export default function CategoryLinks() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-center mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-6">
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
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center text-xl sm:text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-lg">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
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