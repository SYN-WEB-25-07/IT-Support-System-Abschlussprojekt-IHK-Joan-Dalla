import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Alte Testdaten löschen, um Duplikate zu vermeiden
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // 1. Einen Administrator anlegen
  const admin = await prisma.user.create({
    data: {
      email: 'admin@it-support.de',
      name: 'Sarah Admin',
    }
  })

  // 2. Realistische Support-Tickets erstellen
  await prisma.ticket.createMany({
    data: [
      {
        title: 'Netzwerkdrucker im 2. OG blockiert',
        description: 'Der Drucker im Flur zeigt permanent Papierstau in Fach 2 an, obwohl kein Papier feststeckt. Ein Neustart behebt den Fehler nicht.',
        priority: 'MEDIUM',
        status: 'OPEN',
        userId: admin.id
      },
      {
        title: 'VPN-Token abgelaufen',
        description: 'Mein VPN-Zugang für das Homeoffice meldet einen abgelaufenen Authentifizierungstoken. Bitte neu generieren.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        userId: admin.id
      },
      {
        title: 'Konfiguration Entwickler-Laptop',
        description: 'Das neu gelieferte ThinkPad für den neuen Mitarbeiter in der Entwicklung muss mit Docker, VS Code und Node.js eingerichtet werden.',
        priority: 'LOW',
        status: 'CLOSED',
        userId: admin.id
      }
    ]
  })

  console.log('Seeding erfolgreich abgeschlossen!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })