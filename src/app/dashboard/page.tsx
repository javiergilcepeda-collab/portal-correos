import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Role, Status } from "@prisma/client"
import { getDailyStats, getStatusCounts } from "@/lib/stats-service"
import { DashboardStats } from "@/components/dashboard-stats"
import { DailyStats } from "@/components/charts/daily-stats"
import { TicketList } from "@/components/ticket-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    const role = session.user.role

    // Data fetching based on role
    if (role === Role.ADMIN || role === Role.SUPERVISOR) {
        const dailyStats = await getDailyStats();
        const statusCounts = await getStatusCounts();

        return (
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>

                <DashboardStats counts={statusCounts} />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Ingreso de Correos Diarios</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <DailyStats data={dailyStats} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Resumen General</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Bienvenido al panel de control. Desde aquí puede monitorear el flujo de correos y la atención del equipo.
                            </div>
                            {/* Could add Overdue list here */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Advisor View
    if (role === Role.ADVISOR) {
        const myEmails = await db.email.findMany({
            where: { assigneeId: session.user.id },
            orderBy: { date: 'desc' }
        });

        return (
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Mis Asignaciones</h2>
                </div>
                <TicketList emails={myEmails} />
            </div>
        )
    }

    return <div>Role not recognized</div>
}
