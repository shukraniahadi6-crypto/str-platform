import { Card } from '../common/Card'

export const ReportCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <h4 className='text-sm text-slate-600'>{title}</h4>
    <p className='mt-2 text-2xl font-bold text-slate-900'>{value}</p>
  </Card>
)
