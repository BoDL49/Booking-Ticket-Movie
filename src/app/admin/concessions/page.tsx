import { db } from "@/lib/db"
import { Popcorn, Plus, Search, Filter, Tags, ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/concessions/products-table"
import { CategoriesTable } from "@/components/admin/concessions/categories-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminConcessionsPage() {
    const products = await db.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    })

    const categories = await db.productCategory.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Popcorn className="w-4 h-4" /> Inventory
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                        Quản lý <span className="text-green-600">Bắp Nước</span>
                    </h1>
                    <p className="text-zinc-500 max-w-md italic">Cập nhật thực đơn, giá cả và các chương trình combo bắp nước.</p>
                </div>

                <div className="flex items-center gap-3">
                    <ProductsTable products={products} categories={categories} mode="add-trigger" />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Sản phẩm", value: products.length, color: "text-blue-500", icon: ShoppingBasket },
                    { label: "Danh mục", value: categories.length, color: "text-purple-500", icon: Tags },
                    { label: "Bắp & Nước", value: products.filter((p: any) => p.category?.name !== 'Combo').length, color: "text-yellow-500", icon: Popcorn },
                    { label: "Các Combo", value: products.filter((p: any) => p.category?.name === 'Combo').length, color: "text-green-500", icon: Filter },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl group hover:border-green-500/20 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color} opacity-40`} />
                        </div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Content Area with Tabs */}
            <Tabs defaultValue="products" className="flex-1 flex flex-col space-y-6">
                <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-xl w-fit">
                    <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white font-bold italic px-6">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white font-bold italic px-6">Danh mục</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="flex-1 bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl mt-0">
                    <ProductsTable products={products} categories={categories} />
                </TabsContent>

                <TabsContent value="categories" className="flex-1 bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl mt-0">
                    <CategoriesTable categories={categories} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
