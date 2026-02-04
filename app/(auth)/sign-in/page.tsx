import AnimatedBackground from "@/components/auth/AnimatedBackground";
import AuthCard from "@/components/auth/AuthCard";

export default function SignInPage() {
    return <>
        <AnimatedBackground />
        <div className="z-10 relative">
            <AuthCard />
        </div>
    </>;
}