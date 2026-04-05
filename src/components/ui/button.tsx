import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./utils"

const buttonVariants = cva(
  "font-display transition-all duration-500 relative overflow-hidden group inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black hover:shadow-lg hover:shadow-[#d4af37]/30 before:absolute before:inset-0 before:bg-[#d4af37] before:translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-500 disabled:opacity-50 disabled:cursor-not-allowed",
        secondary:
          "bg-transparent text-[#d4af37] hover:bg-[#d4af37] hover:text-black hover:shadow-2xl hover:shadow-[#d4af37]/40 border-2 border-[#d4af37] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300",
        outline:
          "bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed",
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-10 py-4 tracking-[0.2em] uppercase",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "p-3 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  iconOnly?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, iconOnly = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const finalSize = iconOnly ? "icon" : size

    return (
      <Comp
        className={cn(buttonVariants({ variant, size: finalSize, className }))}
        ref={ref}
        style={{
          backgroundSize: '200% 100%',
        }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
