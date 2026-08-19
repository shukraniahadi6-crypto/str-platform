import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { FormField } from '../../components/common/FormField'
import { Input } from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema } from '../../utils/validators'

type LoginForm = {
  email: string
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginForm) => {
    const success = await signIn(values)
    if (success) navigate('/')
  }

  return (
    <div className='mx-auto w-full max-w-md px-4 py-8'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 rounded-xl border border-slate-200 bg-white p-6'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <FormField label='Email' error={errors.email?.message}>
          <Input type='email' {...register('email')} />
        </FormField>
        <FormField label='Password' error={errors.password?.message}>
          <Input type='password' {...register('password')} />
        </FormField>
        <Button disabled={isSubmitting} type='submit' className='w-full'>
          Sign in
        </Button>
      </form>
    </div>
  )
}
