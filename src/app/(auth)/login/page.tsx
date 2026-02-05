import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="relative z-10 w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
}
