import { UserTable } from '../../components/admin/UserTable'
import { mockUsers } from '../../data/mockData'

export const AdminUsersPage = () => <UserTable users={mockUsers} />
