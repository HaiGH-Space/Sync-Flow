'use client'
import { Variants } from "motion";
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import LightBeam from "./LightBeam";
import z from "zod";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import AuthField from "./AuthField";
import { Button } from "../ui/button";
import LogoAppAnimation from "../share/LogoAppAnimation";
import { login } from "@/lib/services/auth";
import { useUserStore } from "@/lib/hooks/use-user-profile";

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

const containerVariants = {
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
    transition: { duration: 0.2 }
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
  const [mode, setMode] = useState<AuthMode>("login");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const {
    setUserProfile,
    userProfile
  } = useUserStore()
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
      const toastId = "auth-action";
      setAuthState("loading");
      toast.loading(mode === "login" ? "Đang đăng nhập..." : "Đang đăng ký...", { id: toastId });
      try {
        if (mode === "login") {
          const response = await login({ email: value.email, password: value.password });
          setUserProfile(response.data);
          toast.success("Đăng nhập thành công!", { id: toastId });
        } else {
          
        }
        setAuthState("success");
        console.log(userProfile);
      } catch (error) {
        toast.error((error as Error).message, {
          id: toastId,
        });
        setAuthState("error");
      }
    }
  });

  return <motion.div
    layout
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="shadow-primary/20 relative w-full max-w-xs sm:max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-md"
  >
    <LightBeam />

    <AnimatePresence mode="wait">
      <motion.div initial="hidden" animate="visible" exit="exit" key={mode} variants={containerVariants} >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <LogoAppAnimation />
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Welcome back! Please sign in to your account." : "Create a new account to get started."}
          </p>
        </motion.div>
        <form id="auth-form" onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        >
          <AnimatePresence key={'form'}>
            {mode === "register" && (
              <AuthField form={form} name="fullName" key="fullName" variants={itemVariants} placeholder="Enter your full name" icon={UserIcon} />
            )}
          </AnimatePresence>
          <AuthField form={form} name="email" key="email" variants={itemVariants} placeholder="Enter your email" icon={MailIcon} />
          <AuthField form={form} name="password" key="password" variants={itemVariants} placeholder="Enter your password" icon={LockIcon} />
          <motion.div variants={itemVariants} className="mt-4">
            <Button className="w-full h-10" type="submit">{mode === "login" ? "Sign In" : "Create Account"}</Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className=" flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-border" />
            <span className="uppercase text-xs text-muted-foreground tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          <motion.p variants={itemVariants} className="mt-4 text-sm text-center text-muted-foreground"
          >
            {mode === "login" ? (
              <>
                Dont have an account?{" "}
                <span onClick={() => switchMode("register")} className="text-primary hover:text-primary/80 cursor-pointer mt-4" >Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => switchMode("login")} className="text-primary hover:text-primary/80 cursor-pointer mt-4">Sign in</span>
              </>)}
          </motion.p>
        </form>
      </motion.div>
    </AnimatePresence >
  </motion.div >
}
export default AuthCard;