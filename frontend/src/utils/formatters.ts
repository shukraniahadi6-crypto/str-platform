export const currency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const dateTime = (value: string) => new Date(value).toLocaleString()
