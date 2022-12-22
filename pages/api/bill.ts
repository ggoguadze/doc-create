import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"
import { IFullBill } from "../createBill"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const bill: IFullBill = JSON.parse(req.body)
        const {products, ...rest} = bill
        const savedBill = await prisma.bill.create({ data: { ...rest, billProducts: { create: products.map((product)=>({productName: product.productName, quantity:product.quantity, price: product.price, unit: product.unit})) } } })
        res.json(savedBill)
    } else if (req.method === "DELETE") {
        const id = JSON.parse(req.body)
        await prisma.billProduct.deleteMany({where: {billId: id}})
        const deletedBill = await prisma.bill.delete({ where: { id: id } })
        res.json(deletedBill)
    } else if (req.method === "PATCH"){
        const updatedBill = await prisma.bill.updateMany({data: {status: req.body}})
        res.json(updatedBill)
    }
}