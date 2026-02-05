import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")
    // const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

    if (isApiAuthRoute) {
        return
    }

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return Response.redirect(new URL("/login", nextUrl))
        }
        if (req.auth?.user.role !== "ADMIN") {
            return Response.redirect(new URL("/", nextUrl))
        }
    }

    // if (isAuthRoute) {
    //     if (isLoggedIn) {
    //         return Response.redirect(new URL("/", nextUrl));
    //     }
    //     return null;
    // }

    return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
