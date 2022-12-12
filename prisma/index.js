const { PrismaClient } = require('@prisma/client')

export const prisma = new PrismaClient()

async function main() {
  //const allUsers = await prisma.customer.findMany()
  //console.log(allUsers)
  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })