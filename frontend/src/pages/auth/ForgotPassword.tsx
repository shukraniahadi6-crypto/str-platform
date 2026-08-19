import { Button } from '../../components/common/Button'
import { FormField } from '../../components/common/FormField'
import { Input } from '../../components/common/Input'

export const ForgotPasswordPage = () => (
  <div className='mx-auto w-full max-w-md px-4 py-8'>
    <form className='space-y-4 rounded-xl border border-slate-200 bg-white p-6'>
      <h1 className='text-2xl font-bold'>Reset password</h1>
      <FormField label='Email'>
        <Input type='email' placeholder='you@example.com' />
      </FormField>
      <Button type='submit' className='w-full'>
        Send reset link
      </Button>
    </form>
  </div>
)
