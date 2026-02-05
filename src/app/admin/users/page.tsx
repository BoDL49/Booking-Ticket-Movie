import { getUsers } from "@/actions/admin/user-actions"
import { UsersTable } from "@/components/admin/users/users-table"
import { Users, Shield } from "lucide-react"

export default async function AdminUsersPage() {
    const { users } = await getUsers()

    if (!users) {
        return <div className="text-white">Không tải được danh sách người dùng.</div>
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Users className="w-4 h-4" /> User Management
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-600">Khách Hàng</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">
                        Xem danh sách, quản lý điểm thưởng và phân quyền tài khoản.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng người dùng</p>
                            <p className="text-2xl font-black italic tracking-tighter text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <Shield className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Quản trị viên</p>
                            <p className="text-2xl font-black italic tracking-tighter text-red-500">
                                {users.filter((u: any) => u.role === 'ADMIN').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <UsersTable users={users as any} />
            </div>
        </div>
    )
}
