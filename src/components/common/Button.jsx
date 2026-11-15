import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'gold', // 'gold' | 'gold-outline' | 'whatsapp' | 'dark' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  to,
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  target,
  rel,
  fullWidth = false,
  ...props
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 select-none overflow-hidden group focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-[#07080a] disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs tracking-wider uppercase font-semibold gap-2",
    md: "px-6 py-3 text-sm tracking-wide gap-2.5",
    lg: "px-8 py-4 text-base tracking-wide font-medium gap-3"
  };

  const variantStyles = {
    gold: "bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-stone-950 font-semibold shadow-gold hover:shadow-gold-lg hover:brightness-105 active:scale-[0.98]",
    'gold-outline': "border border-gold-500/70 text-gold-300 hover:text-stone-950 hover:bg-gold-500 hover:border-gold-500 backdrop-blur-sm shadow-gold-sm hover:shadow-gold active:scale-[0.98]",
    whatsapp: "bg-[#25D366] text-stone-950 font-semibold hover:bg-[#20bd5a] shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/50 active:scale-[0.98]",
    dark: "bg-stone-900/90 text-stone-200 border border-stone-800 hover:border-gold-500/40 hover:text-gold-300 shadow-md active:scale-[0.98]",
    ghost: "text-stone-300 hover:text-gold-300 hover:bg-gold-500/10 active:scale-[0.98]"
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} transition-transform group-hover:scale-110`} />
      )}
      <span className="relative z-10">{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} transition-transform group-hover:translate-x-1`} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedStyles}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}

