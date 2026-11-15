import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className = "",
  light = false
}) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold-500/10 text-gold-400 border border-gold-500/30 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span>{badge}</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight leading-tight mb-4 ${
          light ? 'text-stone-900' : 'text-stone-100'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base sm:text-lg leading-relaxed font-light ${
            light ? 'text-stone-600' : 'text-stone-400'
          }`}
        >
          {subtitle}
        </motion.p>
      )}

      <div className={`flex items-center gap-3 mt-6 ${centered ? 'justify-center' : 'justify-start'}`}>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-gold-500/50 to-gold-400"></span>
        <span className="w-2 h-2 rotate-45 bg-gold-400"></span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent via-gold-500/50 to-gold-400"></span>
      </div>
    </div>
  );
}

