import { Prisma, PrismaClient } from '@prisma/client'
//npx prisma db seed

const prisma = new PrismaClient();

const customersData:Prisma.CustomerCreateInput[] = [
    {
        email: 'berzs@gmail.com',
        clientName: 'SIA Berzs',
        legalAdress: 'Kuršu 1, Liepāja',
        deliveryAdress: 'Kuršu 1, Liepāja',
        pvnCode: 'LV12345678901',
        account: 'LV12HABA1234567890123',
        bankName: 'Swedbank'
    },
    {
        email: 'liepa@gmail.com',
        clientName: 'SIA Liepa',
        legalAdress: 'Kuršu 2, Liepāja',
        deliveryAdress: 'Kuršu 2, Liepāja',
        pvnCode: 'LV12345678902',
        account: 'LV12HABA1234567890124',
        bankName: 'Swedbank'
    },
    {
        email: 'ozols@gmail.com',
        clientName: 'SIA Ozols',
        legalAdress: 'Kuršu 3, Liepāja',
        deliveryAdress: 'Kuršu 3, Liepāja',
        pvnCode: 'LV12345678903',
        account: 'LV12HABA1234567890125',
        bankName: 'Swedbank'
    },
    {
        email: 'egle@gmail.com',
        clientName: 'SIA Egle',
        legalAdress: 'Kuršu 4, Liepāja',
        deliveryAdress: 'Kuršu 4, Liepāja',
        pvnCode: 'LV12345678904',
        account: 'LV12HABA1234567890126',
        bankName: 'Swedbank'
    },
    {
        email: 'priede@gmail.com',
        clientName: 'SIA Priede',
        legalAdress: 'Kuršu 5, Liepāja',
        deliveryAdress: 'Kuršu 5, Liepāja',
        pvnCode: 'LV12345678905',
        account: 'LV12HABA1234567890127',
        bankName: 'Swedbank'
    }
]

const productsData:Prisma.ProductsCreateInput[] = [
    {
        name: 'Kartupeļu krējums',
        unit: 'kg',
        price: 1.5 
    },
    {
        name: 'Pīrāgi',
        unit: 'kg',
        price: 2.5
    },
    {
        name: 'Kartupeļi',
        unit: 'kg',
        price: 1.5
    },
    {
        name: 'Pārslas',
        unit: 'kg',
        price: 0.5
    },
    {
        name: 'Pīrāgu krējums',
        unit: 'kg',
        price: 3.5
    }
]

const driversData:Prisma.DriverCreateInput[] = [
    {
        name: 'Janis Bērzs'
    },
    {
        name: 'Jānis Liepa'
    },
    {
        name: 'Jānis Ozols'
    },
    {
        name: 'Jānis Egle'
    },
    {
        name: 'Jānis Priede'
    }
]

const transportsData:Prisma.TransportCreateInput[] = [
    {
        name: 'Volvo FH 16',
        number: 'LV1234'
    },
    {
        name: 'VW Crafter',
        number: 'LV1235'
    },
    {
        name: 'Opel Vivaro',
        number: 'LV1236'
    },
    {
        name: 'Mercedes Sprinter',
        number: 'LV1237'
    },
    {
        name: 'Renault Master',
        number: 'LV1238'
    }
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of customersData) {
      const user = await prisma.customer.create({
        data: u,
      })
      console.log(`Created customer with id: ${user.id}`)
    }
    for (const u of productsData) {
        const product = await prisma.products.create({
          data: u,
        })
        console.log(`Created product with id: ${product.id}`)
      }
      for (const u of driversData) {
        const driver = await prisma.driver.create({
          data: u,
        })
        console.log(`Created driver with id: ${driver.id}`)
      }
      for (const u of transportsData) {
        const transport = await prisma.transport.create({
          data: u,
        })
        console.log(`Created transport with id: ${transport.id}`)
      }
    console.log(`Seeding finished.`)
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })