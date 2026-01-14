import { db } from "@/lib/db"
import { Role, Status } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Create Admin
        const adminEmail = 'admin@portal.com'
        await db.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'Admin General',
                password: 'adminpassword',
                role: Role.ADMIN,
            },
        })

        // Create Supervisor
        await db.user.upsert({
            where: { email: 'supervisor@portal.com' },
            update: {},
            create: {
                email: 'supervisor@portal.com',
                name: 'Supervisor Jefe',
                password: 'password123',
                role: Role.SUPERVISOR,
            },
        })

        // Create Advisor
        const advisor = await db.user.upsert({
            where: { email: 'asesor1@portal.com' },
            update: {},
            create: {
                email: 'asesor1@portal.com',
                name: 'Juan Asesor',
                password: 'password123',
                role: Role.ADVISOR,
            },
        })

        // Create Dummy Emails
        await db.email.createMany({
            data: [
                {
                    googleId: `msg_${Date.now()}_1`,
                    subject: 'Problema con mi pedido',
                    snippet: 'No he recibido el producto...',
                    from: 'cliente@example.com',
                    date: new Date(),
                    status: Status.NEW,
                    attachmentCount: 1,
                    assigneeId: advisor.id
                },
                {
                    googleId: `msg_${Date.now()}_2`,
                    subject: 'Solicitud de información',
                    snippet: 'Quiero saber precios...',
                    from: 'interesado@test.com',
                    date: new Date(),
                    status: Status.IN_PROCESS,
                    attachmentCount: 0,
                    assigneeId: advisor.id
                }
            ],
            skipDuplicates: true
        })

        return NextResponse.json({ success: true, message: "Database seeded successfully" })
    } catch (error) {
        console.error("Seeding failed", error)
        return NextResponse.json({ success: false, error: "Seeding failed" }, { status: 500 })
    }
}
