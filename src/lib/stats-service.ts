import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { startOfDay, subDays, format } from "date-fns";
import { es } from "date-fns/locale";

export async function getDailyStats() {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), i);
        return startOfDay(d);
    }).reverse();

    // Mocking aggregation if DB is empty or just for structure
    // In real implementation with data:
    const stats = await Promise.all(last7Days.map(async (date) => {
        const count = await db.email.count({
            where: {
                date: {
                    gte: date,
                    lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
                }
            }
        });
        return {
            date: format(date, "dd/MM", { locale: es }),
            count
        };
    }));

    return stats;
}

export async function getStatusCounts() {
    const counts = await db.email.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    });

    const formatted = {
        [Status.NEW]: 0,
        [Status.IN_PROCESS]: 0,
        [Status.ANSWERED]: 0
    };

    counts.forEach(c => {
        formatted[c.status] = c._count.status;
    });

    return formatted;
}

export async function getOverdueEmails() {
    const fiveDaysAgo = subDays(new Date(), 5);

    return await db.email.findMany({
        where: {
            status: { not: Status.ANSWERED },
            date: { lt: fiveDaysAgo }
        }
    });
}
