import { prisma } from "../../prisma"

export default async function handle(req, res) {
    const customer = await prisma.customer.create({ data: req.body })
    res.json(customer)
}