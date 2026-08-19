import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAppStore } from './store/useAppStore'
import { LoginPage } from './pages/auth/Login'
import { SignupPage } from './pages/auth/Signup'
import { ForgotPasswordPage } from './pages/auth/ForgotPassword'
import { HomePage } from './pages/Home'
import { CustomerDashboardPage } from './pages/customer/Dashboard'
import { CreateJobPage } from './pages/customer/CreateJob'
import { CustomerJobDetailsPage } from './pages/customer/JobDetails'
import { CustomerJobHistoryPage } from './pages/customer/JobHistory'
import { PricingCalculatorPage } from './pages/customer/PricingCalculator'
import { PaymentMethodsPage } from './pages/customer/PaymentMethods'
import { CustomerProfilePage } from './pages/customer/Profile'
import { CustomerSettingsPage } from './pages/customer/Settings'
import { CourierDashboardPage } from './pages/courier/Dashboard'
import { CourierAvailableJobsPage } from './pages/courier/AvailableJobs'
import { CourierActiveJobsPage } from './pages/courier/ActiveJobs'
import { CourierEarningsPage } from './pages/courier/Earnings'
import { CourierProfilePage } from './pages/courier/Profile'
import { CourierSettingsPage } from './pages/courier/Settings'
import { AdminDashboardPage } from './pages/admin/Dashboard'
import { AdminUsersPage } from './pages/admin/Users'
import { AdminJobsPage } from './pages/admin/Jobs'
import { AdminTransactionsPage } from './pages/admin/Transactions'
import { AdminDisputesPage } from './pages/admin/Disputes'
import { AdminContentPage } from './pages/admin/Content'
import { AdminHealthPage } from './pages/admin/Health'
import { AdminReportsPage } from './pages/admin/Reports'
import { JobDetailsPage } from './pages/JobDetails'
import { CheckoutPaymentPage } from './pages/CheckoutPayment'
import { ProfilePage } from './pages/Profile'
import { SettingsPage } from './pages/Settings'
import { NotificationsPage } from './pages/Notifications'
import { ChatPage } from './pages/Chat'
import { ReviewsPage } from './pages/Reviews'
import { ErrorPage } from './pages/Error'
import { NotFoundPage } from './pages/NotFound'

const customerNav = [
  { label: 'Dashboard', to: '/customer/dashboard' },
  { label: 'Create Job', to: '/customer/create-job' },
  { label: 'Active & History', to: '/customer/history' },
  { label: 'Pricing', to: '/customer/pricing' },
  { label: 'Payment Methods', to: '/customer/payments' },
  { label: 'Profile', to: '/customer/profile' },
  { label: 'Settings', to: '/customer/settings' },
]

const courierNav = [
  { label: 'Dashboard', to: '/courier/dashboard' },
  { label: 'Available Jobs', to: '/courier/available-jobs' },
  { label: 'Active Jobs', to: '/courier/active-jobs' },
  { label: 'Earnings', to: '/courier/earnings' },
  { label: 'Profile', to: '/courier/profile' },
  { label: 'Settings', to: '/courier/settings' },
]

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Jobs', to: '/admin/jobs' },
  { label: 'Transactions', to: '/admin/transactions' },
  { label: 'Disputes', to: '/admin/disputes' },
  { label: 'Content', to: '/admin/content' },
  { label: 'Health', to: '/admin/health' },
  { label: 'Reports', to: '/admin/reports' },
]

const CustomerShell = () => (
  <DashboardLayout items={customerNav}>
    <Outlet />
  </DashboardLayout>
)

const CourierShell = () => (
  <DashboardLayout items={courierNav}>
    <Outlet />
  </DashboardLayout>
)

const AdminShell = () => (
  <DashboardLayout items={adminNav}>
    <Outlet />
  </DashboardLayout>
)

function App() {
  const darkMode = useAppStore((state) => state.darkMode)

  return (
    <ErrorBoundary>
      <div className={darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/auth/login' element={<LoginPage />} />
          <Route path='/auth/signup' element={<SignupPage />} />
          <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />

          <Route path='/customer' element={<CustomerShell />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<CustomerDashboardPage />} />
            <Route path='create-job' element={<CreateJobPage />} />
            <Route path='jobs/:id' element={<CustomerJobDetailsPage />} />
            <Route path='history' element={<CustomerJobHistoryPage />} />
            <Route path='pricing' element={<PricingCalculatorPage />} />
            <Route path='payments' element={<PaymentMethodsPage />} />
            <Route path='profile' element={<CustomerProfilePage />} />
            <Route path='settings' element={<CustomerSettingsPage />} />
          </Route>

          <Route path='/courier' element={<CourierShell />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<CourierDashboardPage />} />
            <Route path='available-jobs' element={<CourierAvailableJobsPage />} />
            <Route path='active-jobs' element={<CourierActiveJobsPage />} />
            <Route path='earnings' element={<CourierEarningsPage />} />
            <Route path='profile' element={<CourierProfilePage />} />
            <Route path='settings' element={<CourierSettingsPage />} />
          </Route>

          <Route path='/admin' element={<AdminShell />}>
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<AdminDashboardPage />} />
            <Route path='users' element={<AdminUsersPage />} />
            <Route path='jobs' element={<AdminJobsPage />} />
            <Route path='transactions' element={<AdminTransactionsPage />} />
            <Route path='disputes' element={<AdminDisputesPage />} />
            <Route path='content' element={<AdminContentPage />} />
            <Route path='health' element={<AdminHealthPage />} />
            <Route path='reports' element={<AdminReportsPage />} />
          </Route>

          <Route path='/job-details' element={<JobDetailsPage />} />
          <Route path='/checkout' element={<CheckoutPaymentPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/reviews' element={<ReviewsPage />} />
          <Route path='/error' element={<ErrorPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster position='top-right' />
      </div>
    </ErrorBoundary>
  )
}

export default App
