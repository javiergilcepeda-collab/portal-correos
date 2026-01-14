export type EmailData = {
    googleId: string;
    subject: string;
    snippet: string;
    from: string;
    date: Date;
    attachmentCount: number;
};

// Mock data generator for development
const generateMockEmail = (id: string): EmailData => {
    const subjects = [
        "Consulta sobre producto",
        "Reclamo de servicio",
        "Solicitud de cotización",
        "Agradecimiento",
        "Problema con factura"
    ];
    const senders = [
        "cliente1@example.com",
        "juan.perez@test.com",
        "maria.gomez@empresa.com"
    ];

    return {
        googleId: `msg_${id}`,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        snippet: "Este es un resumen del correo entrante para pruebas...",
        from: senders[Math.floor(Math.random() * senders.length)],
        date: new Date(),
        attachmentCount: Math.floor(Math.random() * 3)
    };
};

export const fetchNewEmails = async (): Promise<EmailData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return 1-3 random emails
    const count = Math.floor(Math.random() * 3) + 1;
    const emails: EmailData[] = [];

    for (let i = 0; i < count; i++) {
        emails.push(generateMockEmail(Date.now().toString() + i));
    }

    return emails;
};
