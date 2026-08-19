import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/helpers'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  secondary: 'bg-slate-900 text-white hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => (
  <button
    className={cn(
      'rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
      variantClass[variant],
      className,
    )}
    {...props}
  />
)
