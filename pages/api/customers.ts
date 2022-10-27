import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST') {
        const customer = JSON.parse(req.body)
    const savedCustomer = await prisma.customer.create({ data: customer })
    res.json(savedCustomer)
    }else if(req.method === "DELETE")
    {
        const id = JSON.parse(req.body)
        const deletedCustomer = await prisma.customer.delete({ where: {id: id}   })
        res.json(deletedCustomer)
    }
    
}