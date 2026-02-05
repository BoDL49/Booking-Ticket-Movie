import { auth } from "@/auth"
import { NavbarClient } from "./navbar-client"

import { db } from "@/lib/db"

export async function Navbar() {
    const session = await auth()

    // Fetch fresh user data to ensure avatar/name is up-to-date
    let user = session?.user
    if (session?.user?.id) {
        const dbUser = await db.user.findUnique({
            where: { id: session.user.id }
        })
        if (dbUser) {
            user = {
                ...session.user,
                name: dbUser.name,
                image: dbUser.image,
                role: dbUser.role,
            } as any
        }
    }

    return <NavbarClient user={user as any} />
}
