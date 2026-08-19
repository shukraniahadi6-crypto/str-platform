import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '../../components/common/Button'
import { FormField } from '../../components/common/FormField'
import { Input } from '../../components/common/Input'
import { createJobSchema } from '../../utils/validators'

type CreateJobForm = {
  title: string
  address: string
  price: number
}

export const CreateJobPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateJobForm>({ resolver: zodResolver(createJobSchema) })

  const onSubmit = (values: CreateJobForm) => {
    toast.success(`Job created: ${values.title}`)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 rounded-xl border border-slate-200 bg-white p-6'>
      <h1 className='text-2xl font-bold'>Create Pickup Job</h1>
      <FormField label='Title' error={errors.title?.message}>
        <Input {...register('title')} />
      </FormField>
      <FormField label='Address' error={errors.address?.message}>
        <Input {...register('address')} />
      </FormField>
      <FormField label='Expected Price (USD)' error={errors.price?.message}>
        <Input type='number' {...register('price', { valueAsNumber: true })} />
      </FormField>
      <Button type='submit'>Submit Job</Button>
    </form>
  )
}
