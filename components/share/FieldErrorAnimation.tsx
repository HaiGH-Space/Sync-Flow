'use client'
import { AnimatePresence, motion } from "motion/react"
import { FieldError } from "../ui/field"

type FieldErrorAnimationProps = {
    isInvalid: boolean;
    errors?: Array<{ message?: string } | undefined>;
}

const FieldErrorAnimation = ({ isInvalid, errors }: FieldErrorAnimationProps) => {
    return <AnimatePresence mode="wait">
        {isInvalid && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <FieldError errors={errors} />
            </motion.div>
        )}
    </AnimatePresence>
}

export default FieldErrorAnimation;