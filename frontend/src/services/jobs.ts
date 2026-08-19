import { mockJobs } from '../data/mockData'
import type { Job } from '../types'

export const getJobs = async () => Promise.resolve(mockJobs)

export const getJobById = async (jobId: string): Promise<Job | undefined> =>
  Promise.resolve(mockJobs.find((job) => job.id === jobId))
