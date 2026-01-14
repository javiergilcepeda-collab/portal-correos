import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    return (
        <>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <h2 className="text-xl font-bold tracking-tight mr-6">GmailPortal</h2>
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </div>
        </>
    )
}
