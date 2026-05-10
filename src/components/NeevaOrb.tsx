import { motion } from "framer-motion";

interface NeevaOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export function NeevaOrb({ size = "md", className = "", animated = true }: NeevaOrbProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-28 h-28",
  };

  return (
    <motion.div
      className={`neeva-orb ${sizeClasses[size]} ${className}`}
      animate={
        animated
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)",
              ],
            }
          : undefined
      }
      transition={
        animated
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    />
  );
}
