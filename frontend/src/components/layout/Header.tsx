import { Link } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export const Header = () => {
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <header className='border-b border-slate-200 bg-white'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4'>
        <Link to='/' className='text-xl font-bold text-emerald-600'>
          STR Platform
        </Link>
        <button onClick={toggleDarkMode} className='text-sm text-slate-600' type='button'>
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  )
}
