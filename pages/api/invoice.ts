import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const invoice = JSON.parse(req.body)
        const savedInvoice = await prisma.invoice.create({ data: invoice })
        res.json(savedInvoice)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedInvoice = await prisma.invoice.delete({ where: { id: id } })
        res.json(deletedInvoice)
    }

}