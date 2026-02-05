import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="relative z-10 w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    )
}
