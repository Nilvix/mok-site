"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-300 px-7 py-3.5 text-sm md:text-base select-none will-change-transform";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  outline:
    "border border-white/20 text-white hover:border-accent hover:text-accent bg-white/[0.02] backdrop-blur",
  ghost: "text-white/80 hover:text-white",
};

type Props = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
} & (
  | { href: string; type?: never; disabled?: never }
  | { href?: undefined; type?: "button" | "submit" | "reset"; disabled?: boolean }
);

export function Button({
  variant = "primary",
  className,
  children,
  onClick,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && rest.href) {
    const href = rest.href;
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
          whileHover={{ scale: 1.035 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.span
        className="inline-block"
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <Link href={href} className={classes} onClick={onClick}>
          {children}
        </Link>
      </motion.span>
    );
  }

  const { type = "button", disabled } = rest as {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      className={cn(classes, disabled && "pointer-events-none opacity-60")}
      whileHover={{ scale: disabled ? 1 : 1.035 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {children}
    </motion.button>
  );
}