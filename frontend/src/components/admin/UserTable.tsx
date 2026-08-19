import type { User } from '../../types'

export const UserTable = ({ users }: { users: User[] }) => (
  <div className='overflow-x-auto rounded-xl border border-slate-200 bg-white'>
    <table className='w-full text-left text-sm'>
      <thead className='bg-slate-50 text-slate-600'>
        <tr>
          <th className='px-3 py-2'>Name</th>
          <th className='px-3 py-2'>Email</th>
          <th className='px-3 py-2'>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className='border-t border-slate-100'>
            <td className='px-3 py-2'>{user.name}</td>
            <td className='px-3 py-2'>{user.email}</td>
            <td className='px-3 py-2 capitalize'>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
