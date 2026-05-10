import React from "react";
import { motion } from "framer-motion";

interface NeevaLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  glow?: boolean;
  breathe?: boolean;
  pulse?: boolean;
  className?: string;
}

const sizeMap: Record<string, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 96,
  hero: 140,
};

/**
 * NeevaLogo — Premium SVG brain mark with holographic gradient.
 *
 * Features:
 *  - Clean geometric brain silhouette with rounded organic paths
 *  - Multi-stop holographic gradient (pink → violet → blue → cyan)
 *  - Optional frosted glow halo behind the mark
 *  - Breathing, pulse, and float animations via framer-motion
 */
export function NeevaLogo({
  size = "md",
  glow = false,
  breathe = false,
  pulse = false,
  className = "",
}: NeevaLogoProps) {
  const px = sizeMap[size] || 40;

  // Animation variants
  const motionProps = breathe
    ? {
        animate: {
          scale: [1, 1.035, 1],
          filter: [
            "brightness(1)",
            "brightness(1.06)",
            "brightness(1)",
          ],
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : pulse
      ? {
          animate: {
            scale: [1, 1.06, 1],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }
      : {};

  return (
    <motion.div
      className={`neeva-logo-container ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px,
        height: px,
        flexShrink: 0,
      }}
      {...motionProps}
    >
      {/* Glow Halo */}
      {glow && (
        <div
          className="neeva-glow-halo"
          style={{
            position: "absolute",
            inset: "-30%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(236,72,153,0.1) 35%, rgba(59,130,246,0.06) 60%, transparent 75%)",
            animation: "neeva-glow-pulse 4s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* SVG Brain Logo */}
      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "relative", zIndex: 1 }}
      >
        <defs>
          {/* Holographic multi-stop gradient */}
          <linearGradient
            id={`neeva-holo-${size}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="25%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Frosted inner shine */}
          <radialGradient
            id={`neeva-shine-${size}`}
            cx="35%"
            cy="30%"
            r="60%"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity="0.35"
            />
            <stop
              offset="100%"
              stopColor="#ffffff"
              stopOpacity="0"
            />
          </radialGradient>

          {/* Soft drop shadow filter */}
          <filter
            id={`neeva-shadow-${size}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Brain silhouette ── */}
        {/* Outer rounded container — soft frosted circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.1"
        />

        {/* Left hemisphere */}
        <path
          d="M50 22 C38 22, 22 30, 22 46 C22 56, 28 64, 36 68 C38 74, 44 80, 50 80"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter={`url(#neeva-shadow-${size})`}
        />
        {/* Left lobe detail — upper curve */}
        <path
          d="M44 30 C34 32, 28 40, 30 50"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left lobe detail — lower curve */}
        <path
          d="M30 50 C28 56, 32 62, 38 64"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right hemisphere */}
        <path
          d="M50 22 C62 22, 78 30, 78 46 C78 56, 72 64, 64 68 C62 74, 56 80, 50 80"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter={`url(#neeva-shadow-${size})`}
        />
        {/* Right lobe detail — upper curve */}
        <path
          d="M56 30 C66 32, 72 40, 70 50"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right lobe detail — lower curve */}
        <path
          d="M70 50 C72 56, 68 62, 62 64"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Center stem / corpus callosum */}
        <line
          x1="50"
          y1="26"
          x2="50"
          y2="76"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Synapse nodes — small circles at intersections */}
        <circle
          cx="50"
          cy="34"
          r="2.5"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.9"
        />
        <circle
          cx="38"
          cy="46"
          r="2"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.7"
        />
        <circle
          cx="62"
          cy="46"
          r="2"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.7"
        />
        <circle
          cx="50"
          cy="58"
          r="2.5"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.9"
        />
        <circle
          cx="42"
          cy="66"
          r="1.8"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.6"
        />
        <circle
          cx="58"
          cy="66"
          r="1.8"
          fill={`url(#neeva-holo-${size})`}
          opacity="0.6"
        />

        {/* Neural connection lines — subtle links between nodes */}
        <path
          d="M50 34 L38 46"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M50 34 L62 46"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M38 46 L50 58"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M62 46 L50 58"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M50 58 L42 66"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M50 58 L58 66"
          stroke={`url(#neeva-holo-${size})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Frosted shine overlay */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={`url(#neeva-shine-${size})`}
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}

export default NeevaLogo;
