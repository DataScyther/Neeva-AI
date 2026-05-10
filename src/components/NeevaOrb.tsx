import React from "react";
import { NeevaLogo } from "./NeevaLogo";

interface NeevaOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * NeevaOrb — Backward-compatible wrapper around NeevaLogo.
 * All new code should import NeevaLogo directly.
 */
export function NeevaOrb({ size = "md", className = "" }: NeevaOrbProps) {
  // Map old NeevaOrb sizes to NeevaLogo sizes
  const sizeMap: Record<string, "sm" | "md" | "lg"> = {
    sm: "sm",
    md: "md",
    lg: "lg",
  };

  return (
    <NeevaLogo
      size={sizeMap[size] || "md"}
      glow
      className={className}
    />
  );
}

export default NeevaOrb;
