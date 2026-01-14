import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons" 
// We can use Lucide icons
import { LayoutDashboard, Users, Mail, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"

export async function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const session = await auth();

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                General
            </Link>
            {session?.user.role !== 'ADVISOR' && (
                <Link
                    href="/dashboard/stats"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Estadísticas
                </Link>
            )}
            {(session?.user.role === 'ADMIN') && (
                <Link
                    href="/dashboard/users"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Usuarios
                </Link>
            )}
        </nav>
    )
}
