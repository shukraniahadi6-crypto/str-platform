export const Avatar = ({ name }: { name: string }) => <div className='flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold'>{name.slice(0,2).toUpperCase()}</div>;
