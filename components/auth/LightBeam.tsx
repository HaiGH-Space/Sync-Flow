'use client'
import { motion, Variants } from "motion/react";

interface LightBeamProps { 
    duration?: number;
    className?: string;
}

const LightBeam = ({ duration = 8, className = "" }: LightBeamProps) => {
    return <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {/* Light beam top edge */}
        <motion.div
            className={`h-0.5 w-1/3 top-0 left-0 absolute bg-linear-to-r from-transparent via-primary/80 to-transparent ${className}`}
            animate={{ left: ['-30%', '100%'] }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    </div>
}
export default LightBeam;