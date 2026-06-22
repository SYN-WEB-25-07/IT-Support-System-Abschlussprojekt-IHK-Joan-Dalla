import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  // 1. Joan Admin erstellen (Rolle: ADMIN)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@it-support.de',
      name: 'Joan Admin',
      password: adminPassword,
      role: 'ADMIN',
    }
  })

  // 2. 10 echte Mitarbeiter definieren (Rolle: USER)
  const employeesData = [
    { email: 'max@firma.de', name: 'Max Mitarbeiter' },
    { email: 'lisa@firma.de', name: 'Lisa Buchhaltung' },
    { email: 'thomas@firma.de', name: 'Thomas Vertrieb' },
    { email: 'julia@firma.de', name: 'Julia Marketing' },
    { email: 'andreas@firma.de', name: 'Andreas Personal' },
    { email: 'laura@firma.de', name: 'Laura Einkauf' },
    { email: 'michael@firma.de', name: 'Michael Logistik' },
    { email: 'sarah@firma.de', name: 'Sarah Design' },
    { email: 'stefan@firma.de', name: 'Stefan Empfang' },
    { email: 'anna@firma.de', name: 'Anna Recht' }
  ]

  const employees = []

  // 10 Mitarbeiter in der DB anlegen
  for (const emp of employeesData) {
    const createdEmp = await prisma.user.create({
      data: {
        email: emp.email,
        name: emp.name,
        password: userPassword, // Alle Mitarbeiter haben dasselbe Passwort zum superleichten Testen!
        role: 'USER'
      }
    })
    employees.push(createdEmp)
  }

  // 3. Vorlagen für 5 unterschiedliche Tickets (die JEDER Mitarbeiter zugeordnet bekommt)
  const problemTemplates = [
    { title: 'Outlook Synchronisationsfehler', desc: 'Meine E-Mails in Outlook hängen fest. Es werden keine neuen Nachrichten geladen, und gesendete Mails verbleiben im Postausgang.', priority: 'MEDIUM', status: 'OPEN' },
    { title: 'Tastatur defekt (Leertaste hakt)', desc: 'Die Leertaste meiner kabellosen Tastatur reagiert nur noch bei sehr festem Druck. Ein flüssiges Arbeiten ist unmöglich.', priority: 'LOW', status: 'IN_PROGRESS' },
    { title: 'VPN-Verbindung bricht ab', desc: 'Die VPN-Verbindung bricht unregelmäßig alle 10 bis 15 Minuten ab. Teams-Anrufe und Remote-Sitzungen werden ständig unterbrochen.', priority: 'HIGH', status: 'OPEN' },
    { title: 'Active Directory Account gesperrt', desc: 'Ich habe mein Windows-Kennwort am Montagmorgen dreimal falsch eingegeben. Mein Account ist gesperrt. Bitte entsperren.', priority: 'HIGH', status: 'CLOSED' },
    { title: 'Mausrad reagiert nicht mehr', desc: 'Das Scrollrad meiner Standard-Firma-Maus hat keine Funktion mehr. Bitte um eine neue Maus.', priority: 'LOW', status: 'CLOSED' }
  ];

  const ticketsToCreate = []

  // Jedem der 10 Mitarbeiter genau seine 5 Tickets zuweisen
  for (const employee of employees) {
    for (let j = 0; j < problemTemplates.length; j++) {
      const template = problemTemplates[j];
      ticketsToCreate.push({
        title: `${template.title} (${employee.name.split(' ')[0]})`, // Name des Mitarbeiters im Betreff zur Übersicht
        description: `${template.desc} Betrifft den Arbeitsplatz von ${employee.name}.`,
        priority: template.priority as any,
        status: template.status as any,
        userId: employee.id,
        createdAt: new Date(Date.now() - j * 60 * 60 * 1000) // Zeitlich leicht gestaffelt
      })
    }
  }

  // 50 Tickets auf einen Schlag in die DB schreiben
  await prisma.ticket.createMany({
    data: ticketsToCreate
  })

  console.log('Erfolgreich! 10 Mitarbeiter wurden mit jeweils genau 5 Tickets angelegt. Gesamt: 50 Tickets.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })