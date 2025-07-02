// scripts/backfill-user-fields.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  const hashedPassword = await bcrypt.hash('defaultPassword123', 10)

  for (const user of users) {
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        email: `${user.username.toLowerCase()}@example.com`,
        passwordHash: hashedPassword,
      },
    })
  }
}

main().finally(() => prisma.$disconnect());