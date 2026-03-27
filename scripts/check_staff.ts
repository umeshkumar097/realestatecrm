import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    include: {
      agency: true
    }
  })
  
  const agencies = await prisma.agency.findMany()
  
  console.log("=== AGENCIES ===")
  console.table(agencies.map(a => ({ id: a.id, name: a.name })))
  
  console.log("\n=== USERS ===")
  console.table(users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    agencyId: u.agencyId,
    agencyName: u.agency?.name || "ORPHANED"
  })))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
