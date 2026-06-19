import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Admin erstellen
  const admin = await prisma.user.create({
    data: {
      email: 'admin@it-support.de',
      name: 'Sarah Admin',
      password: hashedPassword,
    }
  })

  // 2. Vorlagen für realistische IT-Probleme
  const problemTemplates = [
    { title: 'Monitor flackert', desc: 'Der linke Bildschirm flackert ununterbrochen, wenn er über HDMI angeschlossen ist.', priority: 'MEDIUM' },
    { title: 'VPN-Verbindung bricht ab', description: 'Mein VPN bricht im Homeoffice alle 10 Minuten ab. Teams-Anrufe fliegen ständig raus.', priority: 'HIGH' },
    { title: 'Drucker zeigt Papierstau', description: 'Der Abteilungsdrucker im 2. OG meldet Papierstau im Fach 3, das Fach ist aber komplett leer.', priority: 'LOW' },
    {
      title: 'Active Directory gesperrt',
      desc: 'Ich habe mein Kennwort dreimal falsch eingegeben. Mein AD-Account ist nun gesperrt. Bitte entsperren.',
      priority: 'HIGH',
    },
    { title: 'Outlook synchronisiert nicht', desc: 'Meine E-Mails in Outlook hängen seit gestern Abend fest. Keine neuen Mails kommen an.', priority: 'MEDIUM' },
    { title: 'Neues MacBook einrichten', desc: 'Die Hardware für das neue Teammitglied im Design-Bereich muss noch mit Standardsoftware bespielt werden.', priority: 'LOW' },
    { title: 'Tastatur defekt', desc: 'Die Leertaste meiner kabellosen Tastatur hakt. Bitte um eine neue Ersatztastatur.', priority: 'LOW' },
    { title: 'WLAN-Zugriff fehlerhaft', desc: 'Mein Laptop verbindet sich nicht mehr mit dem Firmen-WLAN "Company-Internal".', priority: 'MEDIUM' }
  ];

  const statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
  const names = ['Michael Müller', 'Laura Becker', 'Thomas Schmidt', 'Julia Fischer', 'Andreas Wagner'];

  const ticketsData = [];

  // Generiere 50 Tickets
  for (let i = 1; i <= 50; i++) {
    const template = problemTemplates[i % problemTemplates.length];
    const status = statuses[i % statuses.length];
    const employeeName = names[i % names.length];

    ticketsData.push({
      title: `${template.title} (#${1000 + i})`,
      description: `${template.desc || template.description} Gemeldet von Mitarbeiter: ${employeeName}.`,
      priority: template.priority as any,
      status: status as any,
      userId: admin.id,
      createdAt: new Date(Date.now() - i * 60 * 60 * 1000), // Gestaffelte Erstellungszeiten
    });
  }

  await prisma.ticket.createMany({
    data: ticketsData
  });

  console.log('50 realistische Tickets wurden erfolgreich generiert!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })