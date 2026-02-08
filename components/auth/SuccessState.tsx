'use client'
import { useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface SuccessStateProps {
    isLogin: boolean;
    userName?: string;
}

const SuccessState = ({ isLogin, userName }: SuccessStateProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    useEffect(() => {
        console.log("State check:", { isLogin, redirectTo });
        if (isLogin) {
            const timer = setTimeout(() => {
                router.push(redirectTo);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLogin, router, redirectTo]);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col py-8 items-center justify-center text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative w-20 h-20 mb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="flex justify-center items-center absolute inset-0 rounded-full bg-primary"
                >
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}>
                        <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-semibold">{isLogin ? `Welcome back, ${userName || 'User'}!` : 'Account Created Successfully!'}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-2 text-sm text-muted-foreground">{isLogin ? 'Redirecting you to your dashboard in 3 seconds...' : 'Redirecting you to your login in 3 seconds...'}</motion.p>
        </motion.div>
    )
}

export default SuccessState;