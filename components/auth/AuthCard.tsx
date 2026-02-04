'use client'
import { Variants } from "motion";
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import LightBeam from "./LightBeam";

type AuthMode = "login" | "register";
type AuthState = "idle" | "loading" | "error" | "success";

const AuthCard = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      x: mode === "login" ? -20 : 20,
      transition: { duration: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1, y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  }

  return <motion.div
    layout
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="shadow-primary/20 relative max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-md"
  >
    <LightBeam />

    <AnimatePresence mode="wait">
      {authState === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p className="text-muted-foreground">You have successfully {mode === "login" ? "logged in" : "registered"}.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          key={mode}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <motion.h1 className="bg-clip-text text-3xl font-bold bg-linear-to-r from-foreground via-primary to-foreground text-transparent"
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
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login" ? "Welcome back! Please sign in to your account." : "Create a new account to get started."}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
}

export default AuthCard;