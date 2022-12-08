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
    }

}