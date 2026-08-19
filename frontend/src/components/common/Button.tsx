import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700', className)} {...props} />;
}
