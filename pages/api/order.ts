import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const order = JSON.parse(req.body)
        const savedOrder = await prisma.order.create({ data: order })
        res.json(savedOrder)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedOrder = await prisma.order.delete({ where: { id: id } })
        res.json(deletedOrder)
    }

}