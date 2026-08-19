import { clsx } from 'clsx'

export const cn = (...classes: Array<string | false | undefined>) => clsx(classes)
