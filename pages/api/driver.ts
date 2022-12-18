import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const driver = JSON.parse(req.body)
        const savedDriver = await prisma.driver.create({ data: driver })
        res.json(savedDriver)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        const deletedDriver = await prisma.driver.delete({ where: { id: id } })
        res.json(deletedDriver)
    } else if (req.method === 'PATCH') {
        const body = JSON.parse(req.body)
        const updatedDriver = await prisma.driver.update({ where: { id: body.id }, data: body.driver })
        res.json(updatedDriver)
    }

}