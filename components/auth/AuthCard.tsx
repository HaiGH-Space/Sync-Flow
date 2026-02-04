'use client'
import { Variants } from "motion";
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import LightBeam from "./LightBeam";
import z from "zod";
import { toast } from "sonner";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import FieldErrorAnimation from "../share/FieldErrorAnimation";

type AuthMode = "login" | "register";
type AuthState = "idle" | "loading" | "error" | "success";

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

const containerVariants = (mode: AuthMode): Variants => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      }
    },
    exit: {
      opacity: 0,
      x: mode === "login" ? -20 : 20,
      transition: { duration: 0.2 }
    }
  }
}

const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const registerSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const defaultValues = {
  email: "",
  password: "",
  fullName: "",
};

const AuthCard = () => {
  const [mode, setMode] = useState<AuthMode>("register");
  const [authState, setAuthState] = useState<AuthState>("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentSchema = (mode === "login" ? loginSchema : registerSchema) as z.ZodType<any, any, any>;
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    form.reset(); 
  };
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: currentSchema,
      onChange: currentSchema,
    },
    onSubmit: async ({ value }) => {
      const submitAction = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Giả lập logic: 80% thành công, 20% thất bại để test
          if (Math.random() > 0.2) resolve({ name: "User" });
          else reject(new Error("Mạng lag quá!"));
        }, 2000);
      });
      setAuthState("loading");
      toast.promise(submitAction, {
        loading: mode === "login" ? "Đang đăng nhập..." : "Đang đăng ký...",
        success: () => {
          setAuthState("success");
          return mode === "login" ? "Đăng nhập thành công!" : "Đăng ký thành công!";
        },
        error: (err) => {
          setAuthState("error");
          return "Có lỗi xảy ra: " + err.message;
        },
      });
    }
  });

  return <motion.div
    layout
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="shadow-primary/20 relative w-full max-w-xs sm:max-w-md md:max-w-lg bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-md"
  >
    <LightBeam />

    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        key={mode}
        variants={containerVariants(mode)}
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
        <form id="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <AnimatePresence
            key={'form'}
          >
            {mode === "register" && (
              <motion.div
                variants={itemVariants}
                key="fullName"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <form.Field name="fullName">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Enter your full name"
                          autoComplete="off"
                        />
                        <FieldErrorAnimation isInvalid={isInvalid} errors={field.state.meta.errors} />
                      </Field>
                    )
                  }}
                </form.Field>
              </motion.div>
            )}
            <motion.div key={'email'} variants={itemVariants} className="mt-4">
              <form.Field name="email">
                {
                  (field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter your email"
                        />
                        <FieldErrorAnimation isInvalid={isInvalid} errors={field.state.meta.errors} />
                      </Field>
                    )
                  }}
              </form.Field>
            </motion.div>
            <motion.div key={'password'} variants={itemVariants} className="mt-4">
              <form.Field name="password">
                {
                  (field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <FieldErrorAnimation isInvalid={isInvalid} errors={field.state.meta.errors} />
                      </Field>
                    )
                  }}
              </form.Field>
            </motion.div>
          </AnimatePresence>
          <motion.div
            variants={itemVariants}
            className="mt-4"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            <span className="cursor-pointer text-sm text-primary hover:underline">{mode === "register" ? "Already have an account? Log in" : "Don't have an account? Register"}</span>
          </motion.div>
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <Button disabled={authState==="loading"} className="cursor-pointer mt-4" type="submit">Submit</Button>
          </motion.div>
        </form>
      </motion.div>
    </AnimatePresence >
  </motion.div >
}

export default AuthCard;