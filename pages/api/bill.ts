import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const bill = JSON.parse(req.body)
        const savedBill = await prisma.bill.create({ data: bill })
        res.json(savedBill)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedBill = await prisma.bill.delete({ where: { id: id } })
        res.json(deletedBill)
    }

}