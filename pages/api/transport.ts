import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const transport = JSON.parse(req.body)
        const savedTransport = await prisma.transport.create({ data: transport })
        res.json(savedTransport)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedTransport = await prisma.transport.update({ where: { id: id }, data: { isDeleted: true } })
        res.json(deletedTransport)
    } else if (req.method === 'PATCH') {
        const body = JSON.parse(req.body)
        const updatedTransport = await prisma.transport.update({ where: { id: body.id }, data: body.transport })
        res.json(updatedTransport)
    }

}