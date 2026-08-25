import { useEffect, useState } from 'react'
import { getJobs } from '../services/jobs'
import type { Job } from '../types'

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getJobs()
      .then(setJobs)
      .finally(() => setLoading(false))
  }, [])

  return { jobs, loading }
}
