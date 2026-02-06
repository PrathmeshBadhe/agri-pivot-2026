import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Simplified version without radix slot dependency for strict adherence to "no extra installs" if possible, 
// but lucide-react was approved. Radix is standard but let's keep it simple HTML button for now to avoid dependency hell if not installed.
// Actually, I'll stick to a simple button to avoid 'radix-ui' install unless I run it.
// The prompt didn't strictly forbid it, but said "Strict Adherence" to stack. Radix wasn't listed.
// I'll build a pure Tailwind button.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
            secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
            outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
            ghost: "hover:bg-slate-100 text-slate-900",
        };

        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-11 px-8 text-sm",
            lg: "h-14 px-8 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
