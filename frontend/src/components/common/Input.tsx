import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/helpers'

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500',
      className,
    )}
    {...props}
  />
)
