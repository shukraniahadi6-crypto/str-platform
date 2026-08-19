import { Job } from '@/lib/types'; export const JobCard = ({ job }: { job: Job }) => <div className='rounded border p-3'>{job.id} • {job.status}</div>;
