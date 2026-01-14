"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Email, Status } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { updateEmailStatus } from "@/lib/actions"

interface TicketListProps {
    emails: Email[]
}

const statusMap = {
    [Status.NEW]: { label: "Nuevo", variant: "default" },
    [Status.IN_PROCESS]: { label: "En Proceso", variant: "secondary" },
    [Status.ANSWERED]: { label: "Contestado", variant: "outline" },
}

export function TicketList({ emails }: TicketListProps) {

    const handleStatusChange = async (id: string, newStatus: Status) => {
        // Call server action here
        console.log("Change status", id, newStatus)
        await updateEmailStatus(id, newStatus)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Asunto</TableHead>
                        <TableHead>De</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Adjuntos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {emails.map((email) => (
                        <TableRow key={email.id}>
                            <TableCell className="font-medium">{email.subject}</TableCell>
                            <TableCell>{email.from}</TableCell>
                            <TableCell>{format(new Date(email.date), "dd MMM HH:mm", { locale: es })}</TableCell>
                            <TableCell>{email.attachmentCount}</TableCell>
                            <TableCell>
                                <Badge variant={statusMap[email.status].variant as any}>
                                    {statusMap[email.status].label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Select
                                    defaultValue={email.status}
                                    onValueChange={(val) => handleStatusChange(email.id, val as Status)}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Status.NEW}>Nuevo</SelectItem>
                                        <SelectItem value={Status.IN_PROCESS}>En Proceso</SelectItem>
                                        <SelectItem value={Status.ANSWERED}>Contestado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                    {emails.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No hay correos asignados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
