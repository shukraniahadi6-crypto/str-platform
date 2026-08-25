import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { FormField } from '../../components/common/FormField'
import { Input } from '../../components/common/Input'
import { signup } from '../../services/auth'
import type { Role } from '../../types'

export const SignupPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('customer')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await signup(name, email, role)
    navigate('/auth/login')
  }

  return (
    <div className='mx-auto w-full max-w-md px-4 py-8'>
      <form onSubmit={submit} className='space-y-4 rounded-xl border border-slate-200 bg-white p-6'>
        <h1 className='text-2xl font-bold'>Create account</h1>
        <FormField label='Name'>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label='Email'>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
        </FormField>
        <FormField label='Role'>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
          >
            <option value='customer'>Customer</option>
            <option value='courier'>Courier</option>
          </select>
        </FormField>
        <Button type='submit' className='w-full'>
          Register
        </Button>
      </form>
    </div>
  )
}
