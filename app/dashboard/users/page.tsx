import { requireAdmin } from '@/lib/auth-utils'
import { listUsers } from '@/lib/models/user/operations'
import { PageHeader } from '@/components/layout/page-header'
import { NewUserDialog } from './new-user-dialog'
import { UsersTable } from './users-table'

export default async function UsersPage() {
  await requireAdmin()
  const users = await listUsers()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Users">
        <NewUserDialog />
      </PageHeader>

      <UsersTable users={users} />
    </div>
  )
}
