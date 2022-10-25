import { prisma } from "../../prisma"

export default async function handle(req, res) {
    const product = await prisma.products.create({ data: req.body })
    res.json(product)
}