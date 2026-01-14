"use server"

import { db } from "@/lib/db"
import { Status } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateEmailStatus(emailId: string, status: Status) {
    try {
        await db.email.update({
            where: { id: emailId },
            data: { status }
        })
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to update status", error)
        return { success: false, error: "Failed to update status" }
    }
}
