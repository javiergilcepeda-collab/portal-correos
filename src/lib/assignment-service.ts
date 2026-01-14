import { db } from "@/lib/db";
import { Role, Status } from "@prisma/client";

export const assignEmailToAdvisor = async (emailId: string) => {
    // 1. Get all Advisors
    const advisors = await db.user.findMany({
        where: { role: Role.ADVISOR },
        include: {
            _count: {
                select: {
                    assignedEmails: {
                        where: {
                            status: { in: [Status.NEW, Status.IN_PROCESS] }
                        }
                    }
                }
            }
        }
    });

    if (advisors.length === 0) {
        console.warn("No advisors available for assignment");
        return null;
    }

    // 2. Find advisor with least workload
    const sortedAdvisors = advisors.sort((a, b) => {
        return a._count.assignedEmails - b._count.assignedEmails;
    });

    const bestAdvisor = sortedAdvisors[0];

    // 3. Assign
    await db.email.update({
        where: { id: emailId },
        data: { assigneeId: bestAdvisor.id }
    });

    return bestAdvisor;
};
