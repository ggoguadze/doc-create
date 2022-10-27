import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // const product = await prisma.products.create({ data: req.body })
    // res.json(product)

    if(req.method === 'POST') {
        const product = JSON.parse(req.body)
    const savedProduct = await prisma.products.create({ data: product })
    res.json(savedProduct)
    }else if(req.method === "DELETE")
    {
        const id = JSON.parse(req.body)
        const deletedProduct = await prisma.products.delete({ where: {id: id}   })
        res.json(deletedProduct)
    }
}