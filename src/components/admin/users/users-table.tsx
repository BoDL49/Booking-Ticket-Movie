"use client"

import { useState, useTransition } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, User as UserIcon, Shield, Trash2, Mail, Calendar } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { updateUserRole, deleteUser } from "@/actions/admin/user-actions"
import { DeleteAlertDialog } from "@/components/admin/delete-alert-dialog"
// import { $Enums } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

interface User {
    id: string
    name: string | null
    email: string
    image: string | null
    role: "USER" | "ADMIN"
    loyaltyPoints: number
    createdAt: Date
    _count: {
        bookings: number
    }
}

export function UsersTable({ users }: { users: User[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [isPending, startTransition] = useTransition()

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleRoleChange = (id: string, newRole: "USER" | "ADMIN") => {
        startTransition(async () => {
            const result = await updateUserRole(id, newRole)
            if (result.success) {
                toast.success(result.success)
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!userToDelete) return

        startTransition(async () => {
            const result = await deleteUser(userToDelete)
            if (result.success) {
                toast.success(result.success)
                setDeleteDialogOpen(false)
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-zinc-950/30 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
                    <Input
                        placeholder="Tìm theo tên hoặc email..."
                        className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-green-500/20 focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Lọc theo vai trò" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                            <SelectItem value="USER">User (Khách)</SelectItem>
                            <SelectItem value="ADMIN">Admin (Quản trị)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-zinc-950/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="font-bold text-zinc-400 pl-6">Người dùng</TableHead>
                            <TableHead className="font-bold text-zinc-400">Vai trò</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-center">Điểm thưởng</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-center">Đơn hàng</TableHead>
                            <TableHead className="font-bold text-zinc-400 text-right pr-6">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-zinc-500 font-bold italic">
                                    Không tìm thấy người dùng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10">
                                                {user.image ? (
                                                    <img src={user.image} className="w-full h-full object-cover" alt={user.name || ""} />
                                                ) : (
                                                    <UserIcon className="w-5 h-5 text-zinc-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{user.name || "Chưa đặt tên"}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(val: Role) => handleRoleChange(user.id, val)}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className={`w-[110px] h-8 text-xs font-bold border-0 ${user.role === 'ADMIN'
                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20'
                                                }`}>
                                                <div className="flex items-center gap-1.5">
                                                    {user.role === 'ADMIN' ? <Shield className="w-3 h-3 fill-current" /> : <UserIcon className="w-3 h-3" />}
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0 font-bold">
                                            {user.loyaltyPoints} pts
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-zinc-400">
                                        {user._count.bookings}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                                                <div className="px-2 py-1.5 text-xs text-zinc-500 font-bold border-b border-white/5 mb-1">
                                                    Tham gia: {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(user.id)}
                                                    className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Xóa người dùng
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isPending}
                title="Xóa tài khoản người dùng"
                description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này sẽ xóa vĩnh viễn tài khoản và lịch sử đặt vé của họ."
            />
        </div>
    )
}
