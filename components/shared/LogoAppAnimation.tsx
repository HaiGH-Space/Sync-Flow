'use client'
import { motion } from "motion/react";
const LogoAppAnimation = () => {
  return <motion.h1 className="bg-clip-text text-3xl font-bold bg-linear-to-r from-foreground via-primary to-foreground text-transparent"
            style={{
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Sync Flow
          </motion.h1>
}

export default LogoAppAnimation;