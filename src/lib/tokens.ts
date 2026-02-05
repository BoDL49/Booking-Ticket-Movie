import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    // Expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await db.verificationToken.findFirst({
        where: { email }
    })

    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    // Expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await db.passwordResetToken.findFirst({
        where: { email }
    })

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}
