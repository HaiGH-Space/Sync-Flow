import { LucideIcon } from "lucide-react";
import { Variants } from "motion";
import { motion } from "motion/react"
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import FieldErrorAnimation from "../share/FieldErrorAnimation";

type FieldApiMock = {
    name: string;
    state: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any;
        meta: {
            isTouched: boolean;
            errors?: Array<{ message?: string } | undefined>;
            isValid: boolean;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (value: any) => void;
    handleBlur: () => void;
};
interface AuthFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    name: string;
    icon?: LucideIcon;
    type?: string;
    placeholder?: string;
    variants?: Variants;
}

const AuthField = ({ form, name, icon: Icon, type = "text", placeholder = "", variants }: AuthFieldProps) => {
    return <motion.div
        className="mt-4"
        variants={variants}
        key={name}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
        <form.Field name={name}>
            {(field: FieldApiMock) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                    <Field data-invalid={isInvalid}>
                        <div className="relative">
                            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                            <Input
                                type={type}
                                className="pl-10 h-10 md:text-md"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                aria-invalid={isInvalid}
                                placeholder={placeholder}
                                autoComplete="off"
                            />
                        </div>
                        <FieldErrorAnimation isInvalid={isInvalid} errors={field.state.meta.errors} />
                    </Field>
                )
            }}
        </form.Field>
    </motion.div>
}

export default AuthField;