import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const transport = JSON.parse(req.body)
        const savedTransport = await prisma.transport.create({ data: transport })
        res.json(savedTransport)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedTransport = await prisma.transport.delete({ where: { id: id } })
        res.json(deletedTransport)
    }

}