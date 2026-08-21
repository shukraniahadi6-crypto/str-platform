import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Job, JobStatus } from '@/lib/types';
import * as jobsService from '@/services/jobs';

interface JobsState {
  activeJobs: Job[];
  completedJobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  activeJobs: [],
  completedJobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

export const fetchActiveJobs = createAsyncThunk('jobs/fetchActive', jobsService.getActiveJobs);
export const fetchCompletedJobs = createAsyncThunk('jobs/fetchCompleted', jobsService.getCompletedJobs);
export const fetchJobDetail = createAsyncThunk('jobs/fetchDetail', jobsService.getJobDetail);
export const startJobAction = createAsyncThunk('jobs/start', jobsService.startJob);
export const completeJobAction = createAsyncThunk('jobs/complete', jobsService.completeJob);
export const updateJobStatusAction = createAsyncThunk(
  'jobs/updateStatus',
  ({ jobId, status }: { jobId: string; status: JobStatus }) => jobsService.updateJobStatus(jobId, status),
);

const upsert = (jobs: Job[], job: Job): Job[] => {
  const next = jobs.filter((entry) => entry.id !== job.id);
  return [job, ...next];
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.activeJobs = action.payload;
      })
      .addCase(fetchCompletedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.completedJobs = action.payload;
      })
      .addCase(fetchJobDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(startJobAction.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.activeJobs = upsert(state.activeJobs, action.payload);
      })
      .addCase(completeJobAction.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.activeJobs = state.activeJobs.filter((job) => job.id !== action.payload.id);
        state.completedJobs = upsert(state.completedJobs, action.payload);
      })
      .addCase(updateJobStatusAction.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.activeJobs = upsert(state.activeJobs, action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith('jobs/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('jobs/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message ?? 'Unable to load jobs';
        },
      );
  },
});

export default jobsSlice.reducer;
